import { describe, expect, it } from 'vitest';
import { ENV_WALL_BUSH, ENV_WALL_GRASS, ENV_WALL_NONE, ENV_WALL_STONE } from '../config';
import { getEnvironmentWallAppearance } from './getEnvironmentWallAppearance';

describe('getEnvironmentWallAppearance', () => {
  it('tường đá → shape stone, màu đá xám tối (artstyle)', () => {
    expect(getEnvironmentWallAppearance(ENV_WALL_STONE)).toEqual({ shape: 'stone', color: 0x3c434d });
  });

  it('tường cỏ → shape grass, màu rêu xanh (artstyle)', () => {
    expect(getEnvironmentWallAppearance(ENV_WALL_GRASS)).toEqual({ shape: 'grass', color: 0x4e7a33 });
  });

  it('tường bụi cây → shape bush, màu xanh lá (artstyle)', () => {
    expect(getEnvironmentWallAppearance(ENV_WALL_BUSH)).toEqual({ shape: 'bush', color: 0x5d8a3a });
  });

  it('NONE → null', () => {
    expect(getEnvironmentWallAppearance(ENV_WALL_NONE)).toBe(null);
  });

  it('ID không hợp lệ → null', () => {
    expect(getEnvironmentWallAppearance(4)).toBe(null);
    expect(getEnvironmentWallAppearance(99)).toBe(null);
    expect(getEnvironmentWallAppearance(-1)).toBe(null);
  });

  it('3 loại tường có màu riêng', () => {
    const colors = [
      getEnvironmentWallAppearance(ENV_WALL_STONE)?.color,
      getEnvironmentWallAppearance(ENV_WALL_GRASS)?.color,
      getEnvironmentWallAppearance(ENV_WALL_BUSH)?.color,
    ];
    expect(new Set(colors).size).toBe(3);
  });
});
