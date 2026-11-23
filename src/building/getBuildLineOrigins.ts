import type { Point } from '../types';

/**
 * Tạo một hàng vị trí công trình từ điểm bắt đầu tới điểm kết thúc, dọc theo trục kéo dài hơn
 * (giữ Shift kéo chuột, giống Mindustry). Hàng chỉ nằm ngang hoặc dọc, không chéo.
 * @param start Ô góc trên-trái của công trình đầu tiên (nơi bắt đầu kéo).
 * @param end Ô góc trên-trái ứng với vị trí chuột hiện tại.
 * @param step Khoảng cách giữa 2 công trình liền nhau (số ô) — bằng kích thước công trình để không chồng nhau.
 * @returns Danh sách ô góc trên-trái, theo thứ tự từ start đi ra. Luôn có ít nhất start.
 */
export function getBuildLineOrigins(start: Point, end: Point, step: number): Point[] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const distance = horizontal ? Math.abs(dx) : Math.abs(dy);
  const direction = Math.sign(horizontal ? dx : dy);
  const count = Math.floor(distance / step);

  const origins: Point[] = [];
  for (let i = 0; i <= count; i++) {
    const offset = i * step * direction;
    origins.push(horizontal ? { x: start.x + offset, y: start.y } : { x: start.x, y: start.y + offset });
  }
  return origins;
}
