import { describe, expect, it } from 'vitest';
import { getTileAt } from './getTileAt';

describe('getTileAt', () => {
  it('điểm (70, 33) → ô (2, 1) với ô 32 px', () => {
    expect(getTileAt(70, 33)).toEqual({ x: 2, y: 1 });
  });

  it('điểm ngay mép ô (64, 0) → thuộc ô (2, 0)', () => {
    expect(getTileAt(64, 0)).toEqual({ x: 2, y: 0 });
  });

  it('điểm âm (ngoài map) → ô âm', () => {
    expect(getTileAt(-1, -40)).toEqual({ x: -1, y: -2 });
  });
});
