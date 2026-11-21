import { Container } from 'pixi.js';
import type { Texture } from 'pixi.js';
import { TILE_SIZE } from '../config';
import type { Entity, EntityType } from '../types';
import { drawEntity, EntityView } from './drawEntity';

/** Hàm tra texture theo loại thực thể; trả về undefined nếu loại đó không có ảnh. */
type TextureLookup = (type: EntityType) => Texture | undefined;

/** Lớp chứa hình của mọi thực thể. Giữ liên kết id → hình để cập nhật vị trí và animation mỗi khung hình. */
export class EntityLayer extends Container {
  private readonly entityViews: EntityView[] = [];
  private readonly viewsById = new Map<number, EntityView>();

  /**
   * Vẽ thêm một thực thể và đặt nó đúng toạ độ thế giới (ô × TILE_SIZE).
   * @param entity Thực thể cần vẽ.
   * @param getTexture Tra ảnh chính (tuỳ chọn).
   * @param getAnimationTexture Tra khung hình 1 của animation băng chuyền (tuỳ chọn).
   * @param getBaseTexture Tra ảnh bệ của thực thể nhiều lớp như trụ súng (tuỳ chọn).
   */
  addEntity(
    entity: Entity,
    getTexture?: TextureLookup,
    getAnimationTexture?: TextureLookup,
    getBaseTexture?: TextureLookup,
  ): void {
    const view = drawEntity(entity, getTexture, getAnimationTexture, getBaseTexture);
    view.position.set(entity.x * TILE_SIZE, entity.y * TILE_SIZE);
    this.addChild(view);
    this.entityViews.push(view);
    this.viewsById.set(entity.id, view);
  }

  /**
   * Chạy animation của mọi thực thể (hiện chỉ băng chuyền). Gọi mỗi khung hình.
   * @param deltaSeconds Thời gian từ khung hình trước (giây).
   */
  updateAnimations(deltaSeconds: number): void {
    for (const view of this.entityViews) {
      view.updateAnimation(deltaSeconds);
    }
  }

  /**
   * Đặt lại vị trí hình theo dữ liệu thực thể (dùng cho đơn vị đang di chuyển). Gọi mỗi khung hình.
   * Thực thể chưa được vẽ (id không có trong lớp) thì bỏ qua.
   * @param entities Danh sách thực thể có toạ độ ô mới nhất (có thể là số lẻ khi đang di chuyển).
   */
  updatePositions(entities: Entity[]): void {
    for (const entity of entities) {
      const view = this.viewsById.get(entity.id);
      if (view !== undefined) {
        view.position.set(entity.x * TILE_SIZE, entity.y * TILE_SIZE);
      }
    }
  }
}

/**
 * Vẽ toàn bộ thực thể lên một lớp riêng, đặt đúng toạ độ thế giới (ô × TILE_SIZE).
 * Có ảnh thì vẽ sprite, không có thì vẽ hình dự phòng Graphics.
 * @param entities Danh sách thực thể.
 * @param getTexture Tra ảnh chính theo loại thực thể (tuỳ chọn).
 * @param getAnimationTexture Tra khung hình 1 của animation băng chuyền (tuỳ chọn).
 * @param getBaseTexture Tra ảnh bệ của thực thể nhiều lớp như trụ súng (tuỳ chọn).
 * @returns EntityLayer chứa tất cả thực thể, mỗi thực thể là một con.
 */
export function drawEntities(
  entities: Entity[],
  getTexture?: TextureLookup,
  getAnimationTexture?: TextureLookup,
  getBaseTexture?: TextureLookup,
): EntityLayer {
  const container = new EntityLayer();
  for (const entity of entities) {
    container.addEntity(entity, getTexture, getAnimationTexture, getBaseTexture);
  }
  return container;
}
