import { createSpawnGroupRuntime, updateSpawnGroup } from './spawnGroupManager';
import type { Entity, EnvironmentMap } from '../types';
import type {
  SpawnGroup,
  SpawnGroupId,
  SpawnGroupRuntime,
  SpawnNodeGroup,
  SpawnNodeGroupId,
  SpawnNodeGroupRuntime,
  Wave,
  WaveRuntime,
} from './types';

export function createWaveRuntime(wave: Wave): WaveRuntime {
  return {
    id: wave.id,
    currentGroupIndex: 0,
    completed: false,
    interWaveAccumulator: 0,
    preWaveAccumulator: 0,
    waitingBeforeFirstWave: true,
    waitingBetweenGroups: false,
    interGroupAccumulator: 0,
  };
}

export function getCurrentGroup(
  wave: Wave,
  runtime: WaveRuntime,
): SpawnGroup | undefined {
  if (runtime.completed || runtime.currentGroupIndex >= wave.spawnGroups.length) {
    return undefined;
  }
  return wave.spawnGroups[runtime.currentGroupIndex];
}

export function getOrCreateGroupRuntime(
  wave: Wave,
  runtime: WaveRuntime,
  groupRuntimes: Map<SpawnGroupId, SpawnGroupRuntime>,
): SpawnGroupRuntime | undefined {
  const group = getCurrentGroup(wave, runtime);
  if (!group) {
    return undefined;
  }

  let groupRuntime = groupRuntimes.get(group.id);
  if (!groupRuntime) {
    groupRuntime = createSpawnGroupRuntime(group);
    groupRuntimes.set(group.id, groupRuntime);
  }
  return groupRuntime;
}

export function advanceToNextGroup(
  wave: Wave,
  runtime: WaveRuntime,
): boolean {
  if (runtime.completed) {
    return false;
  }

  runtime.currentGroupIndex++;
  runtime.waitingBetweenGroups = false;
  runtime.interGroupAccumulator = 0;

  if (runtime.currentGroupIndex >= wave.spawnGroups.length) {
    runtime.completed = true;
    return false;
  }
  return true;
}

/**
 * Cập nhật Wave trong một khung hình.
 * Luồng xử lý:
 *  1. Chờ preWaveDelaySeconds trước wave đầu (waitingBeforeFirstWave = true).
 *  2. Cập nhật SpawnGroup hiện tại (spawn theo đợt, đợi intervalSeconds giữa các đợt).
 *  3. Khi SpawnGroup xong → đợi 2 giây (waitingBetweenGroups = true) rồi sang group tiếp.
 *  4. Khi hết group → wave completed.
 * @returns { waveCompleted, groupAdvanced, waiting }
 */
export function updateWave(
  wave: Wave,
  runtime: WaveRuntime,
  entities: Entity[],
  map: EnvironmentMap,
  spawnNodeGroups: SpawnNodeGroup[],
  groupRuntimes: Map<SpawnGroupId, SpawnGroupRuntime>,
  nodeGroupRuntimes: Map<SpawnNodeGroupId, SpawnNodeGroupRuntime>,
  deltaSeconds: number,
): { waveCompleted: boolean; groupAdvanced: boolean; waiting: boolean } {
  if (runtime.completed) {
    return { waveCompleted: true, groupAdvanced: false, waiting: false };
  }

  // 1. Chờ trước wave đầu tiên (preWaveDelaySeconds)
  if (runtime.waitingBeforeFirstWave) {
    runtime.preWaveAccumulator += deltaSeconds;
    if (runtime.preWaveAccumulator >= wave.preWaveDelaySeconds) {
      runtime.waitingBeforeFirstWave = false;
    }
    return { waveCompleted: false, groupAdvanced: false, waiting: true };
  }

  // 2. Chờ giữa các SpawnGroup (2 giây)
  if (runtime.waitingBetweenGroups) {
    runtime.interGroupAccumulator += deltaSeconds;
    if (runtime.interGroupAccumulator >= 2) {
      const advanced = advanceToNextGroup(wave, runtime);
      return { waveCompleted: runtime.completed, groupAdvanced: advanced, waiting: true };
    }
    return { waveCompleted: false, groupAdvanced: false, waiting: true };
  }

  // 3. Cập nhật SpawnGroup hiện tại
  const groupRuntime = getOrCreateGroupRuntime(wave, runtime, groupRuntimes);
  const currentGroup = getCurrentGroup(wave, runtime);

  if (!groupRuntime || !currentGroup) {
    runtime.completed = true;
    return { waveCompleted: true, groupAdvanced: false, waiting: false };
  }

  const result = updateSpawnGroup(
    currentGroup,
    groupRuntime,
    entities,
    map,
    spawnNodeGroups,
    nodeGroupRuntimes,
    deltaSeconds,
  );

  if (result.completed) {
    // Group xong → chờ 2 giây rồi sang group tiếp
    runtime.waitingBetweenGroups = true;
    runtime.interGroupAccumulator = 0;
    return { waveCompleted: false, groupAdvanced: false, waiting: false };
  }

  return { waveCompleted: false, groupAdvanced: false, waiting: false };
}

export function isWaveCompleted(runtime: WaveRuntime): boolean {
  return runtime.completed;
}
