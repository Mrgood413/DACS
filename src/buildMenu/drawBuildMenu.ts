import { Graphics } from 'pixi.js';
import type { Container, Texture } from 'pixi.js';
import {
  BUILD_MENU_BACKGROUND_ALPHA,
  BUILD_MENU_BACKGROUND_COLOR,
  BUILD_MENU_SELECTED_COLOR,
  BUILD_MENU_SLOT_COLOR,
} from '../config';
import { createEntity } from '../entity/createEntity';
import { drawEntity } from '../entity/drawEntity';
import type { BuildMenuLayout, EntityType } from '../types';

/** Khoảng đệm giữa biểu tượng và viền ô (pixel). */
const ICON_PADDING = 4;

/**
 * Xoá nội dung cũ rồi vẽ lại menu xây dựng: khung nền, các ô, biểu tượng công trình (không có chữ),
 * viền vàng quanh ô đang chọn. Chỉ gọi khi có thay đổi (hiện/ẩn, đổi lựa chọn, đổi kích thước màn hình).
 * Biểu tượng dùng chính hình vẽ của thực thể (drawEntity) nên giống hệt công trình trên map.
 * @param container Container dùng riêng cho menu (toạ độ màn hình).
 * @param layout Bố cục từ getBuildMenuLayout; slots[i] ứng với types[i].
 * @param types Các loại công trình cần hiện, từ getBuildableTypes.
 * @param selectedType Loại đang chọn để xây, hoặc null.
 * @param getTexture Tra ảnh chính theo loại thực thể (tuỳ chọn).
 * @param getBaseTexture Tra ảnh bệ theo loại thực thể (tuỳ chọn).
 */
export function drawBuildMenu(
  container: Container,
  layout: BuildMenuLayout,
  types: EntityType[],
  selectedType: EntityType | null,
  getTexture?: (type: EntityType) => Texture | undefined,
  getBaseTexture?: (type: EntityType) => Texture | undefined,
): void {
  for (const child of container.removeChildren()) {
    child.destroy({ children: true });
  }

  const background = new Graphics();
  const { panel } = layout;
  background
    .rect(panel.x, panel.y, panel.width, panel.height)
    .fill({ color: BUILD_MENU_BACKGROUND_COLOR, alpha: BUILD_MENU_BACKGROUND_ALPHA })
    .stroke({ width: 1, color: BUILD_MENU_SLOT_COLOR });
  container.addChild(background);

  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const slot = layout.slots[i];
    if (type === undefined || slot === undefined) {
      continue;
    }

    background.rect(slot.x, slot.y, slot.width, slot.height).fill(BUILD_MENU_SLOT_COLOR);
    if (type === selectedType) {
      background.rect(slot.x, slot.y, slot.width, slot.height).stroke({ width: 2, color: BUILD_MENU_SELECTED_COLOR });
    }

    // Biểu tượng: co hình thực thể cho vừa ô rồi căn giữa. Tính theo khung bao thật của hình
    // (không theo số ô), vì đầu trụ súng to hơn ô một chút — tính theo ô sẽ bị tràn khỏi ô.
    const icon = drawEntity(createEntity(type, 0, 0), getTexture, undefined, getBaseTexture);
    const bounds = icon.getLocalBounds();
    const scale = (slot.width - ICON_PADDING * 2) / Math.max(bounds.width, bounds.height, 1);
    icon.scale.set(scale);
    icon.position.set(
      slot.x + (slot.width - bounds.width * scale) / 2 - bounds.x * scale,
      slot.y + (slot.height - bounds.height * scale) / 2 - bounds.y * scale,
    );
    container.addChild(icon);
  }
}
