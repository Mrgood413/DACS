/** Dữ liệu map dạng lưới. Ô (x, y) nằm ở tiles[y * width + x]. */
export type GameMap = {
  width: number;
  height: number;
  tiles: Uint8Array;
};

/** Loại vật phẩm di chuyển trên băng chuyền / trong kho. */
export type ItemType = number;

/** Vị trí camera: điểm trên map (pixel) nằm ở chính giữa màn hình. */
export type Camera = {
  x: number;
  y: number;
};

/** Trạng thái chuột. Toạ độ là pixel trên màn hình. */
export type Mouse = {
  /** Vị trí chuột hiện tại. */
  x: number;
  y: number;
  /** true khi chuột đang ở trong cửa sổ trình duyệt. */
  inside: boolean;
  /** true khi đang giữ chuột phải. */
  rightDown: boolean;
  /** true khi đang giữ chuột trái. */
  leftDown: boolean;
  /** Vị trí lúc bắt đầu kéo chọn bằng chuột trái. */
  dragStartX: number;
  dragStartY: number;
  /** true khi đang giữ phím Shift (dùng để kéo một hàng công trình). */
  shiftDown: boolean;
};

/** Hướng di chuyển: mỗi thành phần là -1, 0 hoặc 1. */
export type Direction = {
  x: number;
  y: number;
};

/** Hình chữ nhật: (x, y) là góc trên-trái. */
export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Thao tác chuột trái đang diễn ra. */
export type MouseAction = 'NONE' | 'CLICK_PENDING' | 'DRAGGING';

/** Đích đến của camera trên map (pixel). */
export type CameraTarget = {
  x: number;
  y: number;
};

/** Dữ liệu môi trường: mỗi ô có địa hình nền và tường môi trường lưu độc lập. Ô (x, y) nằm ở terrain[y * width + x] và wall[y * width + x]. */
export type EnvironmentMap = {
  width: number;
  height: number;
  /** Loại địa hình của từng ô, mã từ TERRAIN_*. */
  terrain: Uint8Array;
  /** Loại tường môi trường của từng ô, mã từ ENV_WALL_* (ENV_WALL_NONE nếu không có). */
  wall: Uint8Array;
};

/** Hình dáng vẽ của tường môi trường: 'stone' = cụm đá, 'grass' = bụi cỏ, 'bush' = bụi cây. */
export type WallShape = 'stone' | 'grass' | 'bush';

/** Thông tin hiển thị của tường môi trường. */
export type WallAppearance = {
  shape: WallShape;
  color: number;
};

/** Nhóm thực thể: công trình hoặc đơn vị. */
export type EntityGroup = 'Architecture' | 'Unit';

/** Trạng thái AI của enemy. */
export type EnemyState = 'spawning' | 'seeking' | 'moving' | 'attacking';

/** Mã loại thực thể: BUILDING_* hoặc UNIT_* (đặt kiểu là số để giữ mã từ config). */
export type EntityType = number;

/** Định nghĩa chung của một loại thực thể (nguồn duy nhất về kích thước, nhóm, xoay). */
export type EntityDefinition = {
  /** Mã loại thực thể (BUILDING_* / UNIT_*). */
  type: EntityType;
  /** Kích thước theo ô: ngang. */
  width: number;
  /** Kích thước theo ô: dọc. */
  height: number;
  /** Nhóm của thực thể. */
  group: EntityGroup;
  /** true nếu thực thể có hướng xoay. */
  rotatable: boolean;
};

/** Một thực thể xuất hiện trên map. (x, y) là ô góc trên-trái. */
export type Entity = {
  /** ID của thực thể (phân biệt từng cá thể). */
  id: number;
  /** Loại thực thể (BUILDING_* / UNIT_*). */
  type: EntityType;
  /** Ô góc trên-trái theo chiều ngang. */
  x: number;
  /** Ô góc trên-trái theo chiều dọc. */
  y: number;
  /** Kích thước theo ô: ngang (từ định nghĩa). */
  width: number;
  /** Kích thước theo ô: dọc (từ định nghĩa). */
  height: number;
  /** Hướng xoay: 0–3 (0 nếu không xoay được). */
  rotation: number;
  /** Máu hiện tại (0 → maxHp). Công trình đang xây thì máu tăng dần theo tiến độ xây. */
  hp: number;
  /** Máu tối đa. */
  maxHp: number;
  /** true khi công trình đang được xây (chưa xong). Xây xong thì về false, kể cả khi sau này bị mất máu. */
  constructing: boolean;
  /** Đạn hiện có (chỉ trụ súng). undefined nếu không dùng. */
  ammo?: number;
  /** Đạn tối đa (chỉ trụ súng). */
  maxAmmo?: number;
  /** Thời gian đếm ngược tới lần bắn tiếp theo (giây, chỉ trụ súng). */
  cooldown?: number;
  /** Kho chứa item của router: loại vật phẩm → số lượng. */
  routerInventory?: Map<ItemType, number>;
  /** Hướng (0–3) mà item vừa đến từ đó, dùng để quyết định hướng dump lần sau (giống Mindustry). */
  routerExtra?: number;
  /** Trạng thái AI của enemy: 'spawning' (vừa xuất hiện, chưa vào bản đồ) | 'seeking' (tìm đường đến Core) | 'moving' (đang di chuyển theo đường) | 'attacking' (đã đến Core, đang tấn công). */
  enemyState?: EnemyState;
  /** ID của mục tiêu attacker (chỉ enemy: id của Core). */
  enemyTargetId?: number;
  /** Đường đi hiện tại từ enemy đến Core (danh sách ô, không bao gồm ô hiện tại). */
  enemyPath?: Point[];
  /** Chỉ số ô hiện tại trong enemyPath đã đi tới. */
  enemyPathIndex?: number;
  /** Thời điểm tấn công lần cuối (giây, dùng để đếm ngược ENEMY_ATTACK_INTERVAL). */
  enemyLastAttackTime?: number;
  /** ID của spawn node mà enemy xuất từ đó (chỉ enemy). */
  enemySpawnNodeId?: number;
};

/**
 * Một vật phẩm đang nằm trên một ô băng chuyền.
 * progress 0 = vừa vào đầu sau, 1 = tới đầu ra; nhiều vật phẩm có thể cùng nằm trên một ô,
 * cách nhau ít nhất CONVEYOR_ITEM_SPACING (giống Mindustry). Vật phẩm luôn chạy thẳng trên
 * đường tâm của băng (không lệch ngang).
 */
export type ConveyorItem = {
  type: ItemType;
  /** Tiến độ di chuyển dọc theo băng chuyền (0 → 1). */
  progress: number;
};

/**
 * Trạng thái vật phẩm trên băng chuyền: id băng chuyền → danh sách vật phẩm (sắp xếp tăng dần theo progress).
 * Không có khoá nghĩa là băng chuyền đang trống.
 */
export type ConveyorItems = Map<number, ConveyorItem[]>;

/** Bộ đếm sản xuất của máy đào: id máy đào → thời gian đã tích luỹ (giây). */
export type DrillAccumulators = Map<number, number>;

/** Kho tài nguyên nhà chính: loại vật phẩm → số lượng. */
export type CoreResources = Map<ItemType, number>;


/** Một điểm. Đơn vị tuỳ ngữ cảnh (ô hoặc pixel) — ghi rõ ở chỗ dùng. */
export type Point = {
  x: number;
  y: number;
};

/**
 * Các cú bấm chuột xảy ra từ khung hình trước (sự kiện "một lần", khác với Mouse là trạng thái đang giữ).
 * main đọc rồi gọi clearMouseClicks ở cuối mỗi khung hình.
 */
export type MouseClicks = {
  /** true nếu vừa thả chuột trái. */
  leftReleased: boolean;
  /**
   * Vị trí trên màn hình (pixel) và trạng thái Shift ĐÚNG LÚC thả chuột trái.
   * Dùng các giá trị này thay cho mouse.x / mouse.shiftDown, vì chuột có thể đã di chuyển tiếp trước khi khung hình chạy.
   */
  leftX: number;
  leftY: number;
  leftShift: boolean;
  /** true nếu vừa bấm chuột phải. */
  rightPressed: boolean;
  /** Vị trí trên màn hình lúc bấm chuột phải (pixel). */
  rightX: number;
  rightY: number;
  /** true nếu vừa bấm phím Esc (dùng để bỏ chọn công trình đang chọn trong menu xây dựng). */
  escapePressed: boolean;
  /**
   * Tổng số nấc lăn chuột trong khung hình (dương = lăn xuống, âm = lăn lên), dùng để xoay hướng
   * công trình sắp đặt. 0 nghĩa là không lăn.
   */
  rotateDelta: number;
};

/** Lệnh di chuyển đang chờ: id đơn vị → ô đích (toạ độ ô góc trên-trái, có thể là số lẻ). */
export type MoveOrders = Map<number, Point>;

/** Bố cục menu xây dựng, toạ độ màn hình (pixel). slots[i] là ô của loại công trình thứ i. */
export type BuildMenuLayout = {
  panel: Rect;
  slots: Rect[];
};

/**
 * Một công trình trong hàng chờ xây của drone. (x, y) là ô góc trên-trái.
 * entityId = null khi chưa bắt đầu xây (đang là bóng mờ); khi drone bắt đầu xây thì là id của công trình đang xây.
 */
export type BuildPlan = {
  type: EntityType;
  x: number;
  y: number;
  rotation: number;
  entityId: number | null;
};

/** Hàng chờ xây của từng drone: id drone → danh sách công trình theo thứ tự sẽ xây. */
export type BuildQueues = Map<number, BuildPlan[]>;

/**
 * Một bóng công trình cần vẽ (hàng chờ hoặc xem trước dưới con trỏ).
 * blockedTiles: các ô của bóng không xây được (vẽ ô đỏ lên). valid = blockedTiles rỗng.
 */
export type BuildGhost = {
  type: EntityType;
  x: number;
  y: number;
  rotation: number;
  valid: boolean;
  blockedTiles: Point[];
};

/** Kết quả huỷ một công trình trong hàng chờ. removedEntityId: id công trình đang xây dở bị xoá theo (nếu có). */
export type PlanCancelResult = {
  cancelled: boolean;
  removedEntityId: number | null;
};

/**
 * Bố cục map hành lang, toạ độ tính bằng ô.
 * corridorLeft..corridorRight (tính cả hai đầu) là các cột không có tường.
 * ironLane, copperLane: vùng quặng. core, drone: ô góc trên-trái lúc bắt đầu.
 */
export type LaneLayout = {
  corridorLeft: number;
  corridorRight: number;
  ironLane: Rect;
  copperLane: Rect;
  core: Point;
  drone: Point;
};
