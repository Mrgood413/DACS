import { describe, expect, it } from 'vitest';
import { getBuildMenuLayout } from './getBuildMenuLayout';
import { getBuildMenuSlotAt } from './getBuildMenuSlotAt';

// 6 ô trên màn 800×600: ô 0 ở (580, 484), ô 5 ở (632, 536), mỗi ô 48×48 (xem test getBuildMenuLayout).
const layout = getBuildMenuLayout(6, 800, 600);

describe('getBuildMenuSlotAt', () => {
  it('điểm trong ô đầu tiên → 0', () => {
    expect(getBuildMenuSlotAt(layout, 600, 500)).toBe(0);
  });

  it('điểm trong ô cuối (hàng 2, cột 2) → 5', () => {
    expect(getBuildMenuSlotAt(layout, 650, 560)).toBe(5);
  });

  it('điểm ở khe giữa 2 ô (vẫn trong khung) → null', () => {
    expect(getBuildMenuSlotAt(layout, 629, 500)).toBeNull();
  });

  it('điểm ngoài menu → null', () => {
    expect(getBuildMenuSlotAt(layout, 100, 100)).toBeNull();
  });
});
