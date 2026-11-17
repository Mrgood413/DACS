import {
  ENV_WALL_BUSH,
  ENV_WALL_GRASS,
  ENV_WALL_STONE,
  TERRAIN_COPPER_ORE,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
} from '../config';
import type { EnvironmentMap } from '../types';

/**
 * Bố cục demo môi trường: mỗi loại địa hình/tường đúng một ô (1×1),
 * xếp thành lưới 3 cột × 3 hàng "chỗ" (slot) giống lưới thực thể:
 * điền từ dưới đi lên, trong mỗi hàng từ phải qua trái, mỗi ô đứng giữa chỗ 6×6 của nó.
 */
const SLOT_SIZE = 6;
const EDGE_MARGIN = 4;

/**
 * Bố trí các loại địa hình và tường môi trường lên map để tạo khu vực demo (sửa tại chỗ).
 * Phần lớn map giữ nguyên cỏ. Lưới demo ở góc dưới-trái map (đối xứng với lưới thực thể
 * ở góc dưới-phải): từ dưới đi lên — nước, cát, quặng đồng / quặng sắt, tường đá, tường cỏ /
 * tường bụi cây; trong mỗi hàng đi từ phải qua trái. Ô ngoài phạm vi map thì bỏ qua
 * (không ghi ra ngoài map). Tường không ghi đè địa hình.
 * @param map Map môi trường cần vẽ dữ liệu demo (bị thay đổi tại chỗ).
 * @returns Chính object map truyền vào (đã có dữ liệu demo).
 */
export function createDemoEnvironment(map: EnvironmentMap): EnvironmentMap {
  // Các ô demo theo thứ tự điền: từ dưới đi lên, mỗi hàng từ phải qua trái.
  const markers: Array<{ isWall: boolean; id: number }> = [
    { isWall: false, id: TERRAIN_WATER },       // hàng dưới, phải nhất
    { isWall: false, id: TERRAIN_SAND },        // hàng dưới, giữa
    { isWall: false, id: TERRAIN_COPPER_ORE },  // hàng dưới, trái nhất
    { isWall: false, id: TERRAIN_IRON_ORE },    // hàng giữa, phải nhất
    { isWall: true, id: ENV_WALL_STONE },       // hàng giữa, giữa
    { isWall: true, id: ENV_WALL_GRASS },       // hàng giữa, trái nhất
    { isWall: true, id: ENV_WALL_BUSH },        // hàng trên, phải nhất
  ];

  let index = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const marker = markers[index++];
      if (marker === undefined) {
        break;
      }
      // Cột phải nhất của lưới là cột col = 0; lưới chừa mép map EDGE_MARGIN ô.
      const rectX = EDGE_MARGIN + (2 - col) * SLOT_SIZE;
      const rectY = EDGE_MARGIN + row * SLOT_SIZE;
      const x = rectX + Math.floor(SLOT_SIZE / 2);
      const y = rectY + Math.floor(SLOT_SIZE / 2);
      if (x >= map.width || y >= map.height) {
        continue; // ô demo nằm ngoài map nhỏ thì bỏ qua, không ghi ra ngoài phạm vi.
      }
      if (marker.isWall) {
        map.wall[y * map.width + x] = marker.id;
      } else {
        map.terrain[y * map.width + x] = marker.id;
      }
    }
  }

  return map;
}
