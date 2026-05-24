/**
 * Mini Wujie 核心实现
 * 基于 iframe + Web Components 的微前端方案
 */

export enum AppStatus {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  MOUNTED = 'MOUNTED',
  UNMOUNTING = 'UNMOUNTING',
}

export interface WujieApp {
  name: string;
  url: string;
  el: string;
  status: AppStatus;
  iframe?: HTMLIFrameElement;
  shadowRoot?: ShadowRoot;
  degrade?: boolean;
}

class MiniWujie {
  private apps: Map<string, WujieApp> = new Map();

  async startApp(options: Omit<WujieApp, 'status'>) {
    const app: WujieApp = {
      ...options,
      status: AppStatus.NOT_LOADED,
    };

    this.apps.set(app.name, app);

    await this.loadApp(app);
    await this.mountApp(app);

    return app;
  }

  private async loadApp(app: WujieApp) {
    if (app.status !== AppStatus.NOT_LOADED) {
      return;
    }

    app.status = AppStatus.LOADING;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    
    const iframeReady = new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
    });

    document.body.appendChild(iframe);
    app.iframe = iframe;

    await iframeReady;
  }

  private async mountApp(app: WujieApp) {
    if (!app.iframe) {
      throw new Error(`App ${app.name} iframe not found`);
    }

    const container = document.querySelector(app.el);
    if (!container) {
      throw new Error(`Container ${app.el} not found`);
    }

    const shadowHost = document.createElement('div');
    shadowHost.id = `wujie-${app.name}`;
    container.appendChild(shadowHost);

    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    app.shadowRoot = shadowRoot;

    const iframeWindow = app.iframe.contentWindow;
    if (!iframeWindow) {
      throw new Error('Iframe window not accessible');
    }

    const iframeDocument = app.iframe.contentDocument;
    if (!iframeDocument) {
      throw new Error('Iframe document not accessible');
    }

    iframeDocument.open();
    iframeDocument.write(app.url);
    iframeDocument.close();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const iframeBody = iframeDocument.body;
    if (iframeBody) {
      shadowRoot.innerHTML = iframeBody.innerHTML;

      const styles = iframeDocument.querySelectorAll('style');
      styles.forEach((style) => {
        shadowRoot.appendChild(style.cloneNode(true));
      });

      const scripts = iframeDocument.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        shadowRoot.appendChild(newScript);
      });
    }

    app.status = AppStatus.MOUNTED;
  }

  async destroyApp(name: string) {
    const app = this.apps.get(name);
    if (!app) {
      return;
    }

    app.status = AppStatus.UNMOUNTING;

    if (app.shadowRoot) {
      const shadowHost = document.querySelector(`#wujie-${name}`);
      shadowHost?.remove();
    }

    if (app.iframe) {
      app.iframe.remove();
    }

    this.apps.delete(name);
  }

  getApp(name: string) {
    return this.apps.get(name);
  }
}

export const wujie = new MiniWujie();
