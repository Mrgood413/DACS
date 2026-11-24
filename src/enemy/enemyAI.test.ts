import { describe, expect, it, vi } from 'vitest';
import { ENEMY_ATTACK_INTERVAL, ENEMY_ATTACK_RANGE, ENEMY_SPEED } from '../config';
import type { Entity, EnvironmentMap, Point } from '../types';
import { updateEnemyAI } from './enemyAI';

// Mock findPath để kiểm soát việc tìm đường.
vi.mock('../pathfinding/findPath', () => ({
  findPath: vi.fn(),
}));
import { findPath } from '../pathfinding/findPath';

const mockedFindPath = findPath as ReturnType<typeof vi.fn>;

function makeCore(id = 1, x = 10, y = 10, hp = 100): Entity {
  return {
    id,
    type: 1, // BUILDING_CORE
    x,
    y,
    width: 3,
    height: 3,
    rotation: 0,
    hp,
    maxHp: 100,
    constructing: false,
  };
}

function makeEnemy(
  id = 2,
  x = 0,
  y = 0,
  state: 'spawning' | 'seeking' | 'moving' | 'attacking' = 'spawning',
): Entity {
  return {
    id,
    type: 9, // UNIT_BUG
    x,
    y,
    width: 1,
    height: 1,
    rotation: 0,
    hp: 30,
    maxHp: 30,
    constructing: false,
    enemyState: state,
    enemyTargetId: 1,
    enemyPath: [],
    enemyPathIndex: 0,
    enemyLastAttackTime: 0,
    enemySpawnNodeId: 100,
  };
}

function makeEmptyMap(width = 20, height = 20): EnvironmentMap {
  const map: EnvironmentMap = {
    width,
    height,
    terrain: new Uint8Array(width * height).fill(1), // TERRAIN_GRASS
    wall: new Uint8Array(width * height).fill(0), // ENV_WALL_NONE
  };
  return map;
}

describe('updateEnemyAI', () => {
  it('spawning → seeking ngay lập tức', () => {
    const enemy = makeEnemy(2, 0, 0, 'spawning');
    const core = makeCore();
    const map = makeEmptyMap();
    mockedFindPath.mockReturnValue(null);

    updateEnemyAI(enemy, [core, enemy], map, 0.016);

    expect(enemy.enemyState).toBe('seeking');
  });

  it('seeking: tìm được đường → moving, thiết lập enemyPath', () => {
    const enemy = makeEnemy(2, 0, 0, 'seeking');
    const core = makeCore();
    const map = makeEmptyMap();
    const fakePath: Point[] = [{ x: 1, y: 0 }, { x: 2, y: 0 }];
    mockedFindPath.mockReturnValue(fakePath);

    updateEnemyAI(enemy, [core, enemy], map, 0.016);

    expect(enemy.enemyState).toBe('moving');
    expect(enemy.enemyPath).toEqual(fakePath);
    expect(enemy.enemyPathIndex).toBe(0);
  });

  it('seeking: không tìm được đường → vẫn staying seeking', () => {
    const enemy = makeEnemy(2, 0, 0, 'seeking');
    const core = makeCore();
    const map = makeEmptyMap();
    mockedFindPath.mockReturnValue(null);

    updateEnemyAI(enemy, [core, enemy], map, 0.016);

    expect(enemy.enemyState).toBe('seeking');
    expect(enemy.enemyPath).toEqual([]);
  });

  it('moving: di chuyển theo path từng ô một', () => {
    const enemy = makeEnemy(2, 0, 0, 'moving');
    enemy.enemyPath = [{ x: 2, y: 0 }];
    enemy.enemyPathIndex = 0;
    const core = makeCore();
    const map = makeEmptyMap();

    // deltaSeconds = 0.5, ENEMY_SPEED = 2 → step = 1 ô. Từ (0,0) đến (2,0) cách 2 ô, bước đi được 1 ô → đến (1, 0).
    updateEnemyAI(enemy, [core, enemy], map, 0.5);

    expect(enemy.x).toBe(1);
    expect(enemy.y).toBe(0);
    expect(enemy.enemyPathIndex).toBe(0); // Chưa đến ô (2,0)
  });

  it('moving: đến cuối path → attacking', () => {
    const enemy = makeEnemy(2, 0, 0, 'moving');
    enemy.enemyPath = [{ x: 0.5, y: 0 }];
    enemy.enemyPathIndex = 0;
    const core = makeCore();
    const map = makeEmptyMap();

    // deltaSeconds = 1, ENEMY_SPEED = 2 → step = 2 ô. Từ (0,0) đến (0.5, 0) cách 0.5 ô <= 2 → đến đích.
    updateEnemyAI(enemy, [core, enemy], map, 1);

    expect(enemy.x).toBe(0.5);
    expect(enemy.y).toBe(0);
    expect(enemy.enemyPathIndex).toBe(1);
    expect(enemy.enemyState).toBe('attacking');
  });

  it('attacking: trong tầm tấn công và đủ thời gian → giảm hp Core', () => {
    const enemy = makeEnemy(2, 10.5, 10.5, 'attacking');
    enemy.enemyLastAttackTime = 0;
    const core = makeCore(1, 10, 10, 100);
    const map = makeEmptyMap();
    mockedFindPath.mockReturnValue(null);

    // Tâm Core tại (11.5, 11.5), tâm enemy tại (11, 11). Khoảng cách ≈ 0.7 <= ENEMY_ATTACK_RANGE (1).
    // deltaSeconds = 2, ENEMY_ATTACK_INTERVAL = 1.5 → đã vượt quá interval → tấn công.
    updateEnemyAI(enemy, [core, enemy], map, 2);

    expect(core.hp).toBe(100 - 10); // ENEMY_DAMAGE = 10
    expect(enemy.enemyLastAttackTime).toBe(0); // Reset sau khi tấn công
  });

  it('attacking: trong tầm tấn công nhưng chưa đủ thời gian → không giảm hp', () => {
    const enemy = makeEnemy(2, 10.5, 10.5, 'attacking');
    enemy.enemyLastAttackTime = 0;
    const core = makeCore(1, 10, 10, 100);
    const map = makeEmptyMap();

    // deltaSeconds = 0.5, chưa đủ ENEMY_ATTACK_INTERVAL (1.5).
    updateEnemyAI(enemy, [core, enemy], map, 0.5);

    expect(core.hp).toBe(100);
    expect(enemy.enemyLastAttackTime).toBeCloseTo(0.5);
  });

  it('attacking: ra ngoài tầm tấn công → quay lại seeking', () => {
    const enemy = makeEnemy(2, 0, 0, 'attacking');
    enemy.enemyLastAttackTime = 0;
    const core = makeCore(1, 10, 10, 100);
    const map = makeEmptyMap();

    updateEnemyAI(enemy, [core, enemy], map, 0.016);

    expect(enemy.enemyState).toBe('seeking');
  });

  it('không có Core → không làm gì', () => {
    const enemy = makeEnemy(2, 0, 0, 'attacking');
    const map = makeEmptyMap();
    const entities: Entity[] = [enemy]; // Không có Core

    updateEnemyAI(enemy, entities, map, 0.016);

    expect(enemy.enemyState).toBe('attacking'); // Không đổi
  });
});
