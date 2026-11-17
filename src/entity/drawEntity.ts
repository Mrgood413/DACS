import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_COPPER_WALL, BUILDING_DRILL, BUILDING_ELECTRIC_TURRET, BUILDING_IRON_WALL, BUILDING_TURRET, TILE_SIZE, UNIT_BUG, UNIT_DRONE } from '../config';
import type { Entity, EntityType } from '../types';

/**
 * Vẽ một thực thể theo định nghĩa và kích thước của nó (kích thước hiển thị = số ô × TILE_SIZE).
 * Nếu có sprite asset cho loại thực thể (getTexture trả về texture) thì vẽ bằng sprite,
 * co đúng kích thước thực thể; không có thì dùng hình vẽ Graphics theo artstyle.png như bản cũ.
 * Băng chuyền (băng rôn) xoay theo rotation (mỗi bước 90°, container con quay quanh tâm ô)
 * — áp cho cả sprite lẫn Graphics.
 * @param entity Dữ liệu thực thể từ createEntity.
 * @param getTexture Hàm tra texture theo loại thực thể (tuỳ chọn; bỏ qua thì luôn vẽ Graphics).
 * @returns Container chứa hình vẽ, (0, 0) là góc trên-trái của thực thể.
 */
export function drawEntity(entity: Entity, getTexture?: (type: EntityType) => Texture | undefined): Container {
  const container = new Container();
  const width = entity.width * TILE_SIZE;
  const height = entity.height * TILE_SIZE;

  // Lớp hình vẽ của thực thể: sprite asset nếu có, ngược lại Graphics theo artstyle.
  const visual = new Container();
  const texture = getTexture?.(entity.type);
  if (texture !== undefined) {
    // Có sprite asset: sprite chiếm trọn kích thước thực thể.
    const sprite = new Sprite(texture);
    sprite.width = width;
    sprite.height = height;
    visual.addChild(sprite);
  } else {
    visual.addChild(drawEntityGraphics(entity, width, height));
  }

  // Băng chuyền xoay quanh tâm ô theo rotation (mỗi bước 90°).
  // Xoay ở container CON bên trong để container ngoài luôn có gốc ở góc trên-trái ô
  // (drawEntities chỉ cần đặt position theo ô mà không phá vỡ điểm xoay).
  if (entity.type === BUILDING_BANNER) {
    const rotator = new Container();
    rotator.pivot.set(width / 2, height / 2);
    rotator.position.set(width / 2, height / 2);
    rotator.rotation = entity.rotation * (Math.PI / 2);
    rotator.addChild(visual);
    container.addChild(rotator);
  } else {
    container.addChild(visual);
  }

  return container;
}

/**
 * Vẽ hình Graphics của một thực thể theo artstyle.png (dùng khi loại thực thể không có sprite asset).
 * @param entity Dữ liệu thực thể (chỉ dùng entity.type để chọn hình).
 * @param width Chiều rộng hiển thị (pixel).
 * @param height Chiều cao hiển thị (pixel).
 * @returns Graphics đã vẽ xong, (0, 0) là góc trên-trái của thực thể.
 */
function drawEntityGraphics(entity: Entity, width: number, height: number): Graphics {
  const graphics = new Graphics();

  switch (entity.type) {
    case BUILDING_CORE: {
      // Core Base HQ: khối kim loại xám có bevel, hõm giữa và lõi cam phát sáng (3×3).
      graphics.rect(0, 0, width, height).fill(0x737986);
      graphics.rect(5, 5, width - 10, height - 10).fill(0x9aa2ad);
      graphics.rect(10, 10, width - 20, height - 20).fill(0x5f6570);
      const coreX = width / 2;
      const coreY = height / 2;
      graphics.rect(coreX - 18, coreY - 18, 36, 36).fill(0xe8842a);
      graphics.rect(coreX - 12, coreY - 12, 24, 24).fill(0xf7c948);
      // Đinh tán 4 góc.
      graphics.circle(8, 8, 3).fill(0x565d69);
      graphics.circle(width - 8, 8, 3).fill(0x565d69);
      graphics.circle(8, height - 8, 3).fill(0x565d69);
      graphics.circle(width - 8, height - 8, 3).fill(0x565d69);
      break;
    }

    case BUILDING_TURRET: {
      // Ballistic Turret: đế tròn xám với 2 nòng hướng lên-phải.
      const centerX = width / 2;
      const centerY = height / 2;
      graphics.circle(centerX, centerY, 11).fill(0x7d828c);
      graphics.circle(centerX, centerY, 11).stroke({ width: 2, color: 0x565d69 });
      graphics.moveTo(centerX - 1, centerY + 1).lineTo(centerX + 9, centerY - 11);
      graphics.moveTo(centerX + 3, centerY + 3).lineTo(centerX + 13, centerY - 9);
      graphics.stroke({ width: 3, color: 0x9aa2ad });
      break;
    }

    case BUILDING_ELECTRIC_TURRET: {
      // Arc Turret: đế tối với chữ thập điện cyan và lõi sáng.
      const centerX = width / 2;
      const centerY = height / 2;
      graphics.circle(centerX, centerY, 11).fill(0x3a3f47);
      graphics.rect(centerX - 10, centerY - 2, 20, 4).fill(0x35d2e0);
      graphics.rect(centerX - 2, centerY - 10, 4, 20).fill(0x35d2e0);
      graphics.circle(centerX, centerY, 4).fill(0xbdf3fa);
      break;
    }

    case BUILDING_DRILL: {
      // Drill Rig: đĩa tối chiếm trọn 2×2 ô với chữ X kim loại sáng ở giữa.
      graphics.rect(0, 0, width, height).fill(0x2e2a26);
      graphics.moveTo(10, 10).lineTo(width - 10, height - 10);
      graphics.moveTo(width - 10, 10).lineTo(10, height - 10);
      graphics.stroke({ width: 9, color: 0xb9bec5 });
      graphics.circle(width / 2, height / 2, 6).fill(0x6b7280);
      break;
    }

    case BUILDING_IRON_WALL: {
      // Iron Wall: tấm kim loại xám sáng có viền và 4 đinh tán.
      graphics.rect(2, 2, width - 4, height - 4).fill(0xb9bec5);
      graphics.rect(2, 2, width - 4, height - 4).stroke({ width: 2, color: 0x8a8f98 });
      graphics.circle(7, 7, 1.5).fill(0x8a8f98);
      graphics.circle(width - 7, 7, 1.5).fill(0x8a8f98);
      graphics.circle(7, height - 7, 1.5).fill(0x8a8f98);
      graphics.circle(width - 7, height - 7, 1.5).fill(0x8a8f98);
      break;
    }

    case BUILDING_COPPER_WALL: {
      // Copper Wall: tấm kim loại cam có viền và 4 đinh tán.
      graphics.rect(2, 2, width - 4, height - 4).fill(0xc9722e);
      graphics.rect(2, 2, width - 4, height - 4).stroke({ width: 2, color: 0x9a5622 });
      graphics.circle(7, 7, 1.5).fill(0x9a5622);
      graphics.circle(width - 7, 7, 1.5).fill(0x9a5622);
      graphics.circle(7, height - 7, 1.5).fill(0x9a5622);
      graphics.circle(width - 7, height - 7, 1.5).fill(0x9a5622);
      break;
    }

    case BUILDING_BANNER: {
      // Băng chuyền fallback (không có sprite asset): dải băng tối với mũi tên hướng lên.
      graphics.rect(4, 4, width - 8, height - 8).fill(0x2e3138);
      graphics.rect(width / 2 - 2, 6, 4, height - 12).fill(0x9aa2ad);
      graphics.moveTo(width / 2 - 8, height / 2 + 6).lineTo(width / 2, height / 2 - 8).lineTo(width / 2 + 8, height / 2 + 6).fill(0x9aa2ad);
      break;
    }

    case UNIT_DRONE: {
      // Player Drone: phi thuyền xám hình mũi nhọn hướng lên với đèn cyan.
      const centerX = width / 2;
      graphics.moveTo(centerX, 3).lineTo(centerX + 9, height - 9).lineTo(centerX, height - 13).lineTo(centerX - 9, height - 9).fill(0x9aa2ad);
      graphics.circle(centerX, 12, 3).fill(0x35d2e0);
      graphics.circle(centerX - 5, height - 8, 2).fill(0x35d2e0);
      graphics.circle(centerX + 5, height - 8, 2).fill(0x35d2e0);
      break;
    }

    case UNIT_BUG: {
      // Enemy Crawler: nhện tối với thân elip, đầu nhỏ và 4 chân.
      const centerX = width / 2;
      const centerY = height / 2 + 2;
      graphics.moveTo(centerX - 5, centerY - 2).lineTo(centerX - 12, centerY - 10);
      graphics.moveTo(centerX - 5, centerY + 2).lineTo(centerX - 12, centerY + 10);
      graphics.moveTo(centerX + 5, centerY - 2).lineTo(centerX + 12, centerY - 10);
      graphics.moveTo(centerX + 5, centerY + 2).lineTo(centerX + 12, centerY + 10);
      graphics.stroke({ width: 2, color: 0x2e2a26 });
      graphics.ellipse(centerX, centerY, 6, 9).fill(0x3a3f47);
      graphics.circle(centerX, centerY - 9, 4).fill(0x2e2a26);
      break;
    }

    default:
      // Loại lạ: ô hồng tím để dễ nhận ra lỗi.
      graphics.rect(0, 0, width, height).fill(0xff00ff);
      break;
  }

  return graphics;
}
