import type { Rect } from '../types';

/**
 * Tạo hình chữ nhật từ điểm bắt đầu kéo và điểm chuột hiện tại, đúng với mọi hướng kéo.
 * @param startX Toạ độ x lúc bắt đầu giữ chuột phải (pixel màn hình).
 * @param startY Toạ độ y lúc bắt đầu giữ chuột phải (pixel màn hình).
 * @param endX Toạ độ x hiện tại của chuột (pixel màn hình).
 * @param endY Toạ độ y hiện tại của chuột (pixel màn hình).
 * @returns Rect với x, y là góc trên-trái và width, height luôn không âm.
 */
export function getSelectionRect(startX: number, startY: number, endX: number, endY: number): Rect {
  return {
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
  };
}
