import { describe, expect, it } from 'vitest';
import {
  BUILDING_CORE,
  BUILDING_COPPER_WALL,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_BANNER,
  BUILDING_ROUTER,
  BUILDING_TURRET,
  ENV_WALL_BUSH,
  ENV_WALL_GRASS,
  ENV_WALL_STONE,
  UNIT_BUG,
  UNIT_DRONE,
} from '../config';
import {
  CONVEYOR_MOVE_TEXTURE_URLS,
  ENTITY_BASE_TEXTURE_URLS,
  ENTITY_TEXTURE_URLS,
  ENV_WALL_TEXTURE_URLS,
} from './loadGameTextures';

/** Mẫu đường dẫn chuẩn: ./assets/<nhóm>/<đối tượng>/<đối tượng>[_<phần hoặc khung>].png */
const ASSET_PATH = /^\.\/assets\/(buildings|units|walls|terrain)\/([a-z_]+)\/\2(_[a-z0-9]+)?\.png$/;

describe('ENTITY_TEXTURE_URLS', () => {
  it('đủ sprite cho cả 10 loại thực thể (kể cả băng chuyền BUILDING_BANNER và router), đúng mẫu thư mục', () => {
    const ids = [
      BUILDING_CORE,
      BUILDING_TURRET,
      BUILDING_ELECTRIC_TURRET,
      BUILDING_DRILL,
      BUILDING_IRON_WALL,
      BUILDING_COPPER_WALL,
      BUILDING_BANNER,
      BUILDING_ROUTER,
      UNIT_DRONE,
      UNIT_BUG,
    ];
    for (const id of ids) {
      expect(ENTITY_TEXTURE_URLS[id]).toMatch(ASSET_PATH);
    }
    expect(Object.keys(ENTITY_TEXTURE_URLS).length).toBe(10);
  });

  it('công trình nằm trong buildings/, đơn vị nằm trong units/', () => {
    expect(ENTITY_TEXTURE_URLS[BUILDING_CORE]).toBe('./assets/buildings/core/core.png');
    expect(ENTITY_TEXTURE_URLS[UNIT_DRONE]).toBe('./assets/units/drone/drone.png');
  });
});

describe('ENTITY_BASE_TEXTURE_URLS', () => {
  it('cả 2 loại trụ súng đều có ảnh bệ riêng', () => {
    expect(ENTITY_BASE_TEXTURE_URLS[BUILDING_TURRET]).toBe('./assets/buildings/turret/turret_base.png');
    expect(ENTITY_BASE_TEXTURE_URLS[BUILDING_ELECTRIC_TURRET]).toBe(
      './assets/buildings/arc_turret/arc_turret_base.png',
    );
    expect(Object.keys(ENTITY_BASE_TEXTURE_URLS)).toHaveLength(2);
  });
});

describe('ENV_WALL_TEXTURE_URLS', () => {
  it('đủ sprite cho cả 3 loại tường: đá, cỏ và bụi cây, đúng mẫu thư mục', () => {
    expect(ENV_WALL_TEXTURE_URLS[ENV_WALL_STONE]).toBe('./assets/walls/stone/stone.png');
    expect(ENV_WALL_TEXTURE_URLS[ENV_WALL_GRASS]).toBe('./assets/walls/grass/grass.png');
    expect(ENV_WALL_TEXTURE_URLS[ENV_WALL_BUSH]).toBe('./assets/walls/bush/bush.png');
    expect(Object.keys(ENV_WALL_TEXTURE_URLS).length).toBe(3);
  });
});

describe('CONVEYOR_MOVE_TEXTURE_URLS', () => {
  it('khung hình 1 của animation băng chuyền', () => {
    expect(CONVEYOR_MOVE_TEXTURE_URLS[BUILDING_BANNER]).toBe('./assets/buildings/conveyor/conveyor_1.png');
    expect(Object.keys(CONVEYOR_MOVE_TEXTURE_URLS)).toHaveLength(1);
  });
});
