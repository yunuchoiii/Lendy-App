import {useCallback, useRef} from 'react';
import type {WebView, WebViewMessageEvent} from 'react-native-webview';
import {getBridgeInjectionScript, getDebugScript} from '../../lib/bridge';
import {
  handleBridgeMessage,
  parseBridgeMessage,
  type BridgeHandlers,
} from '../../utils/bridgeHandlers';

export interface UseWebViewBridgeOptions extends BridgeHandlers {}

export const useWebViewBridge = (options: UseWebViewBridgeOptions = {}) => {
  const webViewRef = useRef<WebView | null>(null);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const {data} = event.nativeEvent;
      const message = parseBridgeMessage(data);

      if (!message) {
        // eslint-disable-next-line no-console
        console.warn('[LendyBridge] received invalid message', data);
        return;
      }

      handleBridgeMessage(message, options);
    },
    [options],
  );

  const getInjectedJavaScriptBeforeContentLoaded = useCallback(
    () => getBridgeInjectionScript() + getDebugScript(),
    [],
  );

  const setWebViewRef = useCallback((ref: WebView | null) => {
    webViewRef.current = ref;
  }, []);

  return {
    webViewRef,
    setWebViewRef,
    handleMessage,
    getInjectedJavaScriptBeforeContentLoaded,
  };
};

