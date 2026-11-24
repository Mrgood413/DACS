import { ENEMY_SPAWN_NODES } from '../config';
import type { EnvironmentMap, Point } from '../types';

/**
 * Kiểm tra xem một điểm (toạ độ ô) có nằm ngoài ranh giới bản đồ hay không.
 * Điểm ngoài ranh giới là điểm mà x < 0 hoặc x >= width hoặc y < 0 hoặc y >= height.
 * @param point Điểm cần kiểm tra.
 * @param width Chiều ngang bản đồ (số ô).
 * @param height Chiều cao bản đồ (số ô).
 * @returns true nếu điểm nằm hoàn toàn bên ngoài ranh giới bản đồ.
 */
export function isOutsideMapBounds(point: Point, width: number, height: number): boolean {
  return point.x < 0 || point.x >= width || point.y < 0 || point.y >= height;
}

/**
 * Kiểm tra xem tất cả Enemy Spawn Node có nằm ngoài ranh giới bản đồ hay không.
 * Yêu cầu nghiệp vụ: spawnNode.position luôn nằm ngoài map.boundary.
 * @param width Chiều ngang bản đồ.
 * @param height Chiều cao bản đồ.
 * @returns true nếu mọi spawn node đều nằm ngoài ranh giới.
 */
export function validateSpawnNodes(width: number, height: number): boolean {
  return ENEMY_SPAWN_NODES.every((node) => isOutsideMapBounds(node, width, height));
}

/**
 * Lấy vị trí spawn ngẫu nhiên từ danh sách Enemy Spawn Node.
 * Mỗi spawn node là điểm xuất hiện nằm ngoài ranh giới bản đồ.
 * @returns Một Point là vị trí spawn (toạ độ ô, ngoài ranh giới).
 */
export function getRandomSpawnNode(): Point {
  const nodes = ENEMY_SPAWN_NODES;
  return nodes[Math.floor(Math.random() * nodes.length)];
}

/**
 * Lấy hướng di chuyển từ spawn node vào trong bản đồ (hướng từ ngoài về trong).
 * Dùng để thiết lập hướng ban đầu của enemy khi vừa spawn.
 * @param node Vị trí spawn node.
 * @param width Chiều ngang bản đồ.
 * @param height Chiều cao bản đồ.
 * @returns Hướng {dx, dy} chỉ vào trong bản đồ.
 */
export function getSpawnInwardDirection(node: Point, width: number, height: number): Point {
  let dx = 0;
  let dy = 0;
  if (node.x < 0) dx = 1;       // spawn từ trái → di chuyển sang phải
  else if (node.x >= width) dx = -1; // spawn từ phải → di chuyển sang trái
  if (node.y < 0) dy = 1;       // spawn từ trên → di chuyển xuống
  else if (node.y >= height) dy = -1; // spawn từ dưới → di chuyển lên
  return { x: dx, y: dy };
}

/**
 * Tính vị trí thực tế của enemy ngay sau khi spawn: điểm ngoài ranh giới
 * gần ranh giới nhất theo hướng spawn node, để enemy bắt đầu từ ngoài và di chuyển vào trong.
 * @param node Vị trí spawn node.
 * @param width Chiều ngang bản đồ.
 * @param height Chiều cao bản đồ.
 * @returns Vị trí ô của enemy ngay sau khi spawn (vẫn nằm ngoài ranh giới, nhưng sát ranh giới nhất có thể).
 */
export function getSpawnPosition(node: Point, width: number, height: number): Point {
  const x = Math.min(Math.max(node.x, -1), width);
  const y = Math.min(Math.max(node.y, -1), height);
  return { x, y };
}
