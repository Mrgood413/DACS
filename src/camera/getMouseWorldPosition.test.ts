import { describe, expect, it } from 'vitest';
import { getMouseWorldPosition } from './getMouseWorldPosition';

describe('getMouseWorldPosition', () => {
  it('world không dịch chuyển (0, 0) → trả nguyên toạ độ chuột', () => {
    expect(getMouseWorldPosition(120, 80, { x: 0, y: 0 })).toEqual({ x: 120, y: 80 });
  });

  it('world dịch sang trái (-600, 0) → x tăng lên', () => {
    expect(getMouseWorldPosition(120, 80, { x: -600, y: 0 })).toEqual({ x: 720, y: 80 });
  });

  it('world dịch lên trên (0, -200) → y tăng lên', () => {
    expect(getMouseWorldPosition(120, 80, { x: 0, y: -200 })).toEqual({ x: 120, y: 280 });
  });

  it('world dời cả hai chiều và chuột ở nhiều vị trí', () => {
    expect(getMouseWorldPosition(400, 300, { x: 400, y: 300 })).toEqual({ x: 0, y: 0 });
    expect(getMouseWorldPosition(0, 0, { x: 3200, y: 3200 })).toEqual({ x: -3200, y: -3200 });
  });
});
