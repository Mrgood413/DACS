import type { Mouse } from '../types';

/**
 * Theo dõi vị trí chuột, chuột có trong cửa sổ không, và việc giữ chuột phải.
 * @param target Nơi nghe sự kiện chuột (chạy game: window; test: new EventTarget()).
 * @returns Một object Mouse duy nhất, được các sự kiện chuột sửa trực tiếp.
 */
export function createMouse(target: EventTarget): Mouse {
  const mouse: Mouse = { x: 0, y: 0, inside: false, rightDown: false, dragStartX: 0, dragStartY: 0 };

  target.addEventListener('mousemove', (event) => {
    const e = event as MouseEvent;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.inside = true;
  });

  target.addEventListener('mousedown', (event) => {
    const e = event as MouseEvent;
    if (e.button === 2) {
      mouse.rightDown = true;
      mouse.dragStartX = e.clientX;
      mouse.dragStartY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  });

  target.addEventListener('mouseup', (event) => {
    const e = event as MouseEvent;
    if (e.button === 2) {
      mouse.rightDown = false;
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
  });

  target.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  return mouse;
}
