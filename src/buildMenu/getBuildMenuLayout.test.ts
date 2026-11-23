import { describe, expect, it } from 'vitest';
import { getBuildMenuLayout } from './getBuildMenuLayout';

// Hằng số hiện tại: 4 cột, ô 48 px, khe 4 px, đệm 6 px, cách mép 10 px.
describe('getBuildMenuLayout', () => {
  it('6 ô trên màn 800×600 → 2 hàng (4 + 2), khung neo góc dưới-phải', () => {
    const layout = getBuildMenuLayout(6, 800, 600);
    // Rộng = 6·2 + 4·48 + 3·4 = 216; cao = 6·2 + 2·48 + 1·4 = 112.
    expect(layout.panel).toEqual({ x: 574, y: 478, width: 216, height: 112 });
    expect(layout.slots).toHaveLength(6);
    expect(layout.slots[0]).toEqual({ x: 580, y: 484, width: 48, height: 48 });
    expect(layout.slots[3]).toEqual({ x: 736, y: 484, width: 48, height: 48 });
    expect(layout.slots[4]).toEqual({ x: 580, y: 536, width: 48, height: 48 });
    expect(layout.slots[5]).toEqual({ x: 632, y: 536, width: 48, height: 48 });
  });

  it('3 ô → chỉ 1 hàng 3 cột, khung hẹp lại', () => {
    const layout = getBuildMenuLayout(3, 800, 600);
    // Rộng = 12 + 3·48 + 2·4 = 164; cao = 12 + 48 = 60.
    expect(layout.panel).toEqual({ x: 626, y: 530, width: 164, height: 60 });
  });

  it('khung luôn cách mép phải và mép dưới đúng 10 px khi đổi kích thước màn hình', () => {
    const layout = getBuildMenuLayout(6, 1920, 1080);
    expect(layout.panel.x + layout.panel.width).toBe(1910);
    expect(layout.panel.y + layout.panel.height).toBe(1070);
  });

  it('0 ô → không có ô nào, khung chỉ còn phần đệm', () => {
    const layout = getBuildMenuLayout(0, 800, 600);
    expect(layout.slots).toEqual([]);
    expect(layout.panel.width).toBe(12);
    expect(layout.panel.height).toBe(12);
  });
});
