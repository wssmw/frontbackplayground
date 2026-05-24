/**
 * Mini Single-SPA 核心实现
 * 基于路由监听自动匹配和切换应用
 */

import { Loader } from './loader';
import { ProxySandbox } from './sandbox';

export enum AppStatus {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED',
  NOT_MOUNTED = 'NOT_MOUNTED',
  MOUNTING = 'MOUNTING',
  MOUNTED = 'MOUNTED',
  UNMOUNTING = 'UNMOUNTING',
}

export interface LifeCycles {
  bootstrap: () => Promise<void>;
  mount: (container: HTMLElement) => Promise<void>;
  unmount: () => Promise<void>;
}

export interface MicroApp {
  name: string;
  entry: string;
  container: string;
  activeRule: (location: Location) => boolean;
  status: AppStatus;
  sandbox?: ProxySandbox;
  lifeCycles?: LifeCycles;
  mountedStyles?: HTMLStyleElement[];
}

class MiniSingleSpa {
  private apps: MicroApp[] = [];
  private started = false;

  registerMicroApps(apps: Omit<MicroApp, 'status'>[]) {
    this.apps = apps.map((app) => ({
      ...app,
      status: AppStatus.NOT_LOADED,
    }));
  }

  start() {
    if (this.started) {
      return;
    }
    this.started = true;

    this.hijackHistory();

    this.reroute();
  }

  private hijackHistory() {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      originalPushState.apply(window.history, args);
      this.reroute();
    };

    window.history.replaceState = (...args) => {
      originalReplaceState.apply(window.history, args);
      this.reroute();
    };

    window.addEventListener('popstate', () => {
      this.reroute();
    });

    window.addEventListener('hashchange', () => {
      this.reroute();
    });
  }

  private async reroute() {
    const { appsToLoad, appsToMount, appsToUnmount } = this.getAppChanges();

    await Promise.all(appsToUnmount.map((app) => this.unmountApp(app)));

    await Promise.all(appsToLoad.map((app) => this.loadApp(app)));

    await Promise.all(appsToMount.map((app) => this.mountApp(app)));
  }

  private getAppChanges() {
    const appsToLoad: MicroApp[] = [];
    const appsToMount: MicroApp[] = [];
    const appsToUnmount: MicroApp[] = [];

    this.apps.forEach((app) => {
      const shouldBeActive = app.activeRule(window.location);

      switch (app.status) {
        case AppStatus.NOT_LOADED:
        case AppStatus.LOADING:
          if (shouldBeActive) {
            appsToLoad.push(app);
          }
          break;
        case AppStatus.NOT_BOOTSTRAPPED:
        case AppStatus.NOT_MOUNTED:
          if (shouldBeActive) {
            appsToMount.push(app);
          }
          break;
        case AppStatus.MOUNTED:
          if (!shouldBeActive) {
            appsToUnmount.push(app);
          }
          break;
      }
    });

    return { appsToLoad, appsToMount, appsToUnmount };
  }

  private async loadApp(app: MicroApp) {
    if (app.status !== AppStatus.NOT_LOADED) {
      return;
    }

    app.status = AppStatus.LOADING;

    const { scripts, styles, html } = Loader.parseHTML(app.entry);

    const sandbox = new ProxySandbox(app.name);
    app.sandbox = sandbox;

    sandbox.active();
    Loader.execScripts(scripts, sandbox.getProxy());

    const lifeCycles = (sandbox.getProxy() as any).__MICRO_APP_LIFECYCLE__;
    if (!lifeCycles) {
      throw new Error(`App ${app.name} must export __MICRO_APP_LIFECYCLE__`);
    }

    app.lifeCycles = lifeCycles;
    app.mountedStyles = Loader.mountStyles(styles, app.name);

    const container = document.querySelector(app.container);
    if (container) {
      container.innerHTML = html;
    }

    if (lifeCycles.bootstrap) {
      await lifeCycles.bootstrap();
    }

    app.status = AppStatus.NOT_MOUNTED;
  }

  private async mountApp(app: MicroApp) {
    if (app.status !== AppStatus.NOT_MOUNTED) {
      return;
    }

    app.status = AppStatus.MOUNTING;

    const container = document.querySelector(app.container);
    if (!container) {
      throw new Error(`Container ${app.container} not found`);
    }

    app.sandbox?.active();

    if (app.lifeCycles?.mount) {
      await app.lifeCycles.mount(container as HTMLElement);
    }

    app.status = AppStatus.MOUNTED;
  }

  private async unmountApp(app: MicroApp) {
    if (app.status !== AppStatus.MOUNTED) {
      return;
    }

    app.status = AppStatus.UNMOUNTING;

    if (app.lifeCycles?.unmount) {
      await app.lifeCycles.unmount();
    }

    app.sandbox?.inactive();

    Loader.unmountStyles(app.name);

    const container = document.querySelector(app.container);
    if (container) {
      container.innerHTML = '';
    }

    app.status = AppStatus.NOT_MOUNTED;
  }

  navigateTo(url: string) {
    window.history.pushState(null, '', url);
  }

  getApp(name: string) {
    return this.apps.find((app) => app.name === name);
  }

  getApps() {
    return this.apps;
  }
}

export const singleSpa = new MiniSingleSpa();
