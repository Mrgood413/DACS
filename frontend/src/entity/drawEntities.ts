import { Container } from 'pixi.js';
import { TILE_SIZE } from '../config';
import type { Entity } from '../types';
import { drawEntity } from './drawEntity';

/**
 * Vẽ toàn bộ thực thể lên một lớp riêng, đặt đúng toạ độ thế giới (ô × TILE_SIZE).
 * @param entities Danh sách thực thể.
 * @returns Container chứa tất cả thực thể, mỗi thực thể là một con.
 */
export function drawEntities(entities: Entity[]): Container {
  const container = new Container();
  for (const entity of entities) {
    const view = drawEntity(entity);
    view.position.set(entity.x * TILE_SIZE, entity.y * TILE_SIZE);
    container.addChild(view);
  }
  return container;
}
