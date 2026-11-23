/** Số ô theo chiều ngang của map. */
export const MAP_WIDTH = 100;
/** Số ô theo chiều dọc của map. */
export const MAP_HEIGHT = 100;
/** Kích thước một ô, tính bằng pixel. */
export const TILE_SIZE = 32;

/**
 * Bố cục map: hai bên trái/phải phủ kín tường đá, giữa là hành lang cỏ không có tường.
 * Đáy hành lang có 2 làn quặng đối diện nhau (sắt bên trái, đồng bên phải); phía trên làn quặng là nhà chính và drone.
 */
/** Bề rộng hành lang không có tường ở giữa map (số ô). */
export const CORRIDOR_WIDTH = 24;
/** Làn quặng: bề rộng và chiều dài (số ô). */
export const ORE_LANE_WIDTH = 3;
export const ORE_LANE_LENGTH = 14;
/** Khoảng cách từ làn quặng tới tường hai bên hành lang (số ô). */
export const ORE_LANE_WALL_GAP = 2;
/** Khoảng cách từ đáy làn quặng tới mép dưới map (số ô). */
export const ORE_LANE_BOTTOM_MARGIN = 4;
/** Khoảng cách từ đỉnh làn quặng lên tới đáy nhà chính (số ô). */
export const CORE_GAP_ABOVE_LANES = 4;
/** Khoảng cách từ đỉnh nhà chính lên tới drone (số ô). */
export const DRONE_GAP_ABOVE_CORE = 2;

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

/** Màu hộp chọn khi giữ chuột trái kéo. */
export const SELECTION_COLOR = 0x6ecdff;
/** Độ trong suốt phần tô bên trong hộp chọn (0 = trong suốt hẳn, 1 = đặc). */
export const SELECTION_FILL_ALPHA = 0.15;

/** Ngưỡng (pixel): kéo xa hơn mức này tính là kéo chọn, chưa tới mức này tính là click. */
export const SELECTION_DRAG_THRESHOLD = 5;

/** Màu khung đánh dấu đơn vị đang được chọn. */
export const UNIT_SELECTED_COLOR = 0x7cff6b;
/** Tốc độ bay của drone (ô mỗi giây). */
export const DRONE_SPEED = 6;

/** Số pixel của ảnh gốc ứng với 1 ô (ảnh lấy từ Mindustry: 1 ô = 8 px). Dùng khi vẽ ảnh giữ đúng tỉ lệ gốc. */
export const SOURCE_PIXELS_PER_TILE = 8;

/** Menu xây dựng (góc dưới-phải, hiện khi đang chọn drone) — bố cục giống Mindustry: 4 ô mỗi hàng. */
export const BUILD_MENU_COLUMNS = 4;
/** Cạnh một ô biểu tượng trong menu (pixel). */
export const BUILD_MENU_SLOT_SIZE = 48;
/** Khoảng cách giữa các ô (pixel). */
export const BUILD_MENU_GAP = 4;
/** Khoảng đệm từ viền khung tới các ô (pixel). */
export const BUILD_MENU_PADDING = 6;
/** Khoảng cách từ khung menu tới mép phải và mép dưới màn hình (pixel). */
export const BUILD_MENU_MARGIN = 10;
/** Màu nền khung menu và độ đục của nó. */
export const BUILD_MENU_BACKGROUND_COLOR = 0x1b1c21;
export const BUILD_MENU_BACKGROUND_ALPHA = 0.9;
/** Màu nền mỗi ô. */
export const BUILD_MENU_SLOT_COLOR = 0x2c2f37;
/** Màu viền ô đang được chọn (vàng nhấn của Mindustry). */
export const BUILD_MENU_SELECTED_COLOR = 0xffd37f;

/** Máu tối đa của mọi thực thể (hiện tại mọi công trình đều 100). */
export const DEFAULT_MAX_HP = 100;
/** Thời gian xây một công trình từ 0 tới đầy máu (giây). */
export const BUILD_TIME_SECONDS = 10;

/** Độ mờ của công trình đang chờ xây (bóng trong hàng chờ). */
export const BUILD_PLAN_ALPHA = 0.35;
/** Độ mờ của bóng xem trước dưới con trỏ khi đang chọn công trình để xây. */
export const BUILD_PREVIEW_ALPHA = 0.55;
/** Ô đỏ vẽ lên những ô (dưới bóng công trình đang định đặt) không xây được. */
export const UNBUILDABLE_TILE_COLOR = 0xff3b3b;
export const UNBUILDABLE_TILE_ALPHA = 0.5;
/** Tầm xây của drone (số ô, tính từ tâm drone tới tâm công trình). Xa hơn thì drone bay lại gần. */
export const BUILD_RANGE = 5;
/** Độ mờ thấp nhất của công trình đang xây (lúc 0 máu); đầy máu thì rõ hẳn. */
export const CONSTRUCTION_MIN_ALPHA = 0.4;

/** Thanh máu: cao (pixel), khoảng cách dưới đáy công trình (pixel), màu nền và màu máu. */
export const HEALTH_BAR_HEIGHT = 4;
export const HEALTH_BAR_OFFSET = 2;
export const HEALTH_BAR_BACKGROUND_COLOR = 0x2b2b2b;
export const HEALTH_BAR_COLOR = 0x6ee06e;
/** Công trình đã xây xong chỉ hiện thanh máu khi chuột cách tâm của nó trong bán kính này (số ô). */
export const HEALTH_BAR_HOVER_RADIUS = 3;

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
