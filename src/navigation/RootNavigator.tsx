import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LoginScreen} from '../screens/LoginScreen';
import {MainTabNavigator} from './MainTabNavigator';
import {supabase} from '../auth/supabaseClient';
import type {Session} from '@supabase/supabase-js';

const parseHashParams = (url: string) => {
  try {
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) {
      return {};
    }
    const hash = url.substring(hashIndex + 1);
    return hash.split('&').reduce<Record<string, string>>((acc, pair) => {
      const [key, value] = pair.split('=');
      if (!key) {
        return acc;
      }
      acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return acc;
    }, {});
  } catch (e) {
    console.log('[AuthDeepLink] parse error', e);
    return {};
  }
};

const handleAuthDeepLink = async (url: string) => {
  if (!url || !supabase) {
    return;
  }

  console.log('[AuthDeepLink] url', url);
  const params = parseHashParams(url);
  console.log('[AuthDeepLink] hashParams', params);

  const accessToken = params['access_token'];
  const refreshToken = params['refresh_token'];

  if (!accessToken || !refreshToken) {
    return;
  }

  try {
    const {data, error} = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    console.log('[AuthDeepLink] setSession result', {data, error});
  } catch (e) {
    console.log('[AuthDeepLink] setSession exception', e);
  }
};

export const RootNavigator: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      console.warn('[Supabase] 클라이언트가 초기화되지 않았습니다.');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({data}) => {
      if (!isMounted) {
        return;
      }
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    // 딥링크로 돌아왔을 때 토큰 처리
    Linking.getInitialURL()
      .then(initialUrl => {
        console.log('[AuthDeepLink] getInitialURL', initialUrl);
        if (initialUrl?.startsWith('lendy://')) {
          handleAuthDeepLink(initialUrl);
        }
      })
      .catch(e => {
        console.log('[AuthDeepLink] getInitialURL error', e);
      });

    const sub = Linking.addEventListener('url', event => {
      const url = event.url;
      console.log('[AuthDeepLink] url event', url);
      if (url?.startsWith('lendy://')) {
        handleAuthDeepLink(url);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      // React Native 0.71+ 이벤트 제거
      // @ts-ignore
      sub.remove?.();
    };
  }, []);

  if (loading) {
    return null;
  }

  const isSignedIn = !!session;

  return (
    <SafeAreaProvider>
      {isSignedIn ? (
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      ) : (
        <LoginScreen />
      )}
    </SafeAreaProvider>
  );
};

