import { describe, expect, it } from 'vitest';
import { Text } from 'pixi.js';
import { ITEM_COPPER, ITEM_IRON } from '../config';
import type { CoreResources } from '../types';
import { createResourceCounter } from './createResourceCounter';

function findText(container: ReturnType<typeof createResourceCounter>['container']): Text {
  const text = container.children.find((child): child is Text => child instanceof Text);
  if (text === undefined) {
    throw new Error('HUD phải chứa một Text');
  }
  return text;
}

describe('createResourceCounter', () => {
  it('neo HUD ở trên cùng màn hình (giữa ngang), hiện số đồng/sắt từ kho', () => {
    const hud = createResourceCounter();
    const resources: CoreResources = new Map([
      [ITEM_COPPER, 3],
      [ITEM_IRON, 5],
    ]);

    hud.update(resources, 800, 600);

    const text = findText(hud.container);
    expect(text.position.x).toBe(400);
    expect(text.position.y).toBeLessThan(40);
    expect(text.anchor.x).toBe(0.5);
    expect(text.anchor.y).toBe(0);
    expect(text.text).toContain('3');
    expect(text.text).toContain('5');
  });

  it('kho rỗng thì hiện 0, đổi số liệu thì đổi nội dung', () => {
    const hud = createResourceCounter();
    hud.update(new Map(), 800, 600);
    const first = findText(hud.container).text;
    expect(first).toContain('0');

    hud.update(new Map([[ITEM_COPPER, 7]]), 800, 600);
    expect(findText(hud.container).text).not.toBe(first);
    expect(findText(hud.container).text).toContain('7');
  });

  it('đổi kích thước màn hình thì HUD dời theo chiều ngang, vẫn sát mép trên', () => {
    const hud = createResourceCounter();
    hud.update(new Map(), 800, 600);
    hud.update(new Map(), 1200, 400);
    const text = findText(hud.container);
    expect(text.position.x).toBe(600);
    expect(text.position.y).toBeLessThan(40);
  });
});
