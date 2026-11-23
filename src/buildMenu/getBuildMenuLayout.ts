import {
  BUILD_MENU_COLUMNS,
  BUILD_MENU_GAP,
  BUILD_MENU_MARGIN,
  BUILD_MENU_PADDING,
  BUILD_MENU_SLOT_SIZE,
} from '../config';
import type { BuildMenuLayout, Rect } from '../types';

/**
 * Tính vị trí khung menu xây dựng và từng ô biểu tượng, neo ở góc dưới-phải màn hình.
 * Các ô xếp từ trái qua phải, đủ BUILD_MENU_COLUMNS ô thì xuống hàng.
 * @param itemCount Số ô cần hiện (số loại công trình).
 * @param screenWidth Chiều rộng màn hình (pixel).
 * @param screenHeight Chiều cao màn hình (pixel).
 * @returns Khung menu và danh sách ô, toạ độ màn hình. itemCount = 0 → khung chỉ còn phần đệm, không có ô.
 */
export function getBuildMenuLayout(itemCount: number, screenWidth: number, screenHeight: number): BuildMenuLayout {
  const columns = Math.min(itemCount, BUILD_MENU_COLUMNS);
  const rows = Math.ceil(itemCount / BUILD_MENU_COLUMNS);
  const step = BUILD_MENU_SLOT_SIZE + BUILD_MENU_GAP;

  const width = BUILD_MENU_PADDING * 2 + columns * BUILD_MENU_SLOT_SIZE + Math.max(0, columns - 1) * BUILD_MENU_GAP;
  const height = BUILD_MENU_PADDING * 2 + rows * BUILD_MENU_SLOT_SIZE + Math.max(0, rows - 1) * BUILD_MENU_GAP;
  const panel: Rect = {
    x: screenWidth - BUILD_MENU_MARGIN - width,
    y: screenHeight - BUILD_MENU_MARGIN - height,
    width,
    height,
  };

  const slots: Rect[] = [];
  for (let i = 0; i < itemCount; i++) {
    const column = i % BUILD_MENU_COLUMNS;
    const row = Math.floor(i / BUILD_MENU_COLUMNS);
    slots.push({
      x: panel.x + BUILD_MENU_PADDING + column * step,
      y: panel.y + BUILD_MENU_PADDING + row * step,
      width: BUILD_MENU_SLOT_SIZE,
      height: BUILD_MENU_SLOT_SIZE,
    });
  }

  return { panel, slots };
}
