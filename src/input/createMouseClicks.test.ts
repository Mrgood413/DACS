import { describe, expect, it } from 'vitest';
import { createMouseClicks } from './createMouseClicks';

function mouseEvent(type: string, props: Record<string, unknown> = {}): Event {
  return Object.assign(new Event(type, { cancelable: true }), props);
}

describe('createMouseClicks', () => {
  it('mới tạo → chưa có cú bấm nào', () => {
    expect(createMouseClicks(new EventTarget())).toEqual({
      leftReleased: false,
      leftX: 0,
      leftY: 0,
      leftShift: false,
      rightPressed: false,
      rightX: 0,
      rightY: 0,
      escapePressed: false,
      rotateDelta: 0,
    });
  });

  it('lăn chuột xuống → rotateDelta +1; lăn lên → rotateDelta -1; cộng dồn trong khung hình', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('wheel', { deltaY: 100 }));
    expect(clicks.rotateDelta).toBe(1);
    target.dispatchEvent(mouseEvent('wheel', { deltaY: 100 }));
    expect(clicks.rotateDelta).toBe(2);
    target.dispatchEvent(mouseEvent('wheel', { deltaY: -100 }));
    expect(clicks.rotateDelta).toBe(1);
  });

  it('lăn chuột với deltaY = 0 → không đổi rotateDelta', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('wheel', { deltaY: 0 }));
    expect(clicks.rotateDelta).toBe(0);
  });

  it('bấm Esc → escapePressed = true; phím khác thì không', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('keydown', { key: 'a' }));
    expect(clicks.escapePressed).toBe(false);
    target.dispatchEvent(mouseEvent('keydown', { key: 'Escape' }));
    expect(clicks.escapePressed).toBe(true);
  });

  it('thả chuột trái → leftReleased = true, lưu vị trí và Shift đúng lúc thả', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('mouseup', { button: 0, clientX: 120, clientY: 45, shiftKey: true }));
    expect(clicks.leftReleased).toBe(true);
    expect(clicks.leftX).toBe(120);
    expect(clicks.leftY).toBe(45);
    expect(clicks.leftShift).toBe(true);
  });

  it('di chuột sau khi thả không làm đổi vị trí đã lưu lúc thả', () => {
    const target = new EventTarget();
    const clicks = createMouseClicks(target);
    target.dispatchEvent(mouseEvent('mouseup', { button: 0, clientX: 120, clientY: 45, shiftKey: true }));
    target.dispatchEvent(mouseEvent('mousemove', { clientX: 500, clientY: 500, shiftKey: false }));
    expect(clicks.leftX).toBe(120);
    expect(clicks.leftShift).toBe(true);
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
