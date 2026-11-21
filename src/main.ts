import { Container, Graphics } from 'pixi.js';
import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  DRONE_SPEED,
  MAP_HEIGHT,
  MAP_WIDTH,
  MINIMAP_MARGIN,
  TILE_SIZE,
  UNIT_BUG,
  UNIT_DRONE,
} from './config';
import type { Camera, Entity, EntityType, MoveOrders } from './types';
import { createEnvironmentMap } from './map/createEnvironmentMap';
import { createDemoEnvironment } from './map/createDemoEnvironment';
import { createApp } from './render/createApp';
import { drawEnvironmentWalls } from './render/drawEnvironmentWalls';
import { drawMapBorder } from './render/drawMapBorder';
import { createMouse } from './input/createMouse';
import { getMouseAction } from './input/getMouseAction';
import { createMouseClicks } from './input/createMouseClicks';
import { clearMouseClicks } from './input/clearMouseClicks';
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
import { createDemoEntities } from './entity/createDemoEntities';
import { getDemoEntityPositions } from './entity/getDemoEntityPositions';
import { drawEntities } from './entity/drawEntities';
import { drawTerrainSprites } from './render/drawTerrainSprites';
import {
  CONVEYOR_MOVE_TEXTURE_URLS,
  ENTITY_BASE_TEXTURE_URLS,
  ENTITY_TEXTURE_URLS,
  ENV_WALL_TEXTURE_URLS,
  loadTextureMap,
} from './render/loadGameTextures';

/**
 * Gán vị trí demo cho từng thực thể theo tra cứu loại.
 * @param entities Danh sách thực thể (bị thay đổi x, y, rotation tại chỗ).
 * @param positions Vị trí demo từ getDemoEntityPositions.
 */
function applyDemoPositions(entities: Entity[], positions: ReturnType<typeof getDemoEntityPositions>): void {
  const positionByType = new Map<EntityType, { x: number; y: number; rotation: number }>(
    positions.map((position) => [position.type, position]),
  );
  for (const entity of entities) {
    const position = positionByType.get(entity.type);
    if (position !== undefined) {
      entity.x = position.x;
      entity.y = position.y;
      entity.rotation = position.rotation;
    }
  }
}

/**
 * Điểm bắt đầu của frontend: bản demo hoàn chỉnh — map môi trường (5 loại địa hình, 3 loại tường),
 * 9 thực thể demo ở góc dưới-phải, camera chạy khi chuột ở mép màn hình,
 * click vào minimap để camera dịch chuyển tức thời tới vị trí tương ứng, giữ kéo chuột trái để vẽ hộp chọn,
 * minimap góc trên-trái.
 */
export async function main(): Promise<void> {
  const app = await createApp();
  const map = createDemoEnvironment(createEnvironmentMap(MAP_WIDTH, MAP_HEIGHT));

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
  const entities = createDemoEntities();
  applyDemoPositions(entities, getDemoEntityPositions(map));
  const entityLayer = drawEntities(
    entities,
    (type) => entityTextures.get(type),
    (type) => conveyorMoveTextures.get(type),
    (type) => entityBaseTextures.get(type),
  );
  world.addChild(entityLayer);
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
  let camera: Camera = {
    x: (map.width * TILE_SIZE) / 2,
    y: (map.height * TILE_SIZE) / 2,
  };

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

    // Con trỏ đang trên minimap thì không cuộn mép màn hình (minimap không phải map).
    const direction = isOverMinimap(mouse.x, mouse.y)
      ? { x: 0, y: 0 }
      : getEdgeScrollDirection(mouse, app.screen.width, app.screen.height);
    camera = moveCamera(camera, direction, deltaSeconds, map);

    applyCamera(world, camera, app.screen.width, app.screen.height);

    // Thả chuột trái (kéo hộp hoặc click) ngoài minimap → chọn drone trong vùng; vùng trống → bỏ chọn.
    if (clicks.leftReleased && !isOverMinimap(mouse.dragStartX, mouse.dragStartY)) {
      const box = getSelectionRect(mouse.dragStartX, mouse.dragStartY, mouse.x, mouse.y);
      selectedIds = getUnitsInScreenRect(entities, box, world);
    }
    // Bấm chuột phải ngoài minimap → drone đang chọn bay tới điểm bấm.
    if (clicks.rightPressed && !isOverMinimap(clicks.rightX, clicks.rightY)) {
      const target = getMouseWorldPosition(clicks.rightX, clicks.rightY, world);
      applyMoveCommand(moveOrders, entities, selectedIds, target.x, target.y, map);
    }
    clearMouseClicks(clicks);

    applyMoveOrders(entities, moveOrders, DRONE_SPEED, deltaSeconds);
    entityLayer.updatePositions(entities);
    drawSelectedUnits(selectedMarkers, entities, selectedIds);

    drawMinimapCameraRect(
      minimapCamera,
      getMinimapCameraRect(camera, app.screen.width, app.screen.height, map),
    );

    const action = getMouseAction(mouse);
    if (action === 'DRAGGING') {
      drawSelectionBox(selection, getSelectionRect(mouse.dragStartX, mouse.dragStartY, mouse.x, mouse.y));
    } else {
      drawSelectionBox(selection, null);
    }
  });
}

void main();
