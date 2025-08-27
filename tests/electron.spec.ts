import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';

test.describe('Electron smoke (TEST_MODE)', () => {
  test('start/stop and export IPC flows', async () => {
    const electronMain = path.resolve(__dirname, '..', 'src', 'main', 'main.js');
    const electronBin = require('electron');

    const env = { ...process.env, TEST_MODE: '1', ELECTRON_START_URL: '' };
    const proc = spawn(electronBin as unknown as string, ['.'], { env, stdio: 'pipe' });

    // Wait for harness to listen (retry up to 10s)
    const waitForPort = async () => {
      for (let i = 0; i < 20; i++) {
        try {
          await new Promise<void>((resolve, reject) => {
            const req = http.request({ hostname: '127.0.0.1', port: 3123, path: '/', method: 'GET' }, () => resolve());
            req.on('error', reject); req.end();
          });
          return;
        } catch {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
      throw new Error('Harness not listening on 3123');
    };
    await waitForPort();

    expect(proc.pid).toBeTruthy();

    // Drive harness endpoints
    const request = (path: string) => new Promise<string>((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port: 3123, path, method: 'GET' }, res => {
        let data = '';
        res.on('data', (d) => data += d.toString());
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.end();
    });

    await request('/start');
    await new Promise((r) => setTimeout(r, 200));
    await request('/pause');
    await new Promise((r) => setTimeout(r, 200));
    await request('/resume');
    await new Promise((r) => setTimeout(r, 200));
    await request('/stop');
    const finalize = await request('/finalize');
    expect(finalize).toContain('success');

    // Exit
    proc.kill();

    await new Promise((r) => setTimeout(r, 300));
  });
});


