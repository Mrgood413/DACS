import { describe, expect, it } from 'vitest';
import { isClickRelease } from './isClickRelease';

describe('isClickRelease', () => {
  it('thả đúng chỗ nhấn → click', () => {
    expect(isClickRelease(100, 100, 100, 100)).toBe(true);
  });

  it('lệch đúng 5 px (bằng ngưỡng) → vẫn là click', () => {
    expect(isClickRelease(100, 100, 103, 104)).toBe(true);
  });

  it('kéo xa hơn 5 px → không phải click', () => {
    expect(isClickRelease(100, 100, 106, 100)).toBe(false);
  });
});
