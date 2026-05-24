/**
 * Mini Qiankun 实现
 * 基于 Single-SPA，增加沙箱隔离、样式隔离等功能
 */

import { singleSpa } from './single-spa';
import type { MicroApp } from './single-spa';

export interface QiankunApp extends Omit<MicroApp, 'activeRule'> {
  activeRule: string | ((location: Location) => boolean);
}

class MiniQiankun {
  registerMicroApps(apps: Omit<QiankunApp, 'status'>[]) {
    const formattedApps = apps.map((app) => ({
      ...app,
      activeRule: this.normalizeActiveRule(app.activeRule),
    }));

    singleSpa.registerMicroApps(formattedApps);
  }

  start() {
    singleSpa.start();
  }

  private normalizeActiveRule(
    activeRule: string | ((location: Location) => boolean),
  ): (location: Location) => boolean {
    if (typeof activeRule === 'function') {
      return activeRule;
    }

    return (location: Location) => {
      const path = location.pathname;
      if (activeRule.startsWith('/')) {
        return path.startsWith(activeRule);
      }
      return path.includes(activeRule);
    };
  }

  navigateTo(url: string) {
    singleSpa.navigateTo(url);
  }

  getApps() {
    return singleSpa.getApps();
  }

  getApp(name: string) {
    return singleSpa.getApp(name);
  }
}

export const qiankun = new MiniQiankun();
export { AppStatus } from './single-spa';
