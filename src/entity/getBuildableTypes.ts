import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_ROUTER,
  BUILDING_TURRET,
} from '../config';
import type { EntityType } from '../types';

/**
 * Thứ tự hiện trong menu xây dựng, nhóm giống Mindustry: vận chuyển → khai thác → phòng thủ → vũ khí.
 * Không có nhà chính (core): core được cấp sẵn khi bắt đầu màn, không xây được.
 */
const BUILDABLE_TYPES: EntityType[] = [
  BUILDING_BANNER, // băng chuyền
  BUILDING_ROUTER, // bộ phân phối theo 4 hướng
  BUILDING_DRILL,
  BUILDING_COPPER_WALL,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  BUILDING_ELECTRIC_TURRET,
];

/**
 * Danh sách loại công trình drone xây được, theo thứ tự hiện trong menu xây dựng.
 * @returns Mảng mới (sửa mảng trả về không ảnh hưởng danh sách gốc).
 */
export function getBuildableTypes(): EntityType[] {
  return [...BUILDABLE_TYPES];
}
