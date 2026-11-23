import { describe, expect, it } from 'vitest';
import { createMouse } from './createMouse';

function mouseEvent(type: string, props: Record<string, unknown> = {}): Event {
  return Object.assign(new Event(type, { cancelable: true }), props);
}

describe('createMouse', () => {
  it('mới tạo → inside = false, leftDown = false, rightDown = false', () => {
    const mouse = createMouse(new EventTarget());
    expect(mouse.inside).toBe(false);
    expect(mouse.leftDown).toBe(false);
    expect(mouse.rightDown).toBe(false);
  });

  it('mousemove → lưu toạ độ và inside = true', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousemove', { clientX: 120, clientY: 80 }));
    expect(mouse.x).toBe(120);
    expect(mouse.y).toBe(80);
    expect(mouse.inside).toBe(true);
  });

  it('mousedown chuột trái → leftDown + lưu điểm bắt đầu kéo; mouseup chuột trái → leftDown = false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousedown', { button: 0, clientX: 50, clientY: 60 }));
    expect(mouse.leftDown).toBe(true);
    expect(mouse.dragStartX).toBe(50);
    expect(mouse.dragStartY).toBe(60);
    expect(mouse.x).toBe(50);
    expect(mouse.y).toBe(60);
    target.dispatchEvent(mouseEvent('mouseup', { button: 0 }));
    expect(mouse.leftDown).toBe(false);
  });

  it('mousedown chuột phải → rightDown = true nhưng leftDown vẫn false (không chọn vùng bằng chuột phải); mouseup chuột phải → rightDown = false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousedown', { button: 2, clientX: 10, clientY: 20 }));
    expect(mouse.rightDown).toBe(true);
    expect(mouse.leftDown).toBe(false);
    expect(mouse.dragStartX).toBe(0);
    expect(mouse.dragStartY).toBe(0);
    target.dispatchEvent(mouseEvent('mouseup', { button: 2 }));
    expect(mouse.rightDown).toBe(false);
  });

  it('mouseout có relatedTarget thì vẫn inside; relatedTarget = null thì inside = false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    target.dispatchEvent(mouseEvent('mouseout', { relatedTarget: {} }));
    expect(mouse.inside).toBe(true);
    target.dispatchEvent(mouseEvent('mouseout', { relatedTarget: null }));
    expect(mouse.inside).toBe(false);
  });

  it('blur → inside = false, rightDown = false, leftDown = false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    target.dispatchEvent(mouseEvent('mousedown', { button: 0, clientX: 1, clientY: 1 }));
    target.dispatchEvent(mouseEvent('mousedown', { button: 2, clientX: 1, clientY: 1 }));
    target.dispatchEvent(mouseEvent('blur'));
    expect(mouse.inside).toBe(false);
    expect(mouse.rightDown).toBe(false);
    expect(mouse.leftDown).toBe(false);
  });

  it('Shift: theo phím Shift (keydown/keyup) và theo shiftKey của sự kiện chuột; blur thì về false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    expect(mouse.shiftDown).toBe(false);
    target.dispatchEvent(mouseEvent('keydown', { key: 'Shift' }));
    expect(mouse.shiftDown).toBe(true);
    target.dispatchEvent(mouseEvent('keyup', { key: 'Shift' }));
    expect(mouse.shiftDown).toBe(false);
    target.dispatchEvent(mouseEvent('mousedown', { button: 0, clientX: 1, clientY: 1, shiftKey: true }));
    expect(mouse.shiftDown).toBe(true);
    target.dispatchEvent(mouseEvent('blur'));
    expect(mouse.shiftDown).toBe(false);
  });

  it('phím khác Shift không đổi shiftDown', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('keydown', { key: 'a' }));
    expect(mouse.shiftDown).toBe(false);
  });

  it('contextmenu bị preventDefault', () => {
    const target = new EventTarget();
    createMouse(target);
    const e = mouseEvent('contextmenu');
    target.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });
});
