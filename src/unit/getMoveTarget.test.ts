import { describe, expect, it } from 'vitest';
import { UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import { getMoveTarget } from './getMoveTarget';

const map = { width: 100, height: 100 };
const drone = createEntity(UNIT_DRONE, 0, 0);

describe('getMoveTarget', () => {
  it('bấm điểm (320, 640) → tâm drone 1×1 tại đó → góc trên-trái ở ô (9.5, 19.5)', () => {
    expect(getMoveTarget(320, 640, drone, map)).toEqual({ x: 9.5, y: 19.5 });
  });

  it('bấm ngoài mép trái/trên → bị giới hạn ở ô 0', () => {
    expect(getMoveTarget(-50, 10, drone, map)).toEqual({ x: 0, y: 0 });
  });

  it('bấm ngoài mép phải/dưới → bị giới hạn ở ô 99 (map 100 ô, drone rộng 1 ô)', () => {
    expect(getMoveTarget(5000, 5000, drone, map)).toEqual({ x: 99, y: 99 });
  });
});
