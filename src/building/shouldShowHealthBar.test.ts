import { describe, expect, it } from 'vitest';
import { BUILDING_IRON_WALL, UNIT_DRONE } from '../config';
import { createConstructionSite } from '../entity/createConstructionSite';
import { createEntity } from '../entity/createEntity';
import { shouldShowHealthBar } from './shouldShowHealthBar';

// Tường 1×1 ở ô (10, 10) → tâm ở pixel (336, 336). Bán kính hover 3 ô = 96 px.
const wall = createEntity(BUILDING_IRON_WALL, 10, 10);

describe('shouldShowHealthBar', () => {
  it('công trình đang xây → luôn hiện, kể cả chuột ở xa hoặc ngoài map', () => {
    const site = createConstructionSite(1, BUILDING_IRON_WALL, 10, 10);
    expect(shouldShowHealthBar(site, null)).toBe(true);
    expect(shouldShowHealthBar(site, { x: 0, y: 0 })).toBe(true);
  });

  it('đã xây xong, chuột cách tâm 90 px (< 3 ô) → hiện', () => {
    expect(shouldShowHealthBar(wall, { x: 336 + 90, y: 336 })).toBe(true);
  });

  it('đã xây xong, chuột cách tâm đúng 3 ô (96 px) → vẫn hiện', () => {
    expect(shouldShowHealthBar(wall, { x: 336, y: 336 + 96 })).toBe(true);
  });

  it('đã xây xong, chuột ở xa hơn 3 ô → ẩn', () => {
    expect(shouldShowHealthBar(wall, { x: 336 + 100, y: 336 })).toBe(false);
  });

  it('đã xây xong, chuột không ở trên map → ẩn', () => {
    expect(shouldShowHealthBar(wall, null)).toBe(false);
  });

  it('đơn vị (drone) → không bao giờ hiện', () => {
    const drone = createEntity(UNIT_DRONE, 10, 10);
    expect(shouldShowHealthBar(drone, { x: 336, y: 336 })).toBe(false);
  });
});
