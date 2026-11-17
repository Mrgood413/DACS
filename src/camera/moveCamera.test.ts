import { describe, expect, it } from 'vitest';
import { createMap } from '../map/createMap';
import { moveCamera } from './moveCamera';

const map = createMap(100, 100);

describe('moveCamera', () => {
  it('hướng {x:1, y:0} trong 0.5s → x tăng 300', () => {
    expect(moveCamera({ x: 100, y: 100 }, { x: 1, y: 0 }, 0.5, map)).toEqual({ x: 400, y: 100 });
  });

  it('hướng {x:0, y:-1} trong 0.5s → y bị giới hạn ở 0', () => {
    expect(moveCamera({ x: 100, y: 100 }, { x: 0, y: -1 }, 0.5, map)).toEqual({ x: 100, y: 0 });
  });

  it('hướng {x:1, y:0} trong 1s khi gần mép phải → x bị giới hạn ở 3200', () => {
    expect(moveCamera({ x: 3190, y: 50 }, { x: 1, y: 0 }, 1, map)).toEqual({ x: 3200, y: 50 });
  });

  it('hướng {x:0, y:0} → vị trí không đổi', () => {
    expect(moveCamera({ x: 123, y: 456 }, { x: 0, y: 0 }, 0.5, map)).toEqual({ x: 123, y: 456 });
  });

  it('không sửa object camera truyền vào', () => {
    const camera = { x: 100, y: 100 };
    moveCamera(camera, { x: 1, y: 0 }, 0.5, map);
    expect(camera).toEqual({ x: 100, y: 100 });
  });
});
