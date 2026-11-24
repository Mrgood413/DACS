import { describe, expect, it } from 'vitest';
import { getConveyorDirection } from './getConveyorDirection';

describe('getConveyorDirection', () => {
  it('rotation 0/1/2/3 → lên/phải/xuống/trái', () => {
    expect(getConveyorDirection(0)).toEqual({ x: 0, y: -1 });
    expect(getConveyorDirection(1)).toEqual({ x: 1, y: 0 });
    expect(getConveyorDirection(2)).toEqual({ x: 0, y: 1 });
    expect(getConveyorDirection(3)).toEqual({ x: -1, y: 0 });
  });

  it('rotation âm hoặc vượt 3 thì chuẩn hoá về 0–3', () => {
    expect(getConveyorDirection(-1)).toEqual({ x: -1, y: 0 });
    expect(getConveyorDirection(4)).toEqual({ x: 0, y: -1 });
  });
});
