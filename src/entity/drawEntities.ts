import { Container } from 'pixi.js';
import type { Texture } from 'pixi.js';
import { CONSTRUCTION_MIN_ALPHA, TILE_SIZE } from '../config';
import type { Entity, EntityType } from '../types';
import { drawEntity, EntityView } from './drawEntity';
import { getEntityDefinition } from './getEntityDefinition';

/** Hàm tra texture theo loại thực thể; trả về undefined nếu loại đó không có ảnh. */
type TextureLookup = (type: EntityType) => Texture | undefined;

/**
 * Lớp chứa hình của mọi thực thể. Giữ liên kết id → hình để cập nhật vị trí, độ mờ và animation mỗi khung hình.
 * Công trình luôn nằm dưới đơn vị: công trình thêm sau được chèn ngay trên công trình cuối cùng, dưới mọi đơn vị.
 */
export class EntityLayer extends Container {
  private readonly entityViews: EntityView[] = [];
  private readonly viewsById = new Map<number, EntityView>();
  private buildingCount = 0;

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
    view.alpha = getConstructionAlpha(entity);
    if (getEntityDefinition(entity.type).group === 'Unit') {
      this.addChild(view);
    } else {
      this.addChildAt(view, this.buildingCount);
      this.buildingCount++;
    }
    this.entityViews.push(view);
    this.viewsById.set(entity.id, view);
  }

  /**
   * Xoá hình của một thực thể (ví dụ công trình đang xây bị huỷ). Id không có trong lớp thì bỏ qua.
   * @param id Id thực thể.
   */
  removeEntity(id: number): void {
    const view = this.viewsById.get(id);
    if (view === undefined) {
      return;
    }
    if (this.getChildIndex(view) < this.buildingCount) {
      this.buildingCount--;
    }
    this.viewsById.delete(id);
    this.entityViews.splice(this.entityViews.indexOf(view), 1);
    this.removeChild(view);
    view.destroy({ children: true });
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
   * Cập nhật hình theo dữ liệu thực thể: vị trí (đơn vị đang di chuyển) và độ mờ (công trình đang xây). Gọi mỗi khung hình.
   * Thực thể chưa được vẽ (id không có trong lớp) thì bỏ qua.
   * @param entities Danh sách thực thể mới nhất (toạ độ có thể là số lẻ khi đang di chuyển).
   */
  updateViews(entities: Entity[]): void {
    for (const entity of entities) {
      const view = this.viewsById.get(entity.id);
      if (view !== undefined) {
        view.position.set(entity.x * TILE_SIZE, entity.y * TILE_SIZE);
        view.alpha = getConstructionAlpha(entity);
      }
    }
  }
}

/**
 * Độ mờ của hình thực thể: công trình đang xây mờ dần từ CONSTRUCTION_MIN_ALPHA (0 máu) tới rõ hẳn (đầy máu).
 * @param entity Thực thể.
 * @returns 1 nếu không đang xây; ngược lại một số trong [CONSTRUCTION_MIN_ALPHA, 1].
 */
function getConstructionAlpha(entity: Entity): number {
  if (!entity.constructing || entity.maxHp <= 0) {
    return 1;
  }
  const progress = Math.max(0, Math.min(1, entity.hp / entity.maxHp));
  return CONSTRUCTION_MIN_ALPHA + (1 - CONSTRUCTION_MIN_ALPHA) * progress;
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
