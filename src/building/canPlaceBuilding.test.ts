import { describe, expect, it } from 'vitest';
import {
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_IRON_WALL,
  ENV_WALL_STONE,
  TERRAIN_IRON_ORE,
  TERRAIN_WATER,
  UNIT_DRONE,
} from '../config';
import { createEntity } from '../entity/createEntity';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import type { BuildPlan } from '../types';
import { canPlaceBuilding } from './canPlaceBuilding';

const plan = (x: number, y: number): BuildPlan => ({ type: BUILDING_IRON_WALL, x, y, rotation: 0, entityId: null });

describe('canPlaceBuilding', () => {
  const map = createEnvironmentMap(10, 10);

  it('ô cỏ trống → đặt được', () => {
    expect(canPlaceBuilding(map, [], [], BUILDING_IRON_WALL, 3, 3)).toBe(true);
  });

  it('ra ngoài map (âm, hoặc 2×2 thò ra mép phải) → không được', () => {
    expect(canPlaceBuilding(map, [], [], BUILDING_IRON_WALL, -1, 0)).toBe(false);
    expect(canPlaceBuilding(map, [], [], BUILDING_DRILL, 9, 0)).toBe(false);
  });

  it('trên nước hoặc trên tường môi trường → không được', () => {
    const special = createEnvironmentMap(10, 10);
    special.terrain[2 * 10 + 2] = TERRAIN_WATER;
    special.wall[5 * 10 + 5] = ENV_WALL_STONE;
    expect(canPlaceBuilding(special, [], [], BUILDING_IRON_WALL, 2, 2)).toBe(false);
    expect(canPlaceBuilding(special, [], [], BUILDING_DRILL, 4, 4)).toBe(false);
  });

  it('máy đào: có ít nhất 1 ô quặng bên dưới → được; không có ô quặng nào → không được', () => {
    const ore = createEnvironmentMap(10, 10);
    ore.terrain[5 * 10 + 5] = TERRAIN_IRON_ORE;
    expect(canPlaceBuilding(ore, [], [], BUILDING_DRILL, 4, 4)).toBe(true);
    expect(canPlaceBuilding(ore, [], [], BUILDING_DRILL, 6, 6)).toBe(false);
  });

  it('công trình khác đặt lên quặng → không được', () => {
    const ore = createEnvironmentMap(10, 10);
    ore.terrain[5 * 10 + 5] = TERRAIN_IRON_ORE;
    expect(canPlaceBuilding(ore, [], [], BUILDING_IRON_WALL, 5, 5)).toBe(false);
    expect(canPlaceBuilding(ore, [], [], BUILDING_CORE, 4, 4)).toBe(false);
  });

  it('chồng lên công trình có sẵn (core 3×3 ở (2, 2)) → không được; sát cạnh thì được', () => {
    const core = createEntity(BUILDING_CORE, 2, 2);
    expect(canPlaceBuilding(map, [core], [], BUILDING_IRON_WALL, 4, 4)).toBe(false);
    expect(canPlaceBuilding(map, [core], [], BUILDING_IRON_WALL, 5, 4)).toBe(true);
  });

  it('drone đứng trên ô không cản việc đặt', () => {
    const drone = createEntity(UNIT_DRONE, 3, 3);
    expect(canPlaceBuilding(map, [drone], [], BUILDING_IRON_WALL, 3, 3)).toBe(true);
  });

  it('chồng lên công trình đang chờ xây → không được', () => {
    expect(canPlaceBuilding(map, [], [plan(6, 6)], BUILDING_CORE, 5, 5)).toBe(false);
    expect(canPlaceBuilding(map, [], [plan(6, 6)], BUILDING_IRON_WALL, 7, 6)).toBe(true);
  });
});
