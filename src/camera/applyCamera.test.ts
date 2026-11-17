import { describe, expect, it } from 'vitest';
import { applyCamera } from './applyCamera';

describe('applyCamera', () => {
  it('camera ở giữa màn hình 800×600 → world (0, 0)', () => {
    const world = { x: 0, y: 0 };
    applyCamera(world, { x: 400, y: 300 }, 800, 600);
    expect(world).toEqual({ x: 0, y: 0 });
  });

  it('camera (1000, 500) trên màn hình 800×600 → world (-600, -200)', () => {
    const world = { x: 0, y: 0 };
    applyCamera(world, { x: 1000, y: 500 }, 800, 600);
    expect(world).toEqual({ x: -600, y: -200 });
  });

  it('màn hình 801×600, camera (0, 0) → world (401, 300) do làm tròn 400.5', () => {
    const world = { x: 0, y: 0 };
    applyCamera(world, { x: 0, y: 0 }, 801, 600);
    expect(world).toEqual({ x: 401, y: 300 });
  });
});
