import { describe, expect, it } from 'vitest';
import { ENEMY_MAX_HP, UNIT_BUG } from '../config';
import type { Entity } from '../types';
import { createEnemy } from './createEnemy';

describe('createEnemy', () => {
  it('tạo enemy với id mới, trạng thái spawning, mục tiêu là Core (id 1)', () => {
    const entities: Entity[] = [
      { id: 1, type: 1, x: 10, y: 10, width: 3, height: 3, rotation: 0, hp: 100, maxHp: 100, constructing: false },
    ];

    const enemy = createEnemy(entities, -5, 50, 100);

    expect(enemy.id).toBe(2); // getNextEntityId: maxId(1) + 1 = 2
    expect(enemy.type).toBe(UNIT_BUG);
    expect(enemy.x).toBe(-5); // Ngoài ranh giới
    expect(enemy.y).toBe(50);
    expect(enemy.width).toBe(1);
    expect(enemy.height).toBe(1);
    expect(enemy.hp).toBe(ENEMY_MAX_HP);
    expect(enemy.maxHp).toBe(ENEMY_MAX_HP);
    expect(enemy.constructing).toBe(false);
    expect(enemy.enemyState).toBe('spawning');
    expect(enemy.enemyTargetId).toBe(1); // Core
    expect(enemy.enemyPath).toEqual([]);
    expect(enemy.enemyPathIndex).toBe(0);
    expect(enemy.enemyLastAttackTime).toBe(0);
    expect(enemy.enemySpawnNodeId).toBe(100);
  });

  it('tạo nhiều enemy → id tăng dần', () => {
    const entities: Entity[] = [
      { id: 1, type: 1, x: 10, y: 10, width: 3, height: 3, rotation: 0, hp: 100, maxHp: 100, constructing: false },
    ];

    const e1 = createEnemy(entities, -1, 0, 1);
    entities.push(e1);
    const e2 = createEnemy(entities, 100, 50, 2);

    expect(e1.id).toBe(2);
    expect(e2.id).toBe(3);
  });

  it('toạ độ âm hoặc >= map size không bị lỗi (spawn ngoài ranh giới)', () => {
    const entities: Entity[] = [];

    const e1 = createEnemy(entities, -10, -10, 1);
    expect(e1.x).toBe(-10);
    expect(e1.y).toBe(-10);

    const e2 = createEnemy(entities, 200, 200, 2);
    expect(e2.x).toBe(200);
    expect(e2.y).toBe(200);
  });
});
