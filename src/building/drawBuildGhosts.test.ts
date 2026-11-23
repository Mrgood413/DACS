import { describe, expect, it } from 'vitest';
import { Container } from 'pixi.js';
import { BUILDING_DRILL, BUILDING_IRON_WALL, TILE_SIZE } from '../config';
import type { BuildGhost, Point } from '../types';
import { drawBuildGhosts } from './drawBuildGhosts';

const ghost = (x: number, blockedTiles: Point[] = []): BuildGhost => ({
  type: BUILDING_IRON_WALL,
  x,
  y: 2,
  rotation: 0,
  valid: blockedTiles.length === 0,
  blockedTiles,
});

describe('drawBuildGhosts', () => {
  it('mỗi bóng một hình, đúng vị trí, đúng độ mờ; không ô bị chặn thì không có lớp ô đỏ', () => {
    const container = new Container();
    drawBuildGhosts(container, [ghost(1), ghost(3)], 0.35);
    expect(container.children).toHaveLength(2);
    expect(container.children[1]?.x).toBe(3 * TILE_SIZE);
    expect(container.children[1]?.y).toBe(2 * TILE_SIZE);
    expect(container.children[0]?.alpha).toBe(0.35);
  });

  it('drill 2×2 chỉ bị chặn 1 ô → lớp đỏ ở trên cùng phủ đủ cả khối 2×2', () => {
    const container = new Container();
    const drill: BuildGhost = {
      type: BUILDING_DRILL,
      x: 4,
      y: 4,
      rotation: 0,
      valid: false,
      blockedTiles: [{ x: 5, y: 5 }],
    };
    drawBuildGhosts(container, [drill], 0.5);
    expect(container.children).toHaveLength(2);
    const marks = container.children[1];
    const bounds = marks?.getLocalBounds();
    expect(bounds?.x).toBe(4 * TILE_SIZE);
    expect(bounds?.y).toBe(4 * TILE_SIZE);
    expect(bounds?.width).toBe(2 * TILE_SIZE);
    expect(bounds?.height).toBe(2 * TILE_SIZE);
  });

  it('bóng ở toạ độ âm (ngoài map) vẫn vẽ được, không ném lỗi', () => {
    const container = new Container();
    expect(() => drawBuildGhosts(container, [ghost(-1, [{ x: -1, y: 2 }])], 0.5)).not.toThrow();
  });

  it('vẽ lại với danh sách rỗng → xoá hết bóng cũ', () => {
    const container = new Container();
    drawBuildGhosts(container, [ghost(1, [{ x: 1, y: 2 }])], 0.5);
    drawBuildGhosts(container, [], 0.5);
    expect(container.children).toHaveLength(0);
  });
});
