import { describe, expect, it } from 'vitest';
import { MAP_HEIGHT, MAP_WIDTH } from '../config';
import {
  getRandomSpawnNode,
  getSpawnInwardDirection,
  getSpawnPosition,
  isOutsideMapBounds,
  validateSpawnNodes,
} from './enemySpawnNode';

describe('enemySpawnNode', () => {
  it('isOutsideMapBounds: điểm ngoài ranh giới → true', () => {
    expect(isOutsideMapBounds({ x: -1, y: 0 }, MAP_WIDTH, MAP_HEIGHT)).toBe(true);
    expect(isOutsideMapBounds({ x: MAP_WIDTH, y: 0 }, MAP_WIDTH, MAP_HEIGHT)).toBe(true);
    expect(isOutsideMapBounds({ x: 0, y: -1 }, MAP_WIDTH, MAP_HEIGHT)).toBe(true);
    expect(isOutsideMapBounds({ x: 0, y: MAP_HEIGHT }, MAP_WIDTH, MAP_HEIGHT)).toBe(true);
  });

  it('isOutsideMapBounds: điểm trong ranh giới → false', () => {
    expect(isOutsideMapBounds({ x: 0, y: 0 }, MAP_WIDTH, MAP_HEIGHT)).toBe(false);
    expect(isOutsideMapBounds({ x: 50, y: 50 }, MAP_WIDTH, MAP_HEIGHT)).toBe(false);
    expect(isOutsideMapBounds({ x: MAP_WIDTH - 1, y: MAP_HEIGHT - 1 }, MAP_WIDTH, MAP_HEIGHT)).toBe(false);
  });

  it('validateSpawnNodes: tất cả spawn node nằm ngoài ranh giới', () => {
    expect(validateSpawnNodes(MAP_WIDTH, MAP_HEIGHT)).toBe(true);
  });

  it('getRandomSpawnNode: trả về một spawn node nằm ngoài ranh giới', () => {
    for (let i = 0; i < 20; i++) {
      const node = getRandomSpawnNode();
      expect(isOutsideMapBounds(node, MAP_WIDTH, MAP_HEIGHT)).toBe(true);
    }
  });

  it('getSpawnInwardDirection: spawn từ trái → hướng phải', () => {
    expect(getSpawnInwardDirection({ x: -5, y: 50 }, MAP_WIDTH, MAP_HEIGHT)).toEqual({ x: 1, y: 0 });
  });

  it('getSpawnInwardDirection: spawn từ phải → hướng trái', () => {
    expect(getSpawnInwardDirection({ x: 105, y: 50 }, MAP_WIDTH, MAP_HEIGHT)).toEqual({ x: -1, y: 0 });
  });

  it('getSpawnInwardDirection: spawn từ trên → hướng xuống', () => {
    expect(getSpawnInwardDirection({ x: 50, y: -5 }, MAP_WIDTH, MAP_HEIGHT)).toEqual({ x: 0, y: 1 });
  });

  it('getSpawnInwardDirection: spawn từ dưới → hướng lên', () => {
    expect(getSpawnInwardDirection({ x: 50, y: 105 }, MAP_WIDTH, MAP_HEIGHT)).toEqual({ x: 0, y: -1 });
  });

  it('getSpawnPosition: trả về vị trí nằm ngoài ranh giới nhưng sát ranh giới nhất', () => {
    const pos = getSpawnPosition({ x: -5, y: 50 }, MAP_WIDTH, MAP_HEIGHT);
    expect(isOutsideMapBounds(pos, MAP_WIDTH, MAP_HEIGHT)).toBe(true);
    expect(pos.x).toBe(-1);
    expect(pos.y).toBe(50);
  });
});
