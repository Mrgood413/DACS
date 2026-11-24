import { BUILDING_CORE, ENV_WALL_NONE, TERRAIN_WATER } from '../config';
import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { Entity, EnvironmentMap, Point } from '../types';

/**
 * Kiểm tra xem một ô (x, y) có thể đi qua được cho enemy hay không.
 * - Phải nằm trong ranh giới bản đồ.
 * - Không phải nước.
 * - Không có tường môi trường.
 * - Không có công trình (trừ Core - đích cuối cùng của enemy).
 * - Không có enemy khác.
 * @param map Map môi trường.
 * @param entities Danh sách thực thể hiện có.
 * @param x Toạ độ ô theo chiều ngang.
 * @param y Toạ độ ô theo chiều dọc.
 * @param coreX Toạ độ x của Core (đích cuối cùng, được phép bước vào).
 * @param coreY Toạ độ y của Core (đích cuối cùng, được phép bước vào).
 * @param enemyId ID của enemy hiện tại (để không chặn chính nó).
 * @returns true nếu ô có thể đi qua.
 */
function isWalkableForEnemy(
  map: EnvironmentMap,
  entities: Entity[],
  x: number,
  y: number,
  coreX: number,
  coreY: number,
  enemyId: number,
): boolean {
  // Phải nằm trong ranh giới bản đồ.
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return false;
  }

  const index = y * map.width + x;

  // Không phải nước.
  if (map.terrain[index] === TERRAIN_WATER) {
    return false;
  }

  // Không có tường môi trường.
  if (map.wall[index] !== ENV_WALL_NONE) {
    return false;
  }

  // Không có công trình (trừ Core - đích cuối cùng).
  for (const entity of entities) {
    if (entity.id === enemyId) {
      continue; // không chặn chính enemy này
    }
    const isCore = entity.type === BUILDING_CORE;
    const covers = x >= entity.x && x < entity.x + entity.width && y >= entity.y && y < entity.y + entity.height;
    if (isCore) {
      // Core là đích, enemy được phép bước vào ô Core.
      if (covers) {
        return true;
      }
    } else if (covers) {
      // Các công trình khác chặn di chuyển.
      return false;
    }
  }

  return true;
}

/**
 * Tìm đường đi ngắn nhất từ start đến goal cho enemy bằng thuật toán BFS.
 * Đường đi tránh qua nước, tường môi trường, công trình (trừ Core).
 * @param start Vị trí bắt đầu (ô của enemy).
 * @param goal Vị trí đích (ô của Core).
 * @param map Map môi trường.
 * @param entities Danh sách thực thể hiện có.
 * @param enemyId ID của enemy hiện tại.
 * @returns Mảng các ô từ start đến goal (không bao gồm start), hoặc null nếu không tìm được đường.
 */
export function findPath(
  start: Point,
  goal: Point,
  map: EnvironmentMap,
  entities: Entity[],
  enemyId: number,
): Point[] | null {
  const { width, height } = map;

  // Start và goal phải nằm trong ranh giới.
  if (
    start.x < 0 || start.x >= width || start.y < 0 || start.y >= height ||
    goal.x < 0 || goal.x >= width || goal.y < 0 || goal.y >= height
  ) {
    return null;
  }

  // Nếu đã ở đích.
  if (start.x === goal.x && start.y === goal.y) {
    return [];
  }

  // BFS.
  const visited = new Set<string>();
  const queue: { pos: Point; path: Point[] }[] = [{ pos: start, path: [] }];
  visited.add(`${start.x},${start.y}`);

  const directions: Point[] = [
    { x: 0, y: -1 }, // lên
    { x: 1, y: 0 },  // phải
    { x: 0, y: 1 },  // xuống
    { x: -1, y: 0 }, // trái
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    for (const dir of directions) {
      const nx = pos.x + dir.x;
      const ny = pos.y + dir.y;
      const key = `${nx},${ny}`;

      if (visited.has(key)) {
        continue;
      }

      // Kiểm tra có thể đi qua ô này không.
      // Cho phép bước vào goal (Core) ngay cả khi Core nằm trên ô đó.
      if (!(nx === goal.x && ny === goal.y)) {
        if (!isWalkableForEnemy(map, entities, nx, ny, goal.x, goal.y, enemyId)) {
          continue;
        }
      }

      visited.add(key);
      const newPath = [...path, { x: nx, y: ny }];

      if (nx === goal.x && ny === goal.y) {
        return newPath;
      }

      queue.push({ pos: { x: nx, y: ny }, path: newPath });
    }
  }

  // Không tìm được đường.
  return null;
}
