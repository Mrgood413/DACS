import { Application } from 'pixi.js';
import { BACKGROUND_COLOR } from '../config';

/**
 * Tạo khung vẽ PixiJS phủ kín cửa sổ trình duyệt.
 * @returns Application của PixiJS đã khởi tạo xong.
 */
export async function createApp(): Promise<Application> {
  const app = new Application();
  await app.init({ background: BACKGROUND_COLOR, resizeTo: window, antialias: false });
  document.body.appendChild(app.canvas);
  return app;
}
