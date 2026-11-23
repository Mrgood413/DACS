import { describe, expect, it } from 'vitest';
import type { Mouse } from '../types';
import { getEdgeScrollDirection } from './getEdgeScrollDirection';

function fakeMouse(x: number, y: number, inside = true, leftDown = false): Mouse {
  return { x, y, inside, rightDown: false, leftDown, dragStartX: 0, dragStartY: 0, shiftDown: false };
}

const screenWidth = 800;
const screenHeight = 600;

describe('getEdgeScrollDirection', () => {
  it('chuột (400, 300) → đứng yên', () => {
    expect(getEdgeScrollDirection(fakeMouse(400, 300), screenWidth, screenHeight)).toEqual({ x: 0, y: 0 });
  });

  it('chuột (10, 300) → sang trái', () => {
    expect(getEdgeScrollDirection(fakeMouse(10, 300), screenWidth, screenHeight)).toEqual({ x: -1, y: 0 });
  });

  it('chuột (5, 5) → chéo trái-lên', () => {
    expect(getEdgeScrollDirection(fakeMouse(5, 5), screenWidth, screenHeight)).toEqual({ x: -1, y: -1 });
  });

  it('chuột (790, 590) → chéo phải-xuống', () => {
    expect(getEdgeScrollDirection(fakeMouse(790, 590), screenWidth, screenHeight)).toEqual({ x: 1, y: 1 });
  });

  it('chuột (24, 300) → đứng yên (đúng 24 thì không cuộn)', () => {
    expect(getEdgeScrollDirection(fakeMouse(24, 300), screenWidth, screenHeight)).toEqual({ x: 0, y: 0 });
  });

  it('chuột (776, 300) → sang phải (776 = 800 − 24 thì có cuộn)', () => {
    expect(getEdgeScrollDirection(fakeMouse(776, 300), screenWidth, screenHeight)).toEqual({ x: 1, y: 0 });
  });

  it('chuột (5, 5) nhưng inside = false → đứng yên', () => {
    expect(getEdgeScrollDirection(fakeMouse(5, 5, false), screenWidth, screenHeight)).toEqual({ x: 0, y: 0 });
  });

  it('chuột (5, 5) nhưng đang giữ chuột trái kéo chọn (leftDown = true) → đứng yên', () => {
    expect(getEdgeScrollDirection(fakeMouse(5, 5, true, true), screenWidth, screenHeight)).toEqual({ x: 0, y: 0 });
  });
});
