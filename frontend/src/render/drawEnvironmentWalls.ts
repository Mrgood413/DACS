import { Graphics } from 'pixi.js';
import { ENV_WALL_NONE, TILE_SIZE } from '../config';
import type { EnvironmentMap } from '../types';
import { getEnvironmentWallAppearance } from '../map/getEnvironmentWallAppearance';

/**
 * Vẽ các tường môi trường đè lên địa hình (dùng làm lớp riêng phía trên lớp địa hình,
 * nên dữ liệu địa hình bên dưới không bị xoá hay thay đổi).
 * @param map Map môi trường từ createEnvironmentMap.
 * @returns Graphics đã vẽ xong, chỉ chứa các ô có tường (ô không tường thì trống).
 */
export function drawEnvironmentWalls(map: EnvironmentMap): Graphics {
  const graphics = new Graphics();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const appearance = getEnvironmentWallAppearance(map.wall[y * map.width + x]);
      if (appearance === null) {
        continue;
      }
      drawWall(graphics, x * TILE_SIZE, y * TILE_SIZE, appearance.shape, appearance.color);
    }
  }

  return graphics;
}

/**
 * Vẽ một tường môi trường trong phạm vi một ô.
 * @param graphics Graphics để vẽ vào.
 * @param px Toạ độ pixel góc trên-trái của ô.
 * @param py Toạ độ pixel góc trên-trái của ô (trục dọc).
 * @param shape Hình dáng tường ('stone' | 'grass' | 'bush').
 * @param color Màu chính của tường.
 */
function drawWall(graphics: Graphics, px: number, py: number, shape: 'stone' | 'grass' | 'bush', color: number): void {
  const size = TILE_SIZE;
  const margin = 3; // chừa mép cho tường nhỏ hơn ô một chút, nhìn như vật nổi trên nền.

  if (shape === 'stone') {
    // Cụm đá: đá to giữa ô + 2 viên đá nhỏ kề bên.
    graphics
      .rect(px + margin + 4, py + margin + 4, size - (margin + 4) * 2, size - (margin + 4) * 2)
      .fill(color);
    graphics.circle(px + margin + 4, py + margin + 8, 4).fill(color);
    graphics.circle(px + size - margin - 5, py + size - margin - 9, 5).fill(color);
    return;
  }

  if (shape === 'grass') {
    // Bụi cỏ: nhiều lưỡi cỏ nhỏ dựng trên nửa dưới của ô.
    const baseY = py + size - margin;
    for (let i = 0; i < 5; i++) {
      const bladeX = px + margin + 4 + i * ((size - (margin + 4) * 2) / 4);
      const bladeHeight = i % 2 === 0 ? 10 : 7;
      graphics.moveTo(bladeX, baseY).lineTo(bladeX, baseY - bladeHeight);
    }
    graphics.stroke({ width: 2, color });
    return;
  }

  // Bụi cây: cụm tròn xanh sẫm với chấm sáng nhỏ ở giữa.
  const centerX = px + size / 2;
  const centerY = py + size / 2;
  graphics.circle(centerX, centerY, 9).fill(color);
  graphics.circle(centerX - 6, centerY + 4, 6).fill(color);
  graphics.circle(centerX + 6, centerY + 3, 6).fill(color);
  graphics.circle(centerX, centerY - 2, 2).fill(0x77b35c);
}
