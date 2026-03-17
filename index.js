import 'react-native-url-polyfill/auto';

import { AppRegistry, Linking, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import App from './App';
import { name as appName } from './app.json';

const parseHashParams = url => {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) {
    return {};
  }
  const hash = url.substring(hashIndex + 1);
  return hash.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    if (!key) {
      return acc;
    }
    acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return acc;
  }, {});
};

const handleDeepLink = ({ url }) => {
  console.log('[DeepLink] url', url);
  const params = parseHashParams(url);
  console.log('[DeepLink] hashParams', params);
};

Icon.loadFont();

Linking.addEventListener('url', handleDeepLink);

Linking.getInitialURL().then(url => {
  if (url) {
    handleDeepLink({ url });
  }
});

// 전역 폰트: Pretendard
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [
  Text.defaultProps.style,
  { fontFamily: 'Pretendard' },
];

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [
  TextInput.defaultProps.style,
  { fontFamily: 'Pretendard' },
];

AppRegistry.registerComponent(appName, () => App);
