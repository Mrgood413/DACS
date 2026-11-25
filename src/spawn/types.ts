import type { EnemyKind } from '../config';
import type { Entity, Point } from '../types';

export type WaveId = number;
export type SpawnGroupId = number;
export type SpawnNodeGroupId = number;
export type SpawnNodeId = number;

/** Quy tắc chọn SpawnNode trong SpawnNodeGroup. */
export type SpawnNodeSelectionRule =
  | { kind: 'roundRobin' }
  | { kind: 'random' }                         // ngẫu nhiên 1 node trong nhóm
  | { kind: 'fixedOrder'; nodeOrder: SpawnNodeId[] };

export interface DarkZone {
  center: Point;
  radius: number;
  visual: { color: number; alpha: number };
}

/** Một điểm spawn nằm ngoài ranh giới bản đồ. Enemy xuất tại đây rồi đi vào trong bản đồ. */
export interface SpawnNode {
  id: SpawnNodeId;
  position: Point;          // toạ độ ô, ngoài ranh giới bản đồ (có thể âm hoặc >= width/height)
  inwardDirection: Point;   // hướng vào trong bản đồ (ví dụ {x:0, y:1} = xuống)
  darkZone: DarkZone;
}

/** Nhóm các SpawnNode dùng chung cho một hoặc nhiều SpawnGroup. */
export interface SpawnNodeGroup {
  id: SpawnNodeGroupId;
  nodes: SpawnNode[];
  selectionRule: SpawnNodeSelectionRule;
}

/** Một đợt spawn trong một Wave. */
export interface SpawnGroup {
  id: SpawnGroupId;
  enemyType: EnemyKind;
  totalCount: number;       // tổng số kẻ trong group
  batchSize: number;        // số kẻ spawn mỗi đợt (cùng lúc)
  intervalSeconds: number;  // thời gian chờ giữa các đợt (giây); 0 = spawn hết ngay
  spawnNodeGroupId: SpawnNodeGroupId;
}

/** Một Wave: danh sách SpawnGroup được spawn tuần tự. */
export interface Wave {
  id: WaveId;
  spawnGroups: SpawnGroup[];
  interWaveIntervalSeconds: number;  // thời gian chờ giữa các wave (giây)
  preWaveDelaySeconds: number;       // thời gian chờ trước wave đầu tiên (giây)
}

/** Runtime của SpawnNodeGroup: theo tr índice node đã chọn. */
export interface SpawnNodeGroupRuntime {
  id: SpawnNodeGroupId;
  nextNodeIndex: number;
}

/** Runtime của một SpawnGroup. */
export interface SpawnGroupRuntime {
  id: SpawnGroupId;
  spawnedCount: number;
  accumulator: number;
  completed: boolean;
}

/** Runtime của một Wave. */
export interface WaveRuntime {
  id: WaveId;
  currentGroupIndex: number;
  completed: boolean;
  interWaveAccumulator: number;   // đếm thời gian chờ giữa wave
  preWaveAccumulator: number;     // đếm thời gian chờ trước wave đầu
  waitingBeforeFirstWave: boolean;
  waitingBetweenGroups: boolean;
  interGroupAccumulator: number;
}

/** Trạng thái spawn của một enemy. */
export type EnemySpawnState =
  | 'spawning'   // vừa xuất hiện tại SpawnNode, chưa vào bản đồ
  | 'entering'   // đang di chuyển từ SpawnNode vào trong bản đồ
  | 'seeking'    // tìm đường đến Core
  | 'moving'     // đang di chuyển theo đường tìm được
  | 'attacking'; // đã đến Core, đang tấn công

export interface EnemySpawnInfo {
  spawnNodeId: SpawnNodeId;
  spawnState: EnemySpawnState;
  enteringStartTime?: number;
}
