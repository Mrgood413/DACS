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
  /** Vị trí lúc bắt đầu giữ chuột phải. */
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
