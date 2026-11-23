import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { EntityType, Point } from '../types';

/**
 * Tính ô góc trên-trái để đặt công trình khi con trỏ đang ở một ô (giống Mindustry: con trỏ nằm ở giữa công trình).
 * 1×1 và 2×2: góc trên-trái chính là ô con trỏ; 3×3: lùi 1 ô để con trỏ nằm ô giữa.
 * @param tile Ô đang trỏ chuột.
 * @param type Mã loại công trình.
 * @returns Ô góc trên-trái của công trình (có thể âm nếu sát mép map).
 */
export function getPlacementOrigin(tile: Point, type: EntityType): Point {
  const definition = getEntityDefinition(type);
  return {
    x: tile.x - Math.floor((definition.width - 1) / 2),
    y: tile.y - Math.floor((definition.height - 1) / 2),
  };
}
