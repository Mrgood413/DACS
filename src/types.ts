/** Dữ liệu map dạng lưới. Ô (x, y) nằm ở tiles[y * width + x]. */
export type GameMap = {
  width: number;
  height: number;
  tiles: Uint8Array;
};

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
};

/** Vị trí đặt thực thể demo trên map (dùng khi ghép vị trí với danh sách thực thể). */
export type EntityPosition = {
  type: EntityType;
  x: number;
  y: number;
  rotation: number;
};

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
  /** true nếu vừa bấm chuột phải. */
  rightPressed: boolean;
  /** Vị trí trên màn hình lúc bấm chuột phải (pixel). */
  rightX: number;
  rightY: number;
};

/** Lệnh di chuyển đang chờ: id đơn vị → ô đích (toạ độ ô góc trên-trái, có thể là số lẻ). */
export type MoveOrders = Map<number, Point>;
