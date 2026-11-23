import { describe, expect, it } from 'vitest';
import { Container, Rectangle, Texture } from 'pixi.js';
import { BUILDING_DRILL, BUILDING_IRON_WALL, BUILDING_TURRET } from '../config';
import { getBuildableTypes } from '../entity/getBuildableTypes';
import { drawBuildMenu } from './drawBuildMenu';
import { getBuildMenuLayout } from './getBuildMenuLayout';

describe('drawBuildMenu', () => {
  it('1 lớp nền + 1 biểu tượng cho mỗi loại công trình, không có chữ', () => {
    const types = getBuildableTypes();
    const container = new Container();
    drawBuildMenu(container, getBuildMenuLayout(types.length, 800, 600), types, null);
    expect(container.children).toHaveLength(1 + types.length);
  });

  it('vẽ lại nhiều lần → xoá nội dung cũ, số con không tăng dần', () => {
    const types = getBuildableTypes();
    const layout = getBuildMenuLayout(types.length, 800, 600);
    const container = new Container();
    drawBuildMenu(container, layout, types, null);
    drawBuildMenu(container, layout, types, BUILDING_IRON_WALL);
    expect(container.children).toHaveLength(1 + types.length);
  });

  /** Vẽ menu chỉ có một loại công trình, trả về khung bao biểu tượng và ô của nó. */
  function drawSingleIcon(type: number, getTexture?: () => Texture, getBaseTexture?: () => Texture) {
    const layout = getBuildMenuLayout(1, 800, 600);
    const container = new Container();
    drawBuildMenu(container, layout, [type], null, getTexture, getBaseTexture);
    const icon = container.children[1];
    const slot = layout.slots[0];
    if (icon === undefined || slot === undefined) {
      throw new Error('thiếu biểu tượng hoặc ô');
    }
    return { bounds: icon.getBounds(), slot };
  }

  it('biểu tượng công trình 2×2 (drill) được thu nhỏ vừa trong ô', () => {
    const { bounds, slot } = drawSingleIcon(BUILDING_DRILL);
    expect(bounds.x).toBeGreaterThanOrEqual(slot.x);
    expect(bounds.y).toBeGreaterThanOrEqual(slot.y);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(slot.x + slot.width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(slot.y + slot.height);
  });

  it('trụ súng có đầu súng to hơn bệ (10 px > 8 px) → biểu tượng vẫn nằm gọn trong ô', () => {
    const head = new Texture({ frame: new Rectangle(0, 0, 10, 10) });
    const base = new Texture({ frame: new Rectangle(0, 0, 8, 8) });
    const { bounds, slot } = drawSingleIcon(BUILDING_TURRET, () => head, () => base);
    expect(bounds.x).toBeGreaterThanOrEqual(slot.x - 0.001);
    expect(bounds.y).toBeGreaterThanOrEqual(slot.y - 0.001);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(slot.x + slot.width + 0.001);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(slot.y + slot.height + 0.001);
  });

  it('danh sách rỗng → chỉ còn lớp nền', () => {
    const container = new Container();
    drawBuildMenu(container, getBuildMenuLayout(0, 800, 600), [], null);
    expect(container.children).toHaveLength(1);
  });
});
