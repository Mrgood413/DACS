import { spawnEnemyAtNode } from './spawnManager';
import type { Entity, EnvironmentMap } from '../types';
import type {
  SpawnGroup,
  SpawnGroupId,
  SpawnGroupRuntime,
  SpawnNode,
  SpawnNodeGroup,
  SpawnNodeGroupId,
  SpawnNodeGroupRuntime,
  SpawnNodeSelectionRule,
} from './types';

/**
 * Chọn SpawnNode trong SpawnNodeGroup theo quy tắc selectionRule.
 * 'random': ngẫu nhiên 1 node trong nhóm (đủ số lượng node > 0).
 * 'roundRobin': chọn lần lượt các node.
 * 'fixedOrder': chọn theo thứ tự nodeOrder.
 */
export function selectSpawnNode(
  group: SpawnNodeGroup,
  runtime: SpawnNodeGroupRuntime,
): SpawnNode | undefined {
  if (group.nodes.length === 0) {
    return undefined;
  }

  switch (group.selectionRule.kind) {
    case 'random': {
      const index = Math.floor(Math.random() * group.nodes.length);
      return group.nodes[index];
    }
    case 'roundRobin': {
      const node = group.nodes[runtime.nextNodeIndex % group.nodes.length];
      runtime.nextNodeIndex = (runtime.nextNodeIndex + 1) % group.nodes.length;
      return node;
    }
    case 'fixedOrder': {
      const order = group.selectionRule.nodeOrder;
      if (order.length === 0) {
        return undefined;
      }
      const nodeId = order[runtime.nextNodeIndex % order.length];
      const node = group.nodes.find((n) => n.id === nodeId);
      runtime.nextNodeIndex = (runtime.nextNodeIndex + 1) % order.length;
      return node;
    }
    default:
      return undefined;
  }
}

export function createSpawnGroupRuntime(group: SpawnGroup): SpawnGroupRuntime {
  return {
    id: group.id,
    spawnedCount: 0,
    accumulator: 0,
    completed: false,
  };
}

/**
 * Cập nhật spawn cho một SpawnGroup trong một khung hình.
 * - Đợt đầu tiên (spawnedCount === 0) spawn ngay lập tức, không cần chờ.
 * - Các đợt sau cần đợi đủ intervalSeconds.
 * - Spawn hết batchSize kẻ cùng lúc (hoặc ít hơn nếu gần hết totalCount).
 * - Sau khi spawn đủ totalCount, group đánh dấu completed.
 * @returns { spawned: boolean, completed: boolean }
 */
export function updateSpawnGroup(
  group: SpawnGroup,
  runtime: SpawnGroupRuntime,
  entities: Entity[],
  map: EnvironmentMap,
  spawnNodeGroups: SpawnNodeGroup[],
  nodeGroupRuntimes: Map<SpawnNodeGroupId, SpawnNodeGroupRuntime>,
  deltaSeconds: number,
): { spawned: boolean; completed: boolean } {
  if (runtime.completed) {
    return { spawned: false, completed: true };
  }

  runtime.accumulator += deltaSeconds;

  if (runtime.spawnedCount >= group.totalCount) {
    runtime.completed = true;
    return { spawned: false, completed: true };
  }

  const remaining = group.totalCount - runtime.spawnedCount;
  const batch = Math.min(group.batchSize, remaining);

  const isFirstBatch = runtime.spawnedCount === 0;
  const canSpawn = isFirstBatch || runtime.accumulator >= group.intervalSeconds;

  if (!canSpawn) {
    return { spawned: false, completed: false };
  }

  const nodeGroup = spawnNodeGroups.find((g) => g.id === group.spawnNodeGroupId);
  if (!nodeGroup) {
    return { spawned: false, completed: false };
  }

  let nodeRuntime = nodeGroupRuntimes.get(nodeGroup.id);
  if (!nodeRuntime) {
    nodeRuntime = { id: nodeGroup.id, nextNodeIndex: 0 };
    nodeGroupRuntimes.set(nodeGroup.id, nodeRuntime);
  }

  let spawned = 0;
  for (let i = 0; i < batch; i++) {
    const node = selectSpawnNode(nodeGroup, nodeRuntime);
    if (!node) {
      break;
    }
    spawnEnemyAtNode(entities, node, group.enemyType);
    spawned++;
  }

  runtime.spawnedCount += spawned;
  runtime.accumulator = 0;

  if (runtime.spawnedCount >= group.totalCount) {
    runtime.completed = true;
  }

  return { spawned: spawned > 0, completed: runtime.completed };
}
