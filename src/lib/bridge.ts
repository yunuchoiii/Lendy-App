import type {MutableRefObject} from 'react';
import type {WebView} from 'react-native-webview';
import type {DeviceInfo} from '../types/bridge';

const isValidJavaScriptIdentifier = (name: string): boolean =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);

export const createInjectionScript = (code: string): string =>
  `(function() { try { ${code} } catch (e) { console.error('[LendyBridge] injection error', e); } })(); true;`;

export const getBridgeInjectionScript = (): string => {
  const script = `
    (function () {
      if (!window.ReactNativeWebView || typeof window.ReactNativeWebView.postMessage !== 'function') return;

      if (!window.webViewHandler) {
        window.webViewHandler = {
          postMessage: function (data) {
            window.ReactNativeWebView.postMessage(data);
          }
        };
      }

      if (!window.webkit) window.webkit = { messageHandlers: {} };
      if (!window.webkit.messageHandlers) window.webkit.messageHandlers = {};

      if (!window.webkit.messageHandlers.webViewHandler) {
        window.webkit.messageHandlers.webViewHandler = {
          postMessage: function (data) {
            window.ReactNativeWebView.postMessage(data);
          }
        };
      }
    })();
  `;
  return createInjectionScript(script);
};

export const getDebugScript = (): string => {
  const script = `
    (function () {
      if (!window.ReactNativeWebView || typeof window.ReactNativeWebView.postMessage !== 'function') {
        return;
      }

      var originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug
      };

      function safeSerialize(arg) {
        try {
          if (arg instanceof Error) {
            return {
              name: arg.name,
              message: arg.message,
              stack: arg.stack
            };
          }
          return arg;
        } catch (e) {
          return '[Unserializable value]';
        }
      }

      function sendToNative(logType, args) {
        try {
          var payload = {
            type: 'console',
            logType: logType,
            timestamp: Date.now(),
            args: (Array.prototype.slice.call(args) || []).map(safeSerialize),
            rawArgs: []
          };
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        } catch (e) {
        }
      }

      console.log = function () {
        sendToNative('log', arguments);
        originalConsole.log.apply(console, arguments);
      };
      console.warn = function () {
        sendToNative('warn', arguments);
        originalConsole.warn.apply(console, arguments);
      };
      console.error = function () {
        sendToNative('error', arguments);
        originalConsole.error.apply(console, arguments);
      };
      console.info = function () {
        sendToNative('info', arguments);
        originalConsole.info.apply(console, arguments);
      };
      console.debug = function () {
        sendToNative('debug', arguments);
        originalConsole.debug.apply(console, arguments);
      };
    })();
  `;
  return createInjectionScript(script);
};

export const sendToWeb = (
  webViewRef: MutableRefObject<WebView | null>,
  functionName: string,
  data?: unknown,
): void => {
  if (!webViewRef.current) {
    return;
  }
  if (!isValidJavaScriptIdentifier(functionName)) {
    console.warn('[LendyBridge] invalid function name:', functionName);
    return;
  }

  const payload = data === undefined ? 'undefined' : JSON.stringify(data);
  const code = `
    if (typeof window['${functionName}'] === 'function') {
      window['${functionName}'](${payload});
    } else {
      console.warn('[LendyBridge] function not found: ${functionName}');
    }
  `;

  webViewRef.current.injectJavaScript(createInjectionScript(code));
};

export const sendToWebWithResult = (
  webViewRef: MutableRefObject<WebView | null>,
  functionName: string,
  data?: unknown,
): void => {
  if (!webViewRef.current) {
    return;
  }
  if (!isValidJavaScriptIdentifier(functionName)) {
    console.warn('[LendyBridge] invalid function name:', functionName);
    return;
  }

  const payload = data === undefined ? 'undefined' : JSON.stringify(data);

  const code = `
    (async function () {
      try {
        var fn = window['${functionName}'];
        if (typeof fn !== 'function') {
          window.webViewHandler && window.webViewHandler.postMessage(JSON.stringify({ result: 'FAIL' }));
          return;
        }
        var result = await fn(${payload});
        var message = result || { result: 'SUCCESS' };
        window.webViewHandler && window.webViewHandler.postMessage(JSON.stringify(message));
      } catch (e) {
        window.webViewHandler && window.webViewHandler.postMessage(JSON.stringify({ result: 'FAIL' }));
      }
    })();
  `;

  webViewRef.current.injectJavaScript(createInjectionScript(code));
};

export const sendDeviceInfo = (
  webViewRef: MutableRefObject<WebView | null>,
  deviceInfo: DeviceInfo,
): void => {
  sendToWebWithResult(webViewRef, 'receiveDeviceInfo', deviceInfo);
};

export const sendNotificationPermission = (
  webViewRef: MutableRefObject<WebView | null>,
  permission: 'granted' | 'denied' | 'default',
): void => {
  sendToWeb(webViewRef, 'receiveNotificationPermission', {permission});
};

export const sendNotificationClick = (
  webViewRef: MutableRefObject<WebView | null>,
): void => {
  sendToWeb(webViewRef, 'receiveOpenNotification');
};

export const sendCameraPermission = (
  webViewRef: MutableRefObject<WebView | null>,
  permission: 'granted' | 'denied',
): void => {
  sendToWeb(webViewRef, 'receiveCameraPermission', {permission});
};

export const sendAccessToken = (
  webViewRef: MutableRefObject<WebView | null>,
  accessToken: string | null,
): void => {
  sendToWeb(webViewRef, 'receiveAccessToken', accessToken);
};

