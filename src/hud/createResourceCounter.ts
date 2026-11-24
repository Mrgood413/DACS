import { Container, Text } from 'pixi.js';
import { ITEM_COPPER, ITEM_IRON } from '../config';
import type { CoreResources } from '../types';

/** Trạng thái HUD kho tài nguyên: container cần add vào stage và hàm cập nhật nội dung/vị trí. */
export type ResourceCounter = {
  container: Container;
  /**
   * Cập nhật số liệu và neo HUD ở trên cùng màn hình, giữa theo chiều ngang (gọi mỗi khung hình).
   * Nội dung text chỉ đổi khi số liệu đổi; vị trí được cập nhật mỗi lần để theo kích thước cửa sổ.
   * @param resources Kho tài nguyên nhà chính.
   * @param screenWidth Chiều rộng màn hình (pixel).
   * @param screenHeight Chiều cao màn hình (pixel).
   */
  update: (resources: CoreResources, screenWidth: number, screenHeight: number) => void;
};

/** Khoảng cách từ mép trên màn hình tới HUD tài nguyên (pixel). */
const RESOURCE_COUNTER_TOP_OFFSET = 12;

/**
 * Tạo HUD hiện số tài nguyên trong kho nhà chính, neo ở trên cùng màn hình (giữa theo chiều ngang).
 * @returns Container cần add vào app.stage và hàm cập nhật kho tài nguyên.
 */
export function createResourceCounter(): ResourceCounter {
  const container = new Container();
  const text = new Text({
    text: '',
    style: { fontFamily: 'monospace', fontSize: 18, fill: 0xffffff, align: 'center' },
  });
  text.anchor.set(0.5, 0);
  container.addChild(text);

  let lastText = '';
  return {
    container,
    update(resources: CoreResources, screenWidth: number, _screenHeight: number): void {
      text.position.set(screenWidth / 2, RESOURCE_COUNTER_TOP_OFFSET);
      const value = `Đồng: ${resources.get(ITEM_COPPER) ?? 0}   Sắt: ${resources.get(ITEM_IRON) ?? 0}`;
      if (value === lastText) {
        return;
      }
      text.text = value;
      lastText = value;
    },
  };
}
