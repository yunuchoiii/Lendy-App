import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useWebViewBridge } from '../hooks/webview/useWebViewBridge';
import { sendDeviceInfo } from '../lib/bridge';
import type { DeviceInfo } from '../types/bridge';

type Props = {
  initialUrl?: string;
};

export const MainWebViewScreen: React.FC<Props> = ({ initialUrl }) => {
  const insets = useSafeAreaInsets();
  const nativeWebViewRef = useRef<WebView | null>(null);
  const {
    setWebViewRef,
    handleMessage,
    getInjectedJavaScriptBeforeContentLoaded,
  } = useWebViewBridge({
    onWindowReady: () => {
      if (!nativeWebViewRef.current) {
        return;
      }
      const deviceInfo: DeviceInfo = {
        deviceModel: 'Unknown',
        appVersion: '0.0.1',
        os: 'ios',
        osVersion: '0.0.0',
        deviceId: 'unknown-device',
        safeAreaInsets: {
          top: insets.top,
          bottom: insets.bottom,
          left: insets.left,
          right: insets.right,
        },
      };
      sendDeviceInfo(nativeWebViewRef, deviceInfo);
    },
  });

  const uri =
    initialUrl ??
    // TODO: Lendy-Webview 배포/로컬 주소로 교체
    'https://example.com';

  return (
    <View style={styles.container}>
      <WebView
        ref={ref => {
          nativeWebViewRef.current = ref;
          setWebViewRef(ref);
        }}
        source={{ uri }}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={getInjectedJavaScriptBeforeContentLoaded()}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        decelerationRate={0.998}
        allowsBackForwardNavigationGestures
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

