import { describe, expect, it } from 'vitest';
import type { Entity, EnvironmentMap } from '../types';
import {
  createSpawnGroupRuntime,
  selectSpawnNode,
  updateSpawnGroup,
} from './spawnGroupManager';
import type {
  SpawnGroup,
  SpawnNode,
  SpawnNodeGroup,
  SpawnNodeGroupRuntime,
  SpawnNodeSelectionRule,
} from './types';

function makeSpawnGroup(
  overrides: Partial<SpawnGroup> = {},
): SpawnGroup {
  return {
    id: 1,
    enemyType: 'Bug' as const,
    totalCount: 2,
    batchSize: 2,
    intervalSeconds: 0,
    spawnNodeGroupId: 1,
    ...overrides,
  };
}

function makeSpawnNode(id = 1, x = -5, y = 50): SpawnNode {
  return {
    id,
    position: { x, y },
    inwardDirection: { x: 1, y: 0 },
    darkZone: { center: { x: -10, y: 50 }, radius: 6, visual: { color: 0x000000, alpha: 0.8 } },
  };
}

function makeSpawnNodeGroup(
  nodes: SpawnNode[] = [makeSpawnNode(1), makeSpawnNode(2)],
  selectionRule: SpawnNodeSelectionRule = { kind: 'random' },
): SpawnNodeGroup {
  return { id: 1, nodes, selectionRule };
}

function makeEmptyMap(width = 20, height = 20): EnvironmentMap {
  return {
    width,
    height,
    terrain: new Uint8Array(width * height).fill(1),
    wall: new Uint8Array(width * height).fill(0),
  };
}

describe('spawnGroupManager', () => {
  it('createSpawnGroupRuntime: trạng thái ban đầu', () => {
    const group = makeSpawnGroup();
    const runtime = createSpawnGroupRuntime(group);

    expect(runtime.id).toBe(1);
    expect(runtime.spawnedCount).toBe(0);
    expect(runtime.accumulator).toBe(0);
    expect(runtime.completed).toBe(false);
  });

  it('selectSpawnNode: random chọn 1 trong các node có sẵn', () => {
    const group = makeSpawnNodeGroup([makeSpawnNode(1), makeSpawnNode(2)], { kind: 'random' });
    const runtime: SpawnNodeGroupRuntime = { id: 1, nextNodeIndex: 0 };

    // Chạy nhiều lần, đều phải trả về 1 trong 2 node
    const ids = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const node = selectSpawnNode(group, runtime);
      expect(node).toBeDefined();
      ids.add(node!.id);
    }
    expect(ids.size).toBe(2); // cả 2 node đều được chọn ít nhất 1 lần
  });

  it('updateSpawnGroup: batch đầu tiên spawn hết cùng lúc, không cần chờ', () => {
    const group = makeSpawnGroup({ totalCount: 2, batchSize: 2, intervalSeconds: 5 });
    const runtime = createSpawnGroupRuntime(group);
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const nodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const nodeGroupRuntimes = new Map<number, SpawnNodeGroupRuntime>();

    const result = updateSpawnGroup(
      group, runtime, entities, map, nodeGroups, nodeGroupRuntimes, 0.016,
    );

    expect(result.spawned).toBe(true);
    expect(runtime.spawnedCount).toBe(2); // batchSize = 2, spawn hết cùng lúc
    expect(runtime.accumulator).toBe(0);
    expect(entities).toHaveLength(2);
    expect(result.completed).toBe(true); // totalCount = 2, đã đủ
  });

  it('updateSpawnGroup: group chưa xong thì accumulator chạy, không spawn xen kẽ', () => {
    const group = makeSpawnGroup({ totalCount: 4, batchSize: 2, intervalSeconds: 3 });
    const runtime = createSpawnGroupRuntime(group);
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const nodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const nodeGroupRuntimes = new Map<number, SpawnNodeGroupRuntime>();

    // Đợt 1: spawn 2 kẻ ngay lập tức
    updateSpawnGroup(group, runtime, entities, map, nodeGroups, nodeGroupRuntimes, 0.016);
    expect(runtime.spawnedCount).toBe(2);
    expect(entities).toHaveLength(2);

    // Chạy 2 giây (chưa đủ 3 giây) → không spawn đợt 2
    updateSpawnGroup(group, runtime, entities, map, nodeGroups, nodeGroupRuntimes, 2);
    expect(runtime.spawnedCount).toBe(2);
    expect(entities).toHaveLength(2);

    // Chạy thêm 1 giây (đủ 3 giây) → spawn đợt 2
    updateSpawnGroup(group, runtime, entities, map, nodeGroups, nodeGroupRuntimes, 1);
    expect(runtime.spawnedCount).toBe(4);
    expect(entities).toHaveLength(4);
    expect(runtime.completed).toBe(true);
  });

  it('updateSpawnGroup: đã completed thì không spawn thêm', () => {
    const group = makeSpawnGroup({ totalCount: 2, batchSize: 2, intervalSeconds: 0 });
    const runtime = createSpawnGroupRuntime(group);
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const nodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const nodeGroupRuntimes = new Map<number, SpawnNodeGroupRuntime>();

    updateSpawnGroup(group, runtime, entities, map, nodeGroups, nodeGroupRuntimes, 0.016);
    expect(runtime.completed).toBe(true);

    const result = updateSpawnGroup(group, runtime, entities, map, nodeGroups, nodeGroupRuntimes, 1);
    expect(result.spawned).toBe(false);
    expect(result.completed).toBe(true);
    expect(entities).toHaveLength(2);
  });
});
