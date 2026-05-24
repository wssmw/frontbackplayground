/**
 * Proxy 沙箱实现
 * 用于隔离子应用的 window 对象，防止全局变量污染
 */

export class ProxySandbox {
  private proxy: WindowProxy;
  private isRunning = false;
  private modifiedPropsMap = new Map<PropertyKey, any>();
  private addedPropsSet = new Set<PropertyKey>();

  constructor(private name: string) {
    const fakeWindow = Object.create(null);
    const rawWindow = window;

    this.proxy = new Proxy(fakeWindow, {
      get: (target, prop) => {
        if (prop === 'window' || prop === 'self' || prop === 'globalThis') {
          return this.proxy;
        }

        if (prop in target) {
          return target[prop];
        }

        const value = (rawWindow as any)[prop];
        if (typeof value === 'function' && !value.prototype) {
          return value.bind(rawWindow);
        }
        return value;
      },

      set: (target, prop, value) => {
        if (!this.isRunning) {
          return true;
        }

        if (!target.hasOwnProperty(prop)) {
          this.addedPropsSet.add(prop);
        } else if (!this.modifiedPropsMap.has(prop)) {
          this.modifiedPropsMap.set(prop, (rawWindow as any)[prop]);
        }

        target[prop] = value;
        return true;
      },

      has: (target, prop) => {
        return prop in target || prop in rawWindow;
      },
    });
  }

  active() {
    this.isRunning = true;
  }

  inactive() {
    this.isRunning = false;

    this.modifiedPropsMap.forEach((value, prop) => {
      (window as any)[prop] = value;
    });

    this.addedPropsSet.forEach((prop) => {
      delete (window as any)[prop];
    });
  }

  getProxy() {
    return this.proxy;
  }

  getModifications() {
    return {
      modified: Array.from(this.modifiedPropsMap.keys()),
      added: Array.from(this.addedPropsSet),
    };
  }
}
