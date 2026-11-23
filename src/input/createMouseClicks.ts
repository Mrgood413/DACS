import type { MouseClicks } from '../types';

/**
 * Ghi lại các cú bấm "một lần": vừa thả chuột trái (kèm vị trí và Shift lúc thả), vừa bấm chuột phải (kèm vị trí),
 * vừa bấm phím Esc, vừa bấm phím R (chữ thường hay hoa đều được).
 * Các cờ chỉ được bật ở đây; main phải gọi clearMouseClicks ở cuối mỗi khung hình để tắt.
 * @param target Nơi nghe sự kiện chuột (chạy game: window; test: new EventTarget()).
 * @returns Một object MouseClicks duy nhất, được các sự kiện chuột sửa trực tiếp.
 */
export function createMouseClicks(target: EventTarget): MouseClicks {
  const clicks: MouseClicks = {
    leftReleased: false,
    leftX: 0,
    leftY: 0,
    leftShift: false,
    rightPressed: false,
    rightX: 0,
    rightY: 0,
    escapePressed: false,
    rotatePressed: false,
  };

  target.addEventListener('keydown', (event) => {
    const key = (event as KeyboardEvent).key;
    if (key === 'Escape') {
      clicks.escapePressed = true;
    }
    if (key === 'r' || key === 'R') {
      clicks.rotatePressed = true;
    }
  });

  target.addEventListener('mouseup', (event) => {
    const e = event as MouseEvent;
    if (e.button === 0) {
      clicks.leftReleased = true;
      clicks.leftX = e.clientX;
      clicks.leftY = e.clientY;
      clicks.leftShift = e.shiftKey === true;
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
