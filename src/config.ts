/** Số ô theo chiều ngang của map. */
export const MAP_WIDTH = 100;
/** Số ô theo chiều dọc của map. */
export const MAP_HEIGHT = 100;
/** Kích thước một ô, tính bằng pixel. */
export const TILE_SIZE = 32;

/** Mã loại ô: cỏ. */
export const TILE_GRASS = 1;
/** Màu của từng loại ô. */
export const TILE_COLORS: Record<number, number> = {
  [TILE_GRASS]: 0x5a9e3f,
};
/** Màu dùng cho loại ô không có trong TILE_COLORS (hồng tím để dễ nhận ra lỗi). */
export const UNKNOWN_TILE_COLOR = 0xff00ff;

/** Màu và độ dày đường lưới giữa các ô. */
export const GRID_LINE_COLOR = 0x4a8534;
export const GRID_LINE_WIDTH = 1;

/** Màu và độ dày đường viền quanh mép map. */
export const BORDER_COLOR = 0xffd37f;
export const BORDER_WIDTH = 4;

/** Màu nền bên ngoài map. */
export const BACKGROUND_COLOR = 0x161616;

/** Tốc độ camera, tính bằng pixel mỗi giây. */
export const CAMERA_SPEED = 600;

/** Khoảng cách (pixel) tính từ mép màn hình: chuột vào vùng này thì camera chạy về hướng mép đó. */
export const EDGE_SCROLL_MARGIN = 24;

/** Cạnh dài nhất của minimap (pixel). */
export const MINIMAP_SIZE = 200;
/** Khoảng cách từ minimap tới góc trên-trái màn hình (pixel). */
export const MINIMAP_MARGIN = 10;
/** Màu nền khung minimap. */
export const MINIMAP_BACKGROUND_COLOR = 0x000000;
/** Màu khung camera vẽ trên minimap. */
export const MINIMAP_CAMERA_COLOR = 0xffffff;

/** Màu hộp chọn khi giữ chuột phải kéo. */
export const SELECTION_COLOR = 0x6ecdff;
/** Độ trong suốt phần tô bên trong hộp chọn (0 = trong suốt hẳn, 1 = đặc). */
export const SELECTION_FILL_ALPHA = 0.15;

/** Ngưỡng (pixel): kéo xa hơn mức này tính là kéo chọn, chưa tới mức này tính là click. */
export const SELECTION_DRAG_THRESHOLD = 5;

/** Mã địa hình: cỏ. */
export const TERRAIN_GRASS = 1;
/** Mã địa hình: quặng sắt. */
export const TERRAIN_IRON_ORE = 2;
/** Mã địa hình: quặng đồng. */
export const TERRAIN_COPPER_ORE = 3;
/** Mã địa hình: cát. */
export const TERRAIN_SAND = 4;
/** Mã địa hình: nước. */
export const TERRAIN_WATER = 5;

/** Mã tường môi trường: không có tường. */
export const ENV_WALL_NONE = 0;
/** Mã tường môi trường: tường đá. */
export const ENV_WALL_STONE = 1;
/** Mã tường môi trường: tường cỏ. */
export const ENV_WALL_GRASS = 2;
/** Mã tường môi trường: tường bụi cây. */
export const ENV_WALL_BUSH = 3;

/** Mã thực thể: nhà chính (3×3). */
export const BUILDING_CORE = 1;
/** Mã thực thể: trụ súng (1×1). */
export const BUILDING_TURRET = 2;
/** Mã thực thể: trụ súng điện (1×1). */
export const BUILDING_ELECTRIC_TURRET = 3;
/** Mã thực thể: dàn khoan (2×2). */
export const BUILDING_DRILL = 4;
/** Mã thực thể: tường sắt (1×1). */
export const BUILDING_IRON_WALL = 5;
/** Mã thực thể: tường đồng (1×1). */
export const BUILDING_COPPER_WALL = 6;
/** Mã thực thể: băng rôn (1×1, có hướng). */
export const BUILDING_BANNER = 7;
/** Mã thực thể: drone của người chơi. */
export const UNIT_DRONE = 8;
/** Mã thực thể: bọ kẻ địch. */
export const UNIT_BUG = 9;
