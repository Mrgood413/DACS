import { describe, expect, it } from 'vitest';
import { createMouseClicks } from './createMouseClicks';

function mouseEvent(type: string, props: Record<string, unknown> = {}): Event {
  return Object.assign(new Event(type, { cancelable: true }), props);
}

describe('createMouseClicks', () => {
  it('mới tạo → chưa có cú bấm nào', () => {
    expect(createMouseClicks(new EventTarget())).toEqual({
      leftReleased: false,
      rightPressed: false,
      rightX: 0,
      rightY: 0,
    });
  });

  it('thả chuột trái → leftReleased = true', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('mouseup', { button: 0 }));
    expect(clicks.leftReleased).toBe(true);
  });

  it('thả chuột phải → leftReleased vẫn false', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('mouseup', { button: 2 }));
    expect(clicks.leftReleased).toBe(false);
  });

  it('bấm chuột phải → rightPressed = true và lưu vị trí bấm', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('mousedown', { button: 2, clientX: 300, clientY: 150 }));
    expect(clicks.rightPressed).toBe(true);
    expect(clicks.rightX).toBe(300);
    expect(clicks.rightY).toBe(150);
  });

  it('bấm chuột trái → rightPressed vẫn false', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('mousedown', { button: 0, clientX: 300, clientY: 150 }));
    expect(clicks.rightPressed).toBe(false);
  });
});
