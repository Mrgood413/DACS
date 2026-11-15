import { describe, expect, it } from 'vitest';
import { createMap } from '../map/createMap';
import { getMinimapCameraRect } from './getMinimapCameraRect';

const map = createMap(100, 100);

describe('getMinimapCameraRect', () => {
  it('camera (1600, 1600) — giữa map', () => {
    expect(getMinimapCameraRect({ x: 1600, y: 1600 }, 800, 600, map)).toEqual({
      x: 75,
      y: 81.25,
      width: 50,
      height: 37.5,
    });
  });

  it('camera (0, 0) — góc trên-trái', () => {
    expect(getMinimapCameraRect({ x: 0, y: 0 }, 800, 600, map)).toEqual({
      x: 0,
      y: 0,
      width: 25,
      height: 18.75,
    });
  });

  it('camera (3200, 3200) — góc dưới-phải', () => {
    expect(getMinimapCameraRect({ x: 3200, y: 3200 }, 800, 600, map)).toEqual({
      x: 175,
      y: 181.25,
      width: 25,
      height: 18.75,
    });
  });
});
