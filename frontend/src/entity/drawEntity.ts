import { Container, Graphics } from 'pixi.js';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_COPPER_WALL, BUILDING_DRILL, BUILDING_ELECTRIC_TURRET, BUILDING_IRON_WALL, BUILDING_TURRET, TILE_SIZE, UNIT_BUG, UNIT_DRONE } from '../config';
import type { Entity } from '../types';

/**
 * Vẽ một thực thể theo loại và kích thước của nó (kích thước hiển thị = số ô × TILE_SIZE).
 * Băng rôn xoay theo rotation (mỗi bước 90°, container quay quanh tâm ô).
 * @param entity Dữ liệu thực thể từ createEntity.
 * @returns Container chứa hình vẽ, (0, 0) là góc trên-trái của thực thể.
 */
export function drawEntity(entity: Entity): Container {
  const container = new Container();
  const graphics = new Graphics();
  const width = entity.width * TILE_SIZE;
  const height = entity.height * TILE_SIZE;

  switch (entity.type) {
    case BUILDING_CORE:
      // Nhà chính: khối vuông lớn với lõi sáng ở giữa (3×3).
      graphics.rect(0, 0, width, height).fill(0x8f6b4a);
      graphics.rect(4, 4, width - 8, height - 8).fill(0xb08a5e);
      graphics.rect(width / 2 - 12, height / 2 - 12, 24, 24).fill(0xffd37f);
      break;

    case BUILDING_TURRET:
      // Trụ súng: đế tròn + nòng hướng lên.
      graphics.circle(width / 2, height / 2, 11).fill(0x6b7280);
      graphics.rect(width / 2 - 2, 2, 4, height / 2 - 4).fill(0x9aa2ad);
      break;

    case BUILDING_ELECTRIC_TURRET:
      // Trụ súng điện: đế tròn xanh + quả cầu điện sáng.
      graphics.circle(width / 2, height / 2, 11).fill(0x3f5e8c);
      graphics.circle(width / 2, height / 2, 5).fill(0x8ad2ff);
      break;

    case BUILDING_DRILL:
      // Dàn khoan (2×2): khung kim loại + khoan ở giữa.
      graphics.rect(0, 0, width, height).fill(0x7a6a55);
      graphics.rect(6, 6, width - 12, height - 12).fill(0x9aa2ad);
      graphics.circle(width / 2, height / 2, 8).fill(0x5a9e3f);
      break;

    case BUILDING_IRON_WALL:
      // Tường sắt: khối xám thép có đường gân.
      graphics.rect(0, 0, width, height).fill(0x8d99a6);
      graphics.rect(6, 6, width - 12, height - 12).fill(0xb3bcc7);
      break;

    case BUILDING_COPPER_WALL:
      // Tường đồng: khối nâu đồng có đường gân.
      graphics.rect(0, 0, width, height).fill(0xb07447);
      graphics.rect(6, 6, width - 12, height - 12).fill(0xd79a68);
      break;

    case BUILDING_BANNER:
      // Băng rôn: cột + lá cờ tam giác; container xoay theo rotation quanh tâm ô.
      graphics.rect(width / 2 - 2, 4, 4, height - 8).fill(0x6b7280);
      graphics.moveTo(width / 2 + 2, 6).lineTo(width / 2 + 24, 12).lineTo(width / 2 + 2, 18).fill(0xd64545);
      break;

    case UNIT_DRONE:
      // Drone: thân tròn nhỏ + 4 chân cảm biến.
      graphics.circle(width / 2, height / 2, 9).fill(0x9aa2ad);
      graphics.circle(width / 2, height / 2, 4).fill(0x6ecdff);
      break;

    case UNIT_BUG:
      // Bọ: thân elip xanh nâu + đầu nhỏ.
      graphics.ellipse(width / 2, height / 2 + 2, 7, 10).fill(0x7a5230);
      graphics.circle(width / 2, height / 2 - 9, 5).fill(0x5c3d22);
      break;

    default:
      // Loại lạ: ô hồng tím để dễ nhận ra lỗi.
      graphics.rect(0, 0, width, height).fill(0xff00ff);
      break;
  }

  // Băng rôn xoay quanh tâm ô theo rotation (mỗi bước 90°).
  // Xoay ở container CON bên trong để container ngoài luôn có gốc ở góc trên-trái ô
  // (drawEntities chỉ cần đặt position theo ô mà không phá vỡ điểm xoay).
  if (entity.type === BUILDING_BANNER) {
    const rotator = new Container();
    rotator.pivot.set(width / 2, height / 2);
    rotator.position.set(width / 2, height / 2);
    rotator.rotation = entity.rotation * (Math.PI / 2);
    rotator.addChild(graphics);
    container.addChild(rotator);
  } else {
    container.addChild(graphics);
  }

  return container;
}
