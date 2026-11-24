import { describe, expect, it } from 'vitest';
import {
  BUILDING_TURRET,
  TURRET_FIRE_INTERVAL,
  TURRET_MAX_AMMO,
  TURRET_RANGE,
  UNIT_BUG,
} from '../config';
import { createEntity } from '../entity/createEntity';
import { updateTurrets } from './updateTurrets';

describe('updateTurrets', () => {
  it('có bug trong tầm và còn đạn → bắn 1 viên, hạ nhiệt 4 giây', () => {
    const turret = createEntity(BUILDING_TURRET, 10, 10);
    turret.ammo = TURRET_MAX_AMMO;
    const bug = createEntity(UNIT_BUG, 10 + TURRET_RANGE - 1, 10);
    updateTurrets([turret, bug], 0.1);
    expect(turret.ammo).toBe(TURRET_MAX_AMMO - 1);
    expect(turret.cooldown).toBeCloseTo(TURRET_FIRE_INTERVAL);
  });

  it('không có bug thì không bắn', () => {
    const turret = createEntity(BUILDING_TURRET, 10, 10);
    turret.ammo = TURRET_MAX_AMMO;
    updateTurrets([turret], 1);
    expect(turret.ammo).toBe(TURRET_MAX_AMMO);
  });

  it('bug ngoài tầm 10 ô thì không bắn', () => {
    const turret = createEntity(BUILDING_TURRET, 10, 10);
    turret.ammo = TURRET_MAX_AMMO;
    const bug = createEntity(UNIT_BUG, 10 + TURRET_RANGE + 1, 10);
    updateTurrets([turret, bug], 1);
    expect(turret.ammo).toBe(TURRET_MAX_AMMO);
  });

  it('đang hạ nhiệt hoặc hết đạn thì không bắn; hạ nhiệt xong thì bắn tiếp', () => {
    const turret = createEntity(BUILDING_TURRET, 10, 10);
    turret.ammo = TURRET_MAX_AMMO;
    turret.cooldown = 2;
    const bug = createEntity(UNIT_BUG, 11, 10);
    updateTurrets([turret, bug], 1);
    expect(turret.ammo).toBe(TURRET_MAX_AMMO);
    updateTurrets([turret, bug], 1.1);
    expect(turret.ammo).toBe(TURRET_MAX_AMMO - 1);

    turret.cooldown = 0;
    turret.ammo = 0;
    updateTurrets([turret, bug], 1);
    expect(turret.ammo).toBe(0);
  });
});
