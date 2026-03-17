import React, { useEffect } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { supabase } from '../auth/supabaseClient';

async function signInWithProvider(provider: 'kakao' | 'google' | 'apple') {
  try {
    console.log('[OAuth] start', provider);

    if (!supabase) {
      console.error('[OAuth] supabase 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'lendy://auth/callback',
        skipBrowserRedirect: false,
        ...(provider === 'kakao'
          ? {
              queryParams: {
                scope: 'profile_nickname profile_image',
              },
            }
          : {}),
      },
    });

    console.log('[OAuth] result', { provider, data, error });

    if (error) {
      console.error('[OAuth] error', error);
      return;
    }

    if (data?.url) {
      console.log('[OAuth] open url', data.url);
      await Linking.openURL(data.url);
    }
  } catch (e) {
    console.error('[OAuth] exception', e);
  }
}

export const LoginScreen: React.FC = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        console.log('[DeepLink/LoginScreen] getInitialURL', url);
      })
      .catch(e => {
        console.log('[DeepLink/LoginScreen] getInitialURL error', e);
      });

    const sub = Linking.addEventListener('url', event => {
      console.log('[DeepLink/LoginScreen] url event', event?.url);
    });

    return () => {
      sub.remove?.();
    };
  }, []);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.logoSection}>
        <Image
          source={require('../../public/logo/lendy-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          우리 동네 단기 대여 서비스 : <Text style={styles.subtitleHighlight}>렌디</Text>
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.kakao]}
          onPress={() => signInWithProvider('kakao')}>
          <View style={styles.buttonInner}>
            <Image
              source={require('../../public/icons/kakao.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.kakaoText}>카카오 로그인하기</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.google]}
          onPress={() => signInWithProvider('google')}>
          <View style={styles.buttonInner}>
            <Image
              source={require('../../public/icons/google.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.googleText}>Google 로그인하기</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.apple]}
          onPress={() => signInWithProvider('apple')}>
          <View style={styles.buttonInner}>
            <Image
              source={require('../../public/icons/apple.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.appleText}>Apple 로그인하기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#184968',
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 207,
    height: 97,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  subtitleHighlight: {
    fontWeight: '700',
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  button: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  google: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleDark: {
    backgroundColor: '#020617',
    borderColor: '#1F2937',
  },
  apple: {
    backgroundColor: '#000000',
  },
  icon: {
    width: 20,
    height: 20,
  },
  kakaoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#191600',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  appleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

