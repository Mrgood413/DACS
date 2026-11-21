import type { MouseClicks } from '../types';

/**
 * Ghi lại các cú bấm chuột "một lần": vừa thả chuột trái, vừa bấm chuột phải (kèm vị trí).
 * Các cờ chỉ được bật ở đây; main phải gọi clearMouseClicks ở cuối mỗi khung hình để tắt.
 * @param target Nơi nghe sự kiện chuột (chạy game: window; test: new EventTarget()).
 * @returns Một object MouseClicks duy nhất, được các sự kiện chuột sửa trực tiếp.
 */
export function createMouseClicks(target: EventTarget): MouseClicks {
  const clicks: MouseClicks = { leftReleased: false, rightPressed: false, rightX: 0, rightY: 0 };

  target.addEventListener('mouseup', (event) => {
    if ((event as MouseEvent).button === 0) {
      clicks.leftReleased = true;
    }
  });

  target.addEventListener('mousedown', (event) => {
    const e = event as MouseEvent;
    if (e.button === 2) {
      clicks.rightPressed = true;
      clicks.rightX = e.clientX;
      clicks.rightY = e.clientY;
    }
  });

  return clicks;
}
