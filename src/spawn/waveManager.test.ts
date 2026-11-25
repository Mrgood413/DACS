import { describe, expect, it } from 'vitest';
import type { Entity, EnvironmentMap } from '../types';
import {
  advanceToNextGroup,
  createWaveRuntime,
  getCurrentGroup,
  getOrCreateGroupRuntime,
  isWaveCompleted,
  updateWave,
} from './waveManager';
import type {
  SpawnGroup,
  SpawnNodeGroup,
  Wave,
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

function makeWave(
  overrides: Partial<Wave> = {},
): Wave {
  return {
    id: 1,
    interWaveIntervalSeconds: 120,
    preWaveDelaySeconds: 120,
    spawnGroups: [
      makeSpawnGroup({ id: 1 }),
      makeSpawnGroup({ id: 2 }),
    ],
    ...overrides,
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

function makeSpawnNodeGroup(): SpawnNodeGroup {
  return {
    id: 1,
    nodes: [
      {
        id: 1,
        position: { x: -5, y: 50 },
        inwardDirection: { x: 1, y: 0 },
        darkZone: { center: { x: -10, y: 50 }, radius: 6, visual: { color: 0x000000, alpha: 0.8 } },
      },
      {
        id: 2,
        position: { x: -5, y: 60 },
        inwardDirection: { x: 1, y: 0 },
        darkZone: { center: { x: -10, y: 60 }, radius: 6, visual: { color: 0x000000, alpha: 0.8 } },
      },
    ],
    selectionRule: { kind: 'random' },
  };
}

describe('waveManager', () => {
  it('createWaveRuntime: trạng thái ban đầu chờ trước wave đầu', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);

    expect(runtime.waitingBeforeFirstWave).toBe(true);
    expect(runtime.preWaveAccumulator).toBe(0);
    expect(runtime.completed).toBe(false);
  });

  it('updateWave: đợi preWaveDelaySeconds trước khi spawn group đầu tiên', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const spawnNodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const groupRuntimes = new Map<number, { id: number; spawnedCount: number; accumulator: number; completed: boolean }>();
    const nodeGroupRuntimes = new Map<number, { id: number; nextNodeIndex: number }>();

    // Chạy 120 giây = preWaveDelaySeconds
    const result = updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 120);

    expect(result.waiting).toBe(true);
    expect(runtime.waitingBeforeFirstWave).toBe(false);
    expect(entities).toHaveLength(0); // chưa spawn kẻ nào
  });

  it('updateWave: sau khi hết preWave, spawn group 1 ngay lập tức', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);
    runtime.preWaveAccumulator = 120;
    runtime.waitingBeforeFirstWave = false;
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const spawnNodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const groupRuntimes = new Map<number, { id: number; spawnedCount: number; accumulator: number; completed: boolean }>();
    const nodeGroupRuntimes = new Map<number, { id: number; nextNodeIndex: number }>();

    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);

    expect(entities).toHaveLength(2); // group 1 spawn 2 kẻ
    expect(groupRuntimes.get(1)?.completed).toBe(true);
    expect(runtime.waitingBetweenGroups).toBe(true); // chờ 2 giây giữa các group
  });

  it('updateWave: sau group 1 xong, đợi 2 giây rồi spawn group 2', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);
    runtime.preWaveAccumulator = 120;
    runtime.waitingBeforeFirstWave = false;
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const spawnNodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const groupRuntimes = new Map<number, { id: number; spawnedCount: number; accumulator: number; completed: boolean }>();
    const nodeGroupRuntimes = new Map<number, { id: number; nextNodeIndex: number }>();

    // Spawn group 1
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);
    expect(entities).toHaveLength(2);

    // Chạy 1 giây (chưa đủ 2 giây giữa các group)
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 1);
    expect(entities).toHaveLength(2); // chưa spawn thêm

    // Chạy thêm 1 giây (đủ 2 giây) → advanceToNextGroup, nhưng chưa spawn group 2
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 1);
    expect(entities).toHaveLength(2); // vẫn là 2, group 2 chưa spawn

    // Gọi thêm 1 lần để spawn group 2
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);
    expect(entities).toHaveLength(4); // group 2 spawn 2 kẻ
    expect(groupRuntimes.get(2)?.completed).toBe(true);
  });

  it('updateWave: sau hết 2 group, wave hoàn thành', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);
    runtime.preWaveAccumulator = 120;
    runtime.waitingBeforeFirstWave = false;
    const entities: Entity[] = [];
    const map = makeEmptyMap();
    const spawnNodeGroups: SpawnNodeGroup[] = [makeSpawnNodeGroup()];
    const groupRuntimes = new Map<number, { id: number; spawnedCount: number; accumulator: number; completed: boolean }>();
    const nodeGroupRuntimes = new Map<number, { id: number; nextNodeIndex: number }>();

    // Group 1 spawn
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);
    expect(entities).toHaveLength(2);
    // Chờ 2 giây giữa group
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 2);
    // Advance sang group 2
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);
    // Group 2 spawn
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);
    expect(entities).toHaveLength(4);
    // Chờ 2 giây giữa group 2 và kết thúc wave
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 2);
    // Advance → wave completed
    updateWave(wave, runtime, entities, map, spawnNodeGroups, groupRuntimes, nodeGroupRuntimes, 0.016);

    expect(runtime.completed).toBe(true);
    expect(entities).toHaveLength(4); // 2 group × 2 kẻ = 4
  });

  it('advanceToNextGroup: chuyển từ group 1 sang group 2, không xen kẽ', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);

    expect(getCurrentGroup(wave, runtime)?.id).toBe(1);
    expect(advanceToNextGroup(wave, runtime)).toBe(true);
    expect(getCurrentGroup(wave, runtime)?.id).toBe(2);
    expect(advanceToNextGroup(wave, runtime)).toBe(false);
    expect(runtime.completed).toBe(true);
  });

  it('isWaveCompleted: true khi wave hoàn thành', () => {
    const wave = makeWave();
    const runtime = createWaveRuntime(wave);
    runtime.completed = true;
    expect(isWaveCompleted(runtime)).toBe(true);
  });
});
