import { describe, expect, it } from 'vitest';
import { Text } from 'pixi.js';
import { ITEM_COPPER, ITEM_IRON } from '../config';
import type { CoreResources } from '../types';
import { createResourceCounter } from './createResourceCounter';

function findTexts(container: ReturnType<typeof createResourceCounter>['container']): Text[] {
  return container.children.filter((child): child is Text => child instanceof Text);
}

function findIcons(container: ReturnType<typeof createResourceCounter>['container']) {
  return container.children.filter((child) => child.constructor.name === 'Graphics');
}

describe('createResourceCounter', () => {
  it('neo HUD ở trên cùng màn hình (giữa ngang), hiện icon + số đồng/sắt từ kho', () => {
    const hud = createResourceCounter();
    const resources: CoreResources = new Map([
      [ITEM_COPPER, 3],
      [ITEM_IRON, 5],
    ]);

    hud.update(resources, 800, 600);

    const texts = findTexts(hud.container);
    expect(texts).toHaveLength(2);
    expect(texts[0].text).toBe('3');
    expect(texts[1].text).toBe('5');

    const icons = findIcons(hud.container);
    expect(icons).toHaveLength(2);

    // Căn giữa trên cùng.
    const firstText = texts[0];
    expect(firstText.position.y).toBeLessThan(40);
  });

  it('kho rỗng thì hiện 0, đổi số liệu thì đổi nội dung', () => {
    const hud = createResourceCounter();
    hud.update(new Map(), 800, 600);
    const texts = findTexts(hud.container);
    expect(texts[0].text).toBe('0');
    expect(texts[1].text).toBe('0');

    hud.update(new Map([[ITEM_COPPER, 7]]), 800, 600);
    expect(findTexts(hud.container)[0].text).toBe('7');
  });

  it('đổi kích thước màn hình thì HUD dời theo chiều ngang, vẫn sát mép trên', () => {
    const hud = createResourceCounter();
    hud.update(new Map(), 800, 600);
    hud.update(new Map(), 1200, 400);
    const texts = findTexts(hud.container);
    expect(texts[0].position.y).toBeLessThan(40);
  });
});
