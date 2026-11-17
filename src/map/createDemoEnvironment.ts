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
 * Bố cục demo phong cảnh: mỗi loại địa hình/tường đúng một ô (1×1), xếp dạng lưới
 * **nối tiếp lưới thực thể** (getDemoEntityPositions) ở đáy map — cùng hệ slot 6×6,
 * cùng hàng ngang: 3 slot bên phải mỗi hàng là thực thể, 3 slot bên trái tiếp theo
 * là phong cảnh (hiện thực thể xong mới tới phong cảnh, đọc từ phải qua trái),
 * các hàng điền từ dưới đi lên.
 */
const SLOT_SIZE = 6;
const EDGE_MARGIN = 4;
/** 3 slot bên phải mỗi hàng đã dành cho thực thể — phong cảnh bắt đầu từ slot thứ 4. */
const SCENERY_START_COL = 3;

/**
 * Bố trí các loại địa hình và tường môi trường lên map để tạo khu vực demo (sửa tại chỗ).
 * Phần lớn map giữ nguyên cỏ. Phong cảnh nối tiếp lưới thực thể ở đáy map: từ dưới đi lên,
 * trong mỗi hàng tiếp tục từ phải qua trái sau các thực thể —
 * hàng dưới: nước → cát → quặng đồng; hàng giữa: quặng sắt → tường đá → tường cỏ;
 * hàng trên: tường bụi cây. Ô ngoài phạm vi map thì bỏ qua (không ghi ra ngoài map).
 * Tường không ghi đè địa hình.
 * @param map Map môi trường cần vẽ dữ liệu demo (bị thay đổi tại chỗ).
 * @returns Chính object map truyền vào (đã có dữ liệu demo).
 */
export function createDemoEnvironment(map: EnvironmentMap): EnvironmentMap {
  // Các ô phong cảnh theo thứ tự điền: từ dưới đi lên, mỗi hàng từ phải qua trái
  // (nối tiếp sau 3 slot thực thể của cùng hàng đó).
  const markers: Array<{ isWall: boolean; id: number }> = [
    { isWall: false, id: TERRAIN_WATER },       // hàng dưới, ngay sau thực thể
    { isWall: false, id: TERRAIN_SAND },        // hàng dưới, giữa nhóm phong cảnh
    { isWall: false, id: TERRAIN_COPPER_ORE },  // hàng dưới, trái nhất nhóm phong cảnh
    { isWall: false, id: TERRAIN_IRON_ORE },    // hàng giữa, ngay sau thực thể
    { isWall: true, id: ENV_WALL_STONE },       // hàng giữa, giữa nhóm phong cảnh
    { isWall: true, id: ENV_WALL_GRASS },       // hàng giữa, trái nhất nhóm phong cảnh
    { isWall: true, id: ENV_WALL_BUSH },        // hàng trên, ngay sau thực thể
  ];

  let index = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = SCENERY_START_COL; col < SCENERY_START_COL + 3; col++) {
      const marker = markers[index++];
      if (marker === undefined) {
        break;
      }
      // Cùng hệ slot với lưới thực thể: slot (0, 0) là góc dưới-phải (chừa mép EDGE_MARGIN ô),
      // mỗi slot cách nhau SLOT_SIZE ô; phong cảnh chiếm các slot cột 3→5 của cùng hàng.
      const rectX = map.width - EDGE_MARGIN - SLOT_SIZE - col * SLOT_SIZE;
      const rectY = map.height - EDGE_MARGIN - SLOT_SIZE - row * SLOT_SIZE;
      const x = rectX + Math.floor(SLOT_SIZE / 2);
      const y = rectY + Math.floor(SLOT_SIZE / 2);
      if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
        continue; // ô demo nằm ngoài map (kể cả toạ độ âm) thì bỏ qua, không ghi ra ngoài phạm vi.
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
