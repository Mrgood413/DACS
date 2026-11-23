import type { Entity, EntityType } from '../types';
import { createEntity } from './createEntity';

/**
 * Tạo công trình vừa bắt đầu xây: 0 máu, đang xây. Drone xây tiếp thì máu tăng dần tới maxHp.
 * @param id Id cho công trình mới (từ getNextEntityId).
 * @param type Mã loại công trình (BUILDING_*).
 * @param x Ô góc trên-trái theo chiều ngang.
 * @param y Ô góc trên-trái theo chiều dọc.
 * @param rotation Hướng xoay 0–3 (mặc định 0).
 * @returns Entity với hp = 0, constructing = true.
 * @throws Error nếu toạ độ hoặc loại không hợp lệ (giống createEntity).
 */
export function createConstructionSite(id: number, type: EntityType, x: number, y: number, rotation = 0): Entity {
  const entity = createEntity(type, x, y, rotation);
  entity.id = id;
  entity.hp = 0;
  entity.constructing = true;
  return entity;
}
