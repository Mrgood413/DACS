import type { Wave, SpawnGroup, SpawnNodeGroup, SpawnNode, SpawnNodeSelectionRule } from './types';

export interface WaveTemplate {
  id: number;
  interWaveIntervalSeconds: number;
  preWaveDelaySeconds: number;
  spawnGroups: SpawnGroup[];
}

export interface SpawnNodeGroupTemplate {
  id: number;
  nodes: SpawnNode[];
  selectionRule: SpawnNodeSelectionRule;
}

/**
 * SpawnNodeGroup 1: 2 SpawnNode nằm phía trên cùng map, trong khe giữa hai tường đá.
 * Vị trí ngoài ranh giới (y = -5), hướng vào bản đồ là xuống (0, 1).
 * Khi spawn, random chọn 1 trong 2 node này.
 */
export const SPAWN_NODE_GROUPS: SpawnNodeGroupTemplate[] = [
  {
    id: 1,
    nodes: [
      {
        id: 1,
        position: { x: 38, y: -5 },
        inwardDirection: { x: 0, y: 1 },
        darkZone: { center: { x: 38, y: -10 }, radius: 6, visual: { color: 0x000000, alpha: 0.8 } },
      },
      {
        id: 2,
        position: { x: 50, y: -5 },
        inwardDirection: { x: 0, y: 1 },
        darkZone: { center: { x: 50, y: -10 }, radius: 6, visual: { color: 0x000000, alpha: 0.8 } },
      },
    ],
    selectionRule: { kind: 'random' },
  },
  {
    id: 2,
    nodes: [], // sẽ bổ sung sau nếu cần
    selectionRule: { kind: 'random' },
  },
];

/**
 * Tạo 3 Wave.
 * Mỗi wave: 2 SpawnGroup, mỗi group 2 kẻ (Bug) trong 1 đợt (batchSize = 2, intervalSeconds = 0).
 * Mỗi group cách nhau 2 giây.
 * Mỗi wave đợi 120 giây (2 phút) trước khi bắt đầu (tính từ khởi đầu màn).
 * Khoảng cách giữa các wave: 120 giây.
 */
export function createWaveTemplates(): WaveTemplate[] {
  const waves: WaveTemplate[] = [];

  for (let waveId = 1; waveId <= 3; waveId++) {
    const groups: SpawnGroup[] = [];

    for (let groupId = 1; groupId <= 2; groupId++) {
      groups.push({
        id: groupId,
        enemyType: 'Bug' as const,
        totalCount: 2,
        batchSize: 2,
        intervalSeconds: 0,   // spawn hết 2 kẻ cùng lúc trong 1 đợt
        spawnNodeGroupId: 1,
      });
    }

    waves.push({
      id: waveId,
      interWaveIntervalSeconds: 120,   // 2 phút giữa các wave
      preWaveDelaySeconds: 120,        // 2 phút trước wave đầu tiên
      spawnGroups: groups,
    });
  }

  return waves;
}
