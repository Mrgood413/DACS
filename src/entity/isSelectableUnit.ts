import { UNIT_DRONE } from '../config';
import type { EntityType } from '../types';

/**
 * Cho biết người chơi có được chọn và ra lệnh cho loại thực thể này không.
 * Hiện chỉ drone của người chơi; công trình và quái (bug) không chọn được.
 * @param type Mã loại thực thể (BUILDING_* / UNIT_*).
 * @returns true nếu là đơn vị của người chơi.
 */
export function isSelectableUnit(type: EntityType): boolean {
  return type === UNIT_DRONE;
}
