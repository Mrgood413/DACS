import { describe, expect, it, vi } from 'vitest';
import { ENEMY_MAX_SPAWNS, ENEMY_SPAWN_INTERVAL, UNIT_BUG } from '../config';
import type { Entity, EnvironmentMap } from '../types';
import { updateEnemies } from './updateEnemies';

// Mock createEnemy để kiểm soát việc tạo enemy.
vi.mock('../entity/createEnemy', () => ({
  createEnemy: vi.fn(),
}));
import { createEnemy } from '../entity/createEnemy';

const mockedCreateEnemy = createEnemy as ReturnType<typeof vi.fn>;

function makeCore(): Entity {
  return {
    id: 1,
    type: 1,
    x: 10,
    y: 10,
    width: 3,
    height: 3,
    rotation: 0,
    hp: 100,
    maxHp: 100,
    constructing: false,
  };
}

function makeEnemy(id: number, x: number, y: number): Entity {
  return {
    id,
    type: UNIT_BUG,
    x,
    y,
    width: 1,
    height: 1,
    rotation: 0,
    hp: 30,
    maxHp: 30,
    constructing: false,
    enemyState: 'moving',
    enemyTargetId: 1,
    enemyPath: [],
    enemyPathIndex: 0,
    enemyLastAttackTime: 0,
    enemySpawnNodeId: 100,
  };
}

function makeEmptyMap(width = 20, height = 20): EnvironmentMap {
  return {
    width,
    height,
    terrain: new Uint8Array(width * height).fill(1),
    wall: new Uint8Array(width * height).fill(0),
  };
}

describe('updateEnemies', () => {
  it('chưa đủ số lượng tối đa và accumulator đủ → spawn enemy mới', () => {
    const entities: Entity[] = [makeCore()];
    const map = makeEmptyMap();
    const newEnemy = makeEnemy(2, -1, 50);
    mockedCreateEnemy.mockReturnValue(newEnemy);

    const acc = updateEnemies(entities, map, ENEMY_SPAWN_INTERVAL, 0);

    expect(mockedCreateEnemy).toHaveBeenCalledTimes(1);
    expect(entities).toContain(newEnemy);
    expect(acc).toBe(0); // Đã reset accumulator
  });

  it('đã đủ số lượng tối đa → không spawn, accumulator vẫn tăng', () => {
    const enemies = Array.from({ length: ENEMY_MAX_SPAWNS }, (_, i) => makeEnemy(i + 3, i, i));
    const entities: Entity[] = [makeCore(), ...enemies];
    const map = makeEmptyMap();

    const acc = updateEnemies(entities, map, 0, 1);

    expect(mockedCreateEnemy).not.toHaveBeenCalled();
    expect(entities).toHaveLength(ENEMY_MAX_SPAWNS + 1); // Core + enemies
    expect(acc).toBe(1); // accumulator tăng dù không spawn
  });

  it('chưa đủ accumulator → không spawn', () => {
    const entities: Entity[] = [makeCore()];
    const map = makeEmptyMap();

    const acc = updateEnemies(entities, map, ENEMY_SPAWN_INTERVAL - 0.1, 0.05);

    expect(mockedCreateEnemy).not.toHaveBeenCalled();
    expect(acc).toBeCloseTo(ENEMY_SPAWN_INTERVAL - 0.05);
  });

  it('cập nhật AI cho mỗi enemy đang sống', () => {
    // Không mock findPath → dùng map thực tế. Từ (0,0) đến Core (10,10) có đường đi.
    const enemy1 = makeEnemy(3, 0, 0);
    enemy1.enemyState = 'seeking';
    const enemy2 = makeEnemy(4, 1, 1);
    enemy2.enemyState = 'seeking';
    const entities: Entity[] = [makeCore(), enemy1, enemy2];
    const map = makeEmptyMap();

    updateEnemies(entities, map, 0, 0.016);

    // Cả hai enemy đều được cập nhật (tìm được đường từ seeking → moving).
    expect(enemy1.enemyState).toBe('moving');
    expect(enemy2.enemyState).toBe('moving');
  });

  it('không có enemy → không làm gì', () => {
    const entities: Entity[] = [makeCore()];
    const map = makeEmptyMap();

    const acc = updateEnemies(entities, map, 0, 1);

    expect(mockedCreateEnemy).not.toHaveBeenCalled();
    expect(acc).toBe(1);
  });
});
