import { Container, Graphics } from 'pixi.js';
import { MAP_HEIGHT, MAP_WIDTH, MINIMAP_MARGIN, TILE_SIZE } from './config';
import type { Camera } from './types';
import { createMap } from './map/createMap';
import { createApp } from './render/createApp';
import { drawTiles } from './render/drawTiles';
import { drawMapBorder } from './render/drawMapBorder';
import { createMouse } from './input/createMouse';
import { getEdgeScrollDirection } from './camera/getEdgeScrollDirection';
import { moveCamera } from './camera/moveCamera';
import { applyCamera } from './camera/applyCamera';
import { drawMinimap } from './minimap/drawMinimap';
import { getMinimapCameraRect } from './minimap/getMinimapCameraRect';
import { drawMinimapCameraRect } from './minimap/drawMinimapCameraRect';
import { getSelectionRect } from './selection/getSelectionRect';
import { drawSelectionBox } from './selection/drawSelectionBox';

/**
 * Điểm bắt đầu của frontend: map debug, camera chạy khi chuột ở mép màn hình,
 * minimap góc trên-trái, giữ chuột phải kéo để vẽ hộp chọn.
 */
export async function main(): Promise<void> {
  const app = await createApp();
  const map = createMap(MAP_WIDTH, MAP_HEIGHT);

  // Lớp 1: thế giới game (di chuyển theo camera).
  const world = new Container();
  world.addChild(drawTiles(map));
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

  const mouse = createMouse(window);
  let camera: Camera = {
    x: (map.width * TILE_SIZE) / 2,
    y: (map.height * TILE_SIZE) / 2,
  };

  app.ticker.add((ticker) => {
    const direction = getEdgeScrollDirection(mouse, app.screen.width, app.screen.height);
    camera = moveCamera(camera, direction, ticker.deltaMS / 1000, map);
    applyCamera(world, camera, app.screen.width, app.screen.height);

    drawMinimapCameraRect(
      minimapCamera,
      getMinimapCameraRect(camera, app.screen.width, app.screen.height, map),
    );

    if (mouse.rightDown) {
      drawSelectionBox(selection, getSelectionRect(mouse.dragStartX, mouse.dragStartY, mouse.x, mouse.y));
    } else {
      drawSelectionBox(selection, null);
    }
  });
}

void main();
