import { describe, expect, it } from 'vitest';
import { createMap } from '../map/createMap';
import { moveCameraToTarget } from './moveCameraToTarget';

const map = createMap(100, 100);

describe('moveCameraToTarget', () => {
  it('di chuyển ngang: đi đúng 300 px trong 0.5s', () => {
    expect(moveCameraToTarget({ x: 100, y: 500 }, { x: 1000, y: 500 }, 0.5, map)).toEqual({ x: 400, y: 500 });
  });

  it('di chuyển dọc: đi đúng 300 px trong 0.5s', () => {
    expect(moveCameraToTarget({ x: 500, y: 100 }, { x: 500, y: 1000 }, 0.5, map)).toEqual({ x: 500, y: 400 });
  });

  it('di chuyển chéo: đi đúng 300 px theo hướng đích', () => {
    expect(moveCameraToTarget({ x: 100, y: 100 }, { x: 500, y: 500 }, 0.5, map)).toEqual({ x: 100 + 300 / Math.SQRT2, y: 100 + 300 / Math.SQRT2 });
  });

  it('camera đã ở đích → vị trí không đổi', () => {
    expect(moveCameraToTarget({ x: 400, y: 300 }, { x: 400, y: 300 }, 0.5, map)).toEqual({ x: 400, y: 300 });
  });

  it('vượt đích: bước đi dài hơn khoảng cách thì dừng đúng tại đích', () => {
    expect(moveCameraToTarget({ x: 3190, y: 50 }, { x: 3200, y: 50 }, 1, map)).toEqual({ x: 3200, y: 50 });
  });

  it('đích nằm ngoài map → camera chỉ tới tối đa mép map (3200)', () => {
    expect(moveCameraToTarget({ x: 3000, y: 3000 }, { x: 5000, y: 5000 }, 1, map)).toEqual({ x: 3200, y: 3200 });
  });

  it('không sửa object camera truyền vào', () => {
    const camera = { x: 100, y: 100 };
    moveCameraToTarget(camera, { x: 400, y: 100 }, 0.5, map);
    expect(camera).toEqual({ x: 100, y: 100 });
  });
});
