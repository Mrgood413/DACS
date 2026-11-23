import type { Mouse } from '../types';

/**
 * Theo dõi vị trí chuột, chuột có trong cửa sổ không, giữ chuột trái (kéo chọn), giữ chuột phải và giữ phím Shift.
 * Shift được cập nhật từ cả sự kiện chuột (event.shiftKey) lẫn sự kiện bàn phím (phím 'Shift').
 * @param target Nơi nghe sự kiện chuột và bàn phím (chạy game: window; test: new EventTarget()).
 * @returns Một object Mouse duy nhất, được các sự kiện sửa trực tiếp.
 */
export function createMouse(target: EventTarget): Mouse {
  const mouse: Mouse = {
    x: 0,
    y: 0,
    inside: false,
    rightDown: false,
    leftDown: false,
    dragStartX: 0,
    dragStartY: 0,
    shiftDown: false,
  };

  target.addEventListener('mousemove', (event) => {
    const e = event as MouseEvent;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.inside = true;
    mouse.shiftDown = e.shiftKey === true;
  });

  target.addEventListener('mousedown', (event) => {
    const e = event as MouseEvent;
    mouse.shiftDown = e.shiftKey === true;
    if (e.button === 0) {
      mouse.leftDown = true;
      mouse.dragStartX = e.clientX;
      mouse.dragStartY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    if (e.button === 2) {
      mouse.rightDown = true;
    }
  });

  target.addEventListener('mouseup', (event) => {
    const e = event as MouseEvent;
    mouse.shiftDown = e.shiftKey === true;
    if (e.button === 0) {
      mouse.leftDown = false;
    }
    if (e.button === 2) {
      mouse.rightDown = false;
    }
  });

  target.addEventListener('keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Shift') {
      mouse.shiftDown = true;
    }
  });

  target.addEventListener('keyup', (event) => {
    if ((event as KeyboardEvent).key === 'Shift') {
      mouse.shiftDown = false;
    }
  });

  target.addEventListener('mouseout', (event) => {
    const e = event as MouseEvent;
    if (e.relatedTarget === null) {
      mouse.inside = false;
    }
  });

  target.addEventListener('blur', () => {
    mouse.inside = false;
    mouse.rightDown = false;
    mouse.leftDown = false;
    mouse.shiftDown = false;
  });

  target.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  return mouse;
}
