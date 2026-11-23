import type { BuildGhost } from '../types';

/**
 * Tạo chuỗi đại diện cho một danh sách bóng, để biết danh sách có thay đổi không (chỉ vẽ lại khi khác).
 * Gồm cả các ô bị chặn, vì ô đỏ có thể đổi dù bóng đứng yên (ví dụ công trình bên cạnh vừa xây xong).
 * @param ghosts Danh sách bóng.
 * @returns Chuỗi; hai danh sách giống hệt nhau (cùng thứ tự) cho cùng chuỗi.
 */
export function getGhostsKey(ghosts: BuildGhost[]): string {
  return ghosts
    .map((ghost) => {
      const blocked = ghost.blockedTiles.map((tile) => `${tile.x}:${tile.y}`).join('/');
      return `${ghost.type},${ghost.x},${ghost.y},${ghost.rotation},${blocked}`;
    })
    .join(';');
}
