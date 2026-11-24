/**
 * Tính hướng đi từ ô (fromX, fromY) tới ô kề (toX, toY).
 * Mã hướng dùng chung với Entity.rotation: 0 = lên, 1 = phải, 2 = xuống, 3 = trái;
 * hai ô phải kề nhau theo 4 hướng (không tính chéo).
 * @returns Mã hướng 0–3 (0 = lên, 1 = phải, 2 = xuống, 3 = trái), hoặc -1 nếu hai ô không kề theo 4 hướng.
 */
export function getDirectionBetween(fromX: number, fromY: number, toX: number, toY: number): number {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (dx === 1 && dy === 0) {
    return 1;
  }
  if (dx === -1 && dy === 0) {
    return 3;
  }
  if (dx === 0 && dy === 1) {
    return 2;
  }
  if (dx === 0 && dy === -1) {
    return 0;
  }
  return -1;
}
