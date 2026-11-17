import type { Entity, EntityType } from '../types';
import { getEntityDefinition } from './getEntityDefinition';

/**
 * Tạo dữ liệu một thực thể từ loại, vị trí và hướng xoay.
 * @param type Mã loại thực thể (BUILDING_* / UNIT_*).
 * @param x Ô góc trên-trái theo chiều ngang.
 * @param y Ô góc trên-trái theo chiều dọc.
 * @param rotation Hướng xoay 0–3 (chỉ áp dụng cho thực thể xoay được, mặc định 0).
 * @returns Entity mới với width/height lấy từ định nghĩa chung.
 * @throws Error nếu tọa độ không phải số nguyên ≥ 0 hoặc loại không tồn tại.
 */
export function createEntity(type: EntityType, x: number, y: number, rotation = 0): Entity {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
    throw new Error('Toạ độ thực thể không hợp lệ');
  }
  const definition = getEntityDefinition(type);
  // Băng rôn xoay theo 4 hướng; chuẩn hoá rotation về 0–3 để tránh số âm / vượt 3.
  // Thực thể không xoay được thì luôn là 0.
  const normalizedRotation = definition.rotatable ? ((Math.round(rotation) % 4) + 4) % 4 : 0;
  return {
    id: 0,
    type,
    x,
    y,
    width: definition.width,
    height: definition.height,
    rotation: normalizedRotation,
  };
}
