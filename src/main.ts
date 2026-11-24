import { Container, Graphics } from 'pixi.js';
import {
  BUILD_PLAN_ALPHA,
  BUILD_PREVIEW_ALPHA,
  DRONE_SPEED,
  MAP_HEIGHT,
  MAP_WIDTH,
  MINIMAP_MARGIN,
  TILE_SIZE,
} from './config';
import type {
  BuildGhost,
  BuildMenuLayout,
  BuildQueues,
  Camera,
  ConveyorItems,
  CoreResources,
  DrillAccumulators,
  EntityType,
  MoveOrders,
  Point,
} from './types';
import { getTileAt } from './map/getTileAt';
import { getBuildPreview } from './building/getBuildPreview';
import { applyPlacePlans } from './building/applyPlacePlans';
import { applyBuildQueues } from './building/applyBuildQueues';
import { drawBuildGhosts } from './building/drawBuildGhosts';
import { drawHealthBars } from './building/drawHealthBars';
import { applyCancelPlanAt } from './building/applyCancelPlanAt';
import { getAllPlans } from './building/getAllPlans';
import { getPlanGhosts } from './building/getPlanGhosts';
import { getGhostsKey } from './building/getGhostsKey';
import { getBuildableTypes } from './entity/getBuildableTypes';
import { getBuildMenuLayout } from './buildMenu/getBuildMenuLayout';
import { getBuildMenuSlotAt } from './buildMenu/getBuildMenuSlotAt';
import { drawBuildMenu } from './buildMenu/drawBuildMenu';
import { isPointInRect } from './geometry/isPointInRect';
import { createEnvironmentMap } from './map/createEnvironmentMap';
import { createLaneEnvironment } from './map/createLaneEnvironment';
import { getLaneLayout } from './map/getLaneLayout';
import { createApp } from './render/createApp';
import { drawEnvironmentWalls } from './render/drawEnvironmentWalls';
import { drawMapBorder } from './render/drawMapBorder';
import { createMouse } from './input/createMouse';
import { getMouseAction } from './input/getMouseAction';
import { createMouseClicks } from './input/createMouseClicks';
import { clearMouseClicks } from './input/clearMouseClicks';
import { isClickRelease } from './input/isClickRelease';
import { getEdgeScrollDirection } from './camera/getEdgeScrollDirection';
import { moveCamera } from './camera/moveCamera';
import { getMouseWorldPosition } from './camera/getMouseWorldPosition';
import { applyCamera } from './camera/applyCamera';
import { drawMinimap } from './minimap/drawMinimap';
import { getMinimapScale } from './minimap/getMinimapScale';
import { getMinimapCameraRect } from './minimap/getMinimapCameraRect';
import { drawMinimapCameraRect } from './minimap/drawMinimapCameraRect';
import { getSelectionRect } from './selection/getSelectionRect';
import { drawSelectionBox } from './selection/drawSelectionBox';
import { getUnitsInScreenRect } from './selection/getUnitsInScreenRect';
import { drawSelectedUnits } from './selection/drawSelectedUnits';
import { applyMoveCommand } from './unit/applyMoveCommand';
import { applyMoveOrders } from './unit/applyMoveOrders';
import { createStartingEntities } from './entity/createStartingEntities';
import { getEntityCenter } from './entity/getEntityCenter';
import { drawEntities } from './entity/drawEntities';
import { drawTerrainSprites } from './render/drawTerrainSprites';
import {
  CONVEYOR_MOVE_TEXTURE_URLS,
  ENTITY_BASE_TEXTURE_URLS,
  ENTITY_TEXTURE_URLS,
  ENV_WALL_TEXTURE_URLS,
  loadTextureMap,
} from './render/loadGameTextures';
import { createResourceCounter } from './hud/createResourceCounter';
import { drawConveyorItems } from './logistics/drawConveyorItems';
import { updateConveyors } from './logistics/updateConveyors';
import { updateDrills } from './logistics/updateDrills';
import { updateEnemies } from './logistics/updateEnemies';
import { updateRouters } from './logistics/updateRouters';
import { updateTurrets } from './logistics/updateTurrets';

/**
 * Điểm bắt đầu của frontend: map hành lang (hai bên tường đá, giữa là cỏ, đáy có 2 làn quặng),
 * nhà chính và drone; camera, minimap, chọn drone, menu xây dựng, xây công trình.
 */
export async function main(): Promise<void> {
  const app = await createApp();
  const map = createLaneEnvironment(createEnvironmentMap(MAP_WIDTH, MAP_HEIGHT));

  // Tải sẵn sprite asset cho thực thể và tường môi trường (thiếu loại nào thì loại đó fallback Graphics).
  const [entityTextures, wallTextures, conveyorMoveTextures, entityBaseTextures] = await Promise.all([
    loadTextureMap(ENTITY_TEXTURE_URLS),
    loadTextureMap(ENV_WALL_TEXTURE_URLS),
    loadTextureMap(CONVEYOR_MOVE_TEXTURE_URLS),
    loadTextureMap(ENTITY_BASE_TEXTURE_URLS),
  ]);

  // Lớp 1: thế giới game (di chuyển theo camera): địa hình (sprite asset) → tường môi trường → thực thể → viền map.
  const world = new Container();
  world.addChild(await drawTerrainSprites(map));
  world.addChild(drawEnvironmentWalls(map, (wallId) => wallTextures.get(wallId)));
  // Lúc bắt đầu chỉ có nhà chính và drone của người chơi.
  const entities = createStartingEntities(getLaneLayout(map.width, map.height));
  const entityLayer = drawEntities(
    entities,
    (type) => entityTextures.get(type),
    (type) => conveyorMoveTextures.get(type),
    (type) => entityBaseTextures.get(type),
  );
  world.addChild(entityLayer);
  // Bóng mờ của công trình đang chờ xây, rồi bóng xem trước dưới con trỏ (chỉ vẽ lại khi thay đổi).
  const planGhosts = new Container();
  world.addChild(planGhosts);
  const previewGhosts = new Container();
  world.addChild(previewGhosts);
  // Vật phẩm trên băng chuyền (vẽ lại mỗi khung hình, nằm trên thực thể).
  const conveyorItemGraphics = new Graphics();
  world.addChild(conveyorItemGraphics);
  // Thanh máu / thanh đạn dưới công trình (vẽ lại mỗi khung hình).
  const healthBars = new Graphics();
  world.addChild(healthBars);
  // Khung xanh đánh dấu đơn vị đang được chọn (toạ độ thế giới, nằm trên thực thể).
  const selectedMarkers = new Graphics();
  world.addChild(selectedMarkers);
  world.addChild(drawMapBorder(map));
  app.stage.addChild(world);

  // Lớp 2: hộp chọn (toạ độ màn hình, không di chuyển theo camera).
  const selection = new Graphics();
  app.stage.addChild(selection);

  // Lớp 3: minimap, nằm trên cùng.
  const minimap = new Container();
  minimap.x = MINIMAP_MARGIN;
  minimap.y = MINIMAP_MARGIN;
  minimap.addChild(drawMinimap(map));
  const minimapCamera = new Graphics();
  minimap.addChild(minimapCamera);
  app.stage.addChild(minimap);

  // Lớp 4: menu xây dựng góc dưới-phải, chỉ hiện khi đang chọn drone. Chỉ vẽ lại khi có thay đổi.
  const buildMenu = new Container();
  buildMenu.visible = false;
  app.stage.addChild(buildMenu);

  // Lớp 5: HUD kho tài nguyên nhà chính, neo trên cùng màn hình (giữa theo chiều ngang).
  const resourceCounter = createResourceCounter();
  app.stage.addChild(resourceCounter.container);

  // Trạng thái logistics: item trên băng, thời gian sản xuất của máy đào, kho nhà chính.
  const conveyorItems: ConveyorItems = new Map();
  const drillAccumulators: DrillAccumulators = new Map();
  const coreResources: CoreResources = new Map();
  let enemySpawnAccumulator = 0;
  const buildableTypes = getBuildableTypes();
  let selectedBuildType: EntityType | null = null;
  let buildMenuLayout: BuildMenuLayout = getBuildMenuLayout(buildableTypes.length, app.screen.width, app.screen.height);
  let buildMenuDrawnKey = '';

  function isOverBuildMenu(x: number, y: number): boolean {
    return buildMenu.visible && isPointInRect(buildMenuLayout.panel, x, y);
  }

  function isOverUi(x: number, y: number): boolean {
    return isOverMinimap(x, y) || isOverBuildMenu(x, y);
  }

  const scale = getMinimapScale(map);
  const minimapWidth = map.width * TILE_SIZE * scale;
  const minimapHeight = map.height * TILE_SIZE * scale;

  function isOverMinimap(x: number, y: number): boolean {
    return (
      x >= MINIMAP_MARGIN &&
      x <= MINIMAP_MARGIN + minimapWidth &&
      y >= MINIMAP_MARGIN &&
      y <= MINIMAP_MARGIN + minimapHeight
    );
  }

  const mouse = createMouse(window);
  const clicks = createMouseClicks(window);
  // Đơn vị đang được chọn và lệnh di chuyển đang chờ.
  let selectedIds: number[] = [];
  const moveOrders: MoveOrders = new Map();
  // Hàng chờ xây của từng drone, và khoá của lần vẽ bóng gần nhất (để chỉ vẽ lại khi thay đổi).
  const buildQueues: BuildQueues = new Map();
  let planGhostsKey = '';
  let previewGhostsKey = '';
  // Hướng xoay công trình sắp đặt (0–3), đổi bằng phím R.
  let buildRotation = 0;
  // Camera bắt đầu ở tâm nhà chính (thực thể đầu tiên của createStartingEntities).
  const startEntity = entities[0];
  let camera: Camera =
    startEntity !== undefined
      ? getEntityCenter(startEntity)
      : { x: (map.width * TILE_SIZE) / 2, y: (map.height * TILE_SIZE) / 2 };

  // Thả chuột trái trên minimap → camera DỊCH CHUYỂN TỨC THỜI tới vị trí trên map
  // tương ứng với điểm được thu nhỏ (không chạy mượt dần nữa).
  window.addEventListener('mouseup', (event) => {
    const e = event as MouseEvent;
    if (e.button !== 0) {
      return;
    }
    if (!isOverMinimap(e.clientX, e.clientY)) {
      return;
    }
    camera = {
      x: Math.max(0, Math.min(map.width * TILE_SIZE, (e.clientX - MINIMAP_MARGIN) / scale)),
      y: Math.max(0, Math.min(map.height * TILE_SIZE, (e.clientY - MINIMAP_MARGIN) / scale)),
    };
  });

  app.ticker.add((ticker) => {
    const deltaSeconds = ticker.deltaMS / 1000;
    entityLayer.updateAnimations(deltaSeconds);

    // Menu xây dựng hiện khi đang chọn drone; bố cục tính lại theo kích thước màn hình.
    buildMenu.visible = selectedIds.length > 0;
    buildMenuLayout = getBuildMenuLayout(buildableTypes.length, app.screen.width, app.screen.height);

    // Con trỏ đang trên minimap hoặc menu thì không cuộn mép màn hình.
    const direction = isOverUi(mouse.x, mouse.y)
      ? { x: 0, y: 0 }
      : getEdgeScrollDirection(mouse, app.screen.width, app.screen.height);
    camera = moveCamera(camera, direction, deltaSeconds, map);

    applyCamera(world, camera, app.screen.width, app.screen.height);

    // Chế độ xây: đang chọn drone và đã chọn một loại công trình trong menu.
    let buildType = selectedIds.length > 0 ? selectedBuildType : null;
    // Vị trí chuột trong thế giới — null khi chuột không ở trên map (ra ngoài cửa sổ, hoặc trên minimap/menu).
    const mouseWorld: Point | null =
      mouse.inside && !isOverUi(mouse.x, mouse.y) ? getMouseWorldPosition(mouse.x, mouse.y, world) : null;
    const dragStartWorld = getMouseWorldPosition(mouse.dragStartX, mouse.dragStartY, world);
    const dragStartTile = getTileAt(dragStartWorld.x, dragStartWorld.y);

    // Xử lý thả chuột trái bằng vị trí và Shift lúc thả (clicks.left*), không dùng mouse.x vì chuột có thể đã đi tiếp.
    if (clicks.leftReleased) {
      if (isOverBuildMenu(mouse.dragStartX, mouse.dragStartY)) {
        // Click ô trong menu → chọn loại công trình đó; click lại ô đang chọn → bỏ chọn.
        const slot = getBuildMenuSlotAt(buildMenuLayout, clicks.leftX, clicks.leftY);
        const type = slot === null ? undefined : buildableTypes[slot];
        if (type !== undefined) {
          selectedBuildType = type === selectedBuildType ? null : type;
        }
      } else if (!isOverMinimap(mouse.dragStartX, mouse.dragStartY)) {
        const releaseWorld = getMouseWorldPosition(clicks.leftX, clicks.leftY, world);
        const releaseTile = getTileAt(releaseWorld.x, releaseWorld.y);
        if (buildType !== null) {
          // Click thường lên công trình đã có trong hàng chờ → huỷ nó (đang xây dở thì xoá luôn),
          // vẫn giữ công trình đang chọn để huỷ tiếp.
          const cancel = clicks.leftShift
            ? { cancelled: false, removedEntityId: null }
            : applyCancelPlanAt(buildQueues, entities, releaseTile);
          if (cancel.removedEntityId !== null) {
            entityLayer.removeEntity(cancel.removedEntityId);
          }
          if (!cancel.cancelled) {
            // Chế độ xây: đặt 1 công trình ở ô thả chuột, hoặc cả hàng nếu giữ Shift kéo → vào hàng chờ của drone.
            const ghosts = getBuildPreview(
              map,
              entities,
              getAllPlans(buildQueues),
              buildType,
              clicks.leftShift ? dragStartTile : null,
              releaseTile,
              buildRotation,
            );
            const droneId = selectedIds[0];
            if (droneId !== undefined) {
              const queue = buildQueues.get(droneId) ?? [];
              applyPlacePlans(queue, ghosts);
              buildQueues.set(droneId, queue);
            }
            // Click thường (không giữ Shift) chỉ đặt một công trình rồi tự bỏ chọn công trình.
            // Giữ Shift thì vẫn giữ công trình đang chọn để kéo tiếp hàng khác.
            if (!clicks.leftShift) {
              selectedBuildType = null;
              buildType = null;
            }
          }
        } else {
          // Không ở chế độ xây. Thả chuột trái (kéo hộp hoặc click) trên map:
          // trúng drone → chọn; click (không kéo) trúng công trình đang chờ/đang xây → huỷ nó, giữ lựa chọn drone;
          // còn lại → chọn theo hộp (vùng trống thì bỏ chọn).
          const box = getSelectionRect(mouse.dragStartX, mouse.dragStartY, clicks.leftX, clicks.leftY);
          const unitsHit = getUnitsInScreenRect(entities, box, world);
          const isClick = isClickRelease(mouse.dragStartX, mouse.dragStartY, clicks.leftX, clicks.leftY);
          const cancel =
            unitsHit.length === 0 && isClick
              ? applyCancelPlanAt(buildQueues, entities, releaseTile)
              : { cancelled: false, removedEntityId: null };
          if (cancel.removedEntityId !== null) {
            entityLayer.removeEntity(cancel.removedEntityId);
          }
          if (!cancel.cancelled) {
            selectedIds = unitsHit;
          }
        }
      }
    }
    // Lăn chuột ở chế độ xây → xoay hướng công trình sắp đặt (giữ nguyên hướng sau khi bỏ chọn).
    if (buildType !== null && clicks.rotateDelta !== 0) {
      buildRotation = ((buildRotation + clicks.rotateDelta) % 4 + 4) % 4;
    }
    if (buildType !== null && (clicks.escapePressed || clicks.rightPressed)) {
      // Chế độ xây: Esc hoặc chuột phải → bỏ chọn công trình (chuột phải lúc này không ra lệnh di chuyển).
      selectedBuildType = null;
      buildType = null;
    } else if (clicks.rightPressed && !isOverUi(clicks.rightX, clicks.rightY)) {
      // Bấm chuột phải trên map → drone đang chọn bay tới điểm bấm.
      const target = getMouseWorldPosition(clicks.rightX, clicks.rightY, world);
      applyMoveCommand(moveOrders, entities, selectedIds, target.x, target.y, map);
    }
    clearMouseClicks(clicks);

    applyMoveOrders(entities, moveOrders, DRONE_SPEED, deltaSeconds);
    // Drone làm hàng chờ xây; công trình vừa bắt đầu xây thì vẽ thêm vào lớp thực thể.
    for (const site of applyBuildQueues(buildQueues, entities, moveOrders, map, DRONE_SPEED, deltaSeconds)) {
      entityLayer.addEntity(
        site,
        (type) => entityTextures.get(type),
        (type) => conveyorMoveTextures.get(type),
        (type) => entityBaseTextures.get(type),
      );
    }
    entityLayer.updateViews(entities);

    // Logistics: máy đào tạo item → băng chuyền vận chuyển/đẩy vào trụ súng, router hoặc nhà chính → trụ bắn.
    updateDrills(entities, map, drillAccumulators, conveyorItems, deltaSeconds);
    updateConveyors(entities, conveyorItems, coreResources, deltaSeconds);
    updateRouters(entities, conveyorItems, deltaSeconds);
    updateTurrets(entities, deltaSeconds);
    // Enemy: spawn từ các Enemy Spawn Node ngoài ranh giới, di chuyển vào bản đồ, tìm đường đến Core và tấn công.
    enemySpawnAccumulator = updateEnemies(entities, map, enemySpawnAccumulator, deltaSeconds);
    drawConveyorItems(conveyorItemGraphics, entities, conveyorItems);
    resourceCounter.update(coreResources, app.screen.width, app.screen.height);

    drawHealthBars(healthBars, entities, mouseWorld);
    drawSelectedUnits(selectedMarkers, entities, selectedIds);

    // Bóng mờ: hàng chờ xây, và bóng xem trước dưới con trỏ ở chế độ xây (một cái, hoặc cả hàng khi giữ Shift kéo).
    const planGhostList = getPlanGhosts(buildQueues);
    const planKey = getGhostsKey(planGhostList);
    if (planKey !== planGhostsKey) {
      drawBuildGhosts(
        planGhosts,
        planGhostList,
        BUILD_PLAN_ALPHA,
        (type) => entityTextures.get(type),
        (type) => entityBaseTextures.get(type),
      );
      planGhostsKey = planKey;
    }
    let previewList: BuildGhost[] = [];
    if (buildType !== null && mouseWorld !== null) {
      const draggingLine = mouse.leftDown && mouse.shiftDown && !isOverUi(mouse.dragStartX, mouse.dragStartY);
      previewList = getBuildPreview(
        map,
        entities,
        getAllPlans(buildQueues),
        buildType,
        draggingLine ? dragStartTile : null,
        getTileAt(mouseWorld.x, mouseWorld.y),
        buildRotation,
      );
    }
    const previewKey = getGhostsKey(previewList);
    if (previewKey !== previewGhostsKey) {
      drawBuildGhosts(
        previewGhosts,
        previewList,
        BUILD_PREVIEW_ALPHA,
        (type) => entityTextures.get(type),
        (type) => entityBaseTextures.get(type),
      );
      previewGhostsKey = previewKey;
    }

    drawMinimapCameraRect(
      minimapCamera,
      getMinimapCameraRect(camera, app.screen.width, app.screen.height, map),
    );

    // Bỏ chọn drone thì menu ẩn và quên luôn loại công trình đang chọn.
    if (selectedIds.length === 0) {
      selectedBuildType = null;
    }
    const buildMenuKey = `${app.screen.width}x${app.screen.height}:${selectedBuildType}`;
    if (selectedIds.length > 0 && buildMenuKey !== buildMenuDrawnKey) {
      drawBuildMenu(
        buildMenu,
        buildMenuLayout,
        buildableTypes,
        selectedBuildType,
        (type) => entityTextures.get(type),
        (type) => entityBaseTextures.get(type),
      );
      buildMenuDrawnKey = buildMenuKey;
    }

    // Hộp chọn chỉ hiện khi bắt đầu kéo trên map (không phải trên minimap hay menu) và không ở chế độ xây.
    const action = getMouseAction(mouse);
    if (action === 'DRAGGING' && buildType === null && !isOverUi(mouse.dragStartX, mouse.dragStartY)) {
      drawSelectionBox(selection, getSelectionRect(mouse.dragStartX, mouse.dragStartY, mouse.x, mouse.y));
    } else {
      drawSelectionBox(selection, null);
    }
  });
}

void main();
