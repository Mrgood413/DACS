import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Wave, WaveRuntime } from '../spawn/types';
import type { SpawnGroupRuntime } from '../spawn/types';

const WAVE_HUD_BG_COLOR = 0x000000;
const WAVE_HUD_BG_ALPHA = 0.7;
const WAVE_HUD_TEXT_COLOR = 0xffd37f;
const WAVE_HUD_BORDER_COLOR = 0xffd37f;

/** Kích thước hộp wave theo Rectangle 9 trong code.html (tham khảo): 292 × 53 px. */
const WAVE_HUD_WIDTH = 292;
const WAVE_HUD_HEIGHT = 53;
const WAVE_HUD_PADDING = 12;

/** Vị trí HUD Wave: góc trên-PHAI màn hình (cạnh map, không chồng minimap ở trên-trái). */
const WAVE_HUD_Y = 10;
const WAVE_HUD_MARGIN_RIGHT = 10;

export function createWaveHUD(screenWidth: number): Container {
  const container = new Container();
  container.position.set(screenWidth - WAVE_HUD_WIDTH - WAVE_HUD_MARGIN_RIGHT, WAVE_HUD_Y);

  const bg = new Graphics();
  bg.rect(0, 0, WAVE_HUD_WIDTH, WAVE_HUD_HEIGHT).fill(WAVE_HUD_BG_COLOR, WAVE_HUD_BG_ALPHA);
  bg.rect(0, 0, WAVE_HUD_WIDTH, WAVE_HUD_HEIGHT).stroke({ width: 2, color: WAVE_HUD_BORDER_COLOR });
  container.addChild(bg);

  const style = new TextStyle({
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
    fill: WAVE_HUD_TEXT_COLOR,
    stroke: 0x000000,
    strokeThickness: 3,
  } as any);

  const waveText = new Text('', style);
  waveText.position.set(WAVE_HUD_PADDING, WAVE_HUD_PADDING);
  container.addChild(waveText);

  const timerText = new Text('', style);
  timerText.position.set(WAVE_HUD_PADDING, WAVE_HUD_PADDING + 22);
  container.addChild(timerText);

  const ref = container as Container & {
    _waveText: Text;
    _timerText: Text;
  };
  ref._waveText = waveText;
  ref._timerText = timerText;

  return container;
}

export function updateWaveHUD(
  hud: Container,
  waveTemplate: Wave | null,
  waveRuntime: WaveRuntime | null,
  currentWaveIndex: number,
  totalWaves: number,
): void {
  const ref = hud as Container & {
    _waveText: Text;
    _timerText: Text;
  };

  if (!waveTemplate || !waveRuntime) {
    ref._waveText.text = 'Wave: --';
    ref._timerText.text = 'Time: --:--';
    return;
  }

  ref._waveText.text = `Wave: ${currentWaveIndex + 1}/${totalWaves}`;

  let timerText = 'Time: --:--';

  if (waveRuntime.waitingBeforeFirstWave) {
    const remaining = Math.ceil(waveTemplate.preWaveDelaySeconds - waveRuntime.preWaveAccumulator);
    const displaySeconds = Math.max(0, remaining);
    const minutes = Math.floor(displaySeconds / 60);
    const secs = displaySeconds % 60;
    timerText = `Bắt đầu sau: ${minutes}:${secs.toString().padStart(2, '0')}`;
  } else if (waveRuntime.waitingBetweenGroups) {
    const remaining = Math.ceil(2 - waveRuntime.interGroupAccumulator);
    const displaySeconds = Math.max(0, remaining);
    timerText = `Group tiếp: ${displaySeconds}s`;
  } else if (!waveRuntime.completed) {
    const totalSeconds = waveTemplate.interWaveIntervalSeconds - waveRuntime.interWaveAccumulator;
    const displaySeconds = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(displaySeconds / 60);
    const secs = displaySeconds % 60;
    timerText = `Thời gian wave: ${minutes}:${secs.toString().padStart(2, '0')}`;
  } else {
    timerText = 'Wave hoàn thành';
  }

  ref._timerText.text = timerText;
}
