import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';

type Props = {
  initialUrl?: string;
};

export const MainWebViewScreen: React.FC<Props> = ({initialUrl}) => {
  const uri =
    initialUrl ??
    // TODO: Lendy-Webview 배포/로컬 주소로 교체
    'https://example.com';

  return (
    <View style={styles.container}>
      <WebView
        source={{uri}}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

