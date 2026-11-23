import { TERRAIN_COPPER_ORE, TERRAIN_IRON_ORE } from '../config';

/** Các loại địa hình là quặng. */
const ORE_TERRAIN = new Set<number>([TERRAIN_IRON_ORE, TERRAIN_COPPER_ORE]);

/**
 * Cho biết một loại địa hình có phải quặng không.
 * @param terrainId Mã địa hình (TERRAIN_*).
 * @returns true với quặng sắt và quặng đồng.
 */
export function isOreTerrain(terrainId: number): boolean {
  return ORE_TERRAIN.has(terrainId);
}
