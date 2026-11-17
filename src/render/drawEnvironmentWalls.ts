import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { TILE_SIZE } from '../config';
import type { EnvironmentMap } from '../types';
import { getEnvironmentWallAppearance } from '../map/getEnvironmentWallAppearance';

/**
 * Vẽ các tường môi trường đè lên địa hình (dùng làm lớp riêng phía trên lớp địa hình,
 * nên dữ liệu địa hình bên dưới không bị xoá hay thay đổi).
 * Cả 3 loại tường (đá / cỏ / bụi cây) đều có sprite asset — có texture thì vẽ sprite
 * chiếm trọn ô; loại nào thiếu texture thì vẽ Graphics theo artstyle.png.
 * @param map Map môi trường từ createEnvironmentMap.
 * @param getWallTexture Hàm tra texture theo mã tường (tuỳ chọn; bỏ qua thì luôn vẽ Graphics).
 * @returns Container đã vẽ xong, chỉ chứa các ô có tường (ô không tường thì trống).
 */
export function drawEnvironmentWalls(map: EnvironmentMap, getWallTexture?: (wallId: number) => Texture | undefined): Container {
  const container = new Container();
  const graphics = new Graphics();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const wallId = map.wall[y * map.width + x];
      const appearance = getEnvironmentWallAppearance(wallId);
      if (appearance === null) {
        continue;
      }
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const texture = getWallTexture?.(wallId);
      if (texture !== undefined) {
        // Có sprite asset: sprite chiếm trọn ô.
        const sprite = new Sprite(texture);
        sprite.position.set(px, py);
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        container.addChild(sprite);
        continue;
      }
      drawWall(graphics, px, py, appearance.shape, appearance.color);
    }
  }
  container.addChild(graphics);

  return container;
}

/**
 * Vẽ một tường môi trường trong phạm vi một ô — hình dáng theo artstyle.png.
 * @param graphics Graphics để vẽ vào.
 * @param px Toạ độ pixel góc trên-trái của ô (trục ngang).
 * @param py Toạ độ pixel góc trên-trái của ô (trục dọc).
 * @param shape Hình dáng tường ('stone' | 'grass' | 'bush').
 * @param color Màu chính của tường.
 */
function drawWall(graphics: Graphics, px: number, py: number, shape: 'stone' | 'grass' | 'bush', color: number): void {
  const size = TILE_SIZE;
  const centerX = px + size / 2;
  const centerY = py + size / 2;

  if (shape === 'stone') {
    // Rock Wall: hòn đá tròn tối với phần sáng phía trên-trái và bóng phía dưới-phải.
    graphics.circle(centerX, centerY, 11).fill(color);
    graphics.circle(centerX - 3, centerY - 4, 6).fill(0x565d69);
    graphics.circle(centerX + 4, centerY + 5, 4).fill(0x2e343c);
    return;
  }

  if (shape === 'grass') {
    // Overgrown Wall: khối vuông phủ rêu, có các mảng rêu sáng/tối.
    graphics.rect(px + 4, py + 4, size - 8, size - 8).fill(color);
    graphics.rect(px + 7, py + 7, 8, 6).fill(0x5d8a3a);
    graphics.rect(px + 18, py + 17, 7, 8).fill(0x3f662a);
    graphics.rect(px + 17, py + 6, 6, 5).fill(0x5d8a3a);
    return;
  }

  // Dusty Bush: cụm lá tròn với chồi sáng ở giữa.
  graphics.circle(centerX - 5, centerY + 4, 6).fill(color);
  graphics.circle(centerX + 5, centerY + 3, 6).fill(color);
  graphics.circle(centerX, centerY - 5, 6).fill(color);
  graphics.circle(centerX + 1, centerY - 7, 2).fill(0x77b35c);
}
