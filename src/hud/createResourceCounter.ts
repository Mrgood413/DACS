import { Container, Graphics, Text } from 'pixi.js';
import { ITEM_COPPER, ITEM_IRON, ITEM_COLORS } from '../config';
import type { CoreResources } from '../types';

/** Trạng thái HUD kho tài nguyên: container cần add vào stage và hàm cập nhật nội dung/vị trí. */
export type ResourceCounter = {
  container: Container;
  /**
   * Cập nhật số liệu và neo HUD ở trên cùng màn hình, giữa theo chiều ngang (gọi mỗi khung hình).
   * Mỗi loại tài nguyên được hiện bằng icon ô màu kèm số lượng (giống GUI Mindustry).
   * Nội dung chỉ vẽ lại khi số liệu đổi; vị trí được cập nhật mỗi lần để theo kích thước cửa sổ.
   * @param resources Kho tài nguyên nhà chính.
   * @param screenWidth Chiều rộng màn hình (pixel).
   * @param screenHeight Chiều cao màn hình (pixel).
   */
  update: (resources: CoreResources, screenWidth: number, screenHeight: number) => void;
};

/** Khoảng cách từ mép trên màn hình tới HUD tài nguyên (pixel). */
const RESOURCE_COUNTER_TOP_OFFSET = 12;
/** Khoảng cách giữa các cặp icon/số tài nguyên (pixel). */
const RESOURCE_ICON_GAP = 10;
/** Khoảng cách từ cạnh icon tới nhãn số (pixel). */
const RESOURCE_LABEL_OFFSET = 4;
/** Kích thước ô icon tài nguyên (pixel). */
const RESOURCE_ICON_SIZE = 14;

/**
 * Tạo HUD hiện số tài nguyên trong kho nhà chính, neo ở trên cùng màn hình (giữa theo chiều ngang).
 * @returns Container cần add vào app.stage và hàm cập nhật kho tài nguyên.
 */
export function createResourceCounter(): ResourceCounter {
  const container = new Container();

  const copperIcon = new Graphics();
  const copperLabel = new Text({
    text: '0',
    style: { fontFamily: 'monospace', fontSize: 16, fill: 0xffffff },
  });
  const ironIcon = new Graphics();
  const ironLabel = new Text({
    text: '0',
    style: { fontFamily: 'monospace', fontSize: 16, fill: 0xffffff },
  });

  copperIcon.rect(0, 0, RESOURCE_ICON_SIZE, RESOURCE_ICON_SIZE).fill(ITEM_COLORS[ITEM_COPPER]);
  ironIcon.rect(0, 0, RESOURCE_ICON_SIZE, RESOURCE_ICON_SIZE).fill(ITEM_COLORS[ITEM_IRON]);

  container.addChild(copperIcon);
  container.addChild(copperLabel);
  container.addChild(ironIcon);
  container.addChild(ironLabel);

  let lastCopper = -1;
  let lastIron = -1;
  return {
    container,
    update(resources: CoreResources, screenWidth: number, _screenHeight: number): void {
      const copper = resources.get(ITEM_COPPER) ?? 0;
      const iron = resources.get(ITEM_IRON) ?? 0;

      // Vị trí: căn giữa trên cùng màn hình, xếp hai cặp icon/số theo chiều ngang.
      const totalWidth =
        2 * RESOURCE_ICON_SIZE +
        2 * RESOURCE_LABEL_OFFSET +
        RESOURCE_ICON_GAP;
      const startX = screenWidth / 2 - totalWidth / 2;
      const y = RESOURCE_COUNTER_TOP_OFFSET;

      copperIcon.position.set(startX, y);
      copperLabel.position.set(startX + RESOURCE_ICON_SIZE + RESOURCE_LABEL_OFFSET, y);
      copperLabel.anchor.set(0, 0);

      ironIcon.position.set(startX + RESOURCE_ICON_SIZE + RESOURCE_LABEL_OFFSET * 2 + RESOURCE_ICON_GAP, y);
      ironLabel.position.set(
        startX + 2 * RESOURCE_ICON_SIZE + RESOURCE_LABEL_OFFSET * 2 + RESOURCE_ICON_GAP,
        y,
      );
      ironLabel.anchor.set(0, 0);

      if (copper !== lastCopper) {
        copperLabel.text = String(copper);
        lastCopper = copper;
      }
      if (iron !== lastIron) {
        ironLabel.text = String(iron);
        lastIron = iron;
      }
    },
  };
}
