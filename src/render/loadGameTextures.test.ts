import { describe, expect, it } from 'vitest';
import {
  BUILDING_CORE,
  BUILDING_COPPER_WALL,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_BANNER,
  BUILDING_TURRET,
  ENV_WALL_GRASS,
  ENV_WALL_STONE,
  UNIT_BUG,
  UNIT_DRONE,
} from '../config';
import { ENTITY_TEXTURE_URLS, ENV_WALL_TEXTURE_URLS } from './loadGameTextures';

describe('ENTITY_TEXTURE_URLS', () => {
  it('đủ sprite cho cả 9 loại thực thể (kể cả băng chuyền BUILDING_BANNER)', () => {
    const ids = [
      BUILDING_CORE,
      BUILDING_TURRET,
      BUILDING_ELECTRIC_TURRET,
      BUILDING_DRILL,
      BUILDING_IRON_WALL,
      BUILDING_COPPER_WALL,
      BUILDING_BANNER,
      UNIT_DRONE,
      UNIT_BUG,
    ];
    for (const id of ids) {
      expect(ENTITY_TEXTURE_URLS[id]).toMatch(/^\.\/assets\/entities\/.+\.png$/);
    }
    expect(Object.keys(ENTITY_TEXTURE_URLS).length).toBe(9);
  });
});

describe('ENV_WALL_TEXTURE_URLS', () => {
  it('đủ sprite khối đặc cho tường đá và tường cỏ (tường bụi cây không có asset)', () => {
    expect(ENV_WALL_TEXTURE_URLS[ENV_WALL_STONE]).toMatch(/^\.\/assets\/terrain\/walls\/.+\.png$/);
    expect(ENV_WALL_TEXTURE_URLS[ENV_WALL_GRASS]).toMatch(/^\.\/assets\/terrain\/walls\/.+\.png$/);
    expect(Object.keys(ENV_WALL_TEXTURE_URLS).length).toBe(2);
  });
});
