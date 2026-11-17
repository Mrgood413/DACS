import { Container } from 'pixi.js';
import type { Texture } from 'pixi.js';
import { TILE_SIZE } from '../config';
import type { Entity, EntityType } from '../types';
import { drawEntity } from './drawEntity';

/**
 * Vẽ toàn bộ thực thể lên một lớp riêng, đặt đúng toạ độ thế giới (ô × TILE_SIZE).
 * @param entities Danh sách thực thể.
 * @param getTexture Hàm tra texture theo loại thực thể (tuỳ chọn — có sprite asset thì vẽ sprite, không thì vẽ Graphics).
 * @returns Container chứa tất cả thực thể, mỗi thực thể là một con.
 */
export function drawEntities(entities: Entity[], getTexture?: (type: EntityType) => Texture | undefined): Container {
  const container = new Container();
  for (const entity of entities) {
    const view = drawEntity(entity, getTexture);
    view.position.set(entity.x * TILE_SIZE, entity.y * TILE_SIZE);
    container.addChild(view);
  }
  return container;
}
