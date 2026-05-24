/**
 * 资源加载器
 * 用于解析 HTML、提取脚本和样式、执行脚本
 */

export interface ParsedHTML {
  scripts: string[];
  styles: string[];
  html: string;
}

export class Loader {
  static parseHTML(html: string): ParsedHTML {
    const scripts: string[] = [];
    const styles: string[] = [];

    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;

    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      scripts.push(match[1]);
    }

    while ((match = styleRegex.exec(html)) !== null) {
      styles.push(match[1]);
    }

    const cleanHTML = html.replace(scriptRegex, '').replace(styleRegex, '').trim();

    return { scripts, styles, html: cleanHTML };
  }

  static execScripts(scripts: string[], sandbox: any) {
    scripts.forEach((script) => {
      try {
        const func = new Function('window', `with(window) { ${script} }`);
        func.call(sandbox, sandbox);
      } catch (error) {
        console.error('Script execution error:', error);
      }
    });
  }

  static mountStyles(styles: string[], appName: string): HTMLStyleElement[] {
    return styles.map((style) => {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-app', appName);
      styleElement.textContent = style;
      document.head.appendChild(styleElement);
      return styleElement;
    });
  }

  static unmountStyles(appName: string) {
    const styles = document.querySelectorAll(`style[data-app="${appName}"]`);
    styles.forEach((style) => style.remove());
  }
}
