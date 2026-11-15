import { describe, expect, it } from 'vitest';
import { getSelectionRect } from './getSelectionRect';

describe('getSelectionRect', () => {
  it('kéo xuôi xuống-phải', () => {
    expect(getSelectionRect(10, 20, 110, 70)).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });

  it('kéo ngược lên-trái vẫn ra width/height dương', () => {
    expect(getSelectionRect(110, 70, 10, 20)).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });

  it('bắt đầu và kết thúc cùng một điểm → width/height = 0', () => {
    expect(getSelectionRect(50, 50, 50, 50)).toEqual({ x: 50, y: 50, width: 0, height: 0 });
  });
});
