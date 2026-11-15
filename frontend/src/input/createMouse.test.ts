import { describe, expect, it } from 'vitest';
import { createMouse } from './createMouse';

function mouseEvent(type: string, props: Record<string, unknown> = {}): Event {
  return Object.assign(new Event(type, { cancelable: true }), props);
}

describe('createMouse', () => {
  it('mới tạo → inside = false, rightDown = false', () => {
    const mouse = createMouse(new EventTarget());
    expect(mouse.inside).toBe(false);
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

  it('mousedown chuột phải → rightDown + lưu điểm bắt đầu; mouseup chuột phải → rightDown = false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousedown', { button: 2, clientX: 50, clientY: 60 }));
    expect(mouse.rightDown).toBe(true);
    expect(mouse.dragStartX).toBe(50);
    expect(mouse.dragStartY).toBe(60);
    target.dispatchEvent(mouseEvent('mouseup', { button: 2 }));
    expect(mouse.rightDown).toBe(false);
  });

  it('mousedown chuột trái → rightDown vẫn false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousedown', { button: 0, clientX: 50, clientY: 60 }));
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

  it('blur → inside = false, rightDown = false', () => {
    const target = new EventTarget();
    const mouse = createMouse(target);
    target.dispatchEvent(mouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    target.dispatchEvent(mouseEvent('mousedown', { button: 2, clientX: 1, clientY: 1 }));
    target.dispatchEvent(mouseEvent('blur'));
    expect(mouse.inside).toBe(false);
    expect(mouse.rightDown).toBe(false);
  });

  it('contextmenu bị preventDefault', () => {
    const target = new EventTarget();
    createMouse(target);
    const e = mouseEvent('contextmenu');
    target.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });
});
