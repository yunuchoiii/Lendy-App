import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {supabase} from '../auth/supabaseClient';

type RootStackParamList = {
  Login: undefined;
  MainWebView: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

async function signInWithProvider(provider: 'kakao' | 'google' | 'apple') {
  // TODO: RN에서의 OAuth 리다이렉트(deep link) 세부 설정은 추후 추가
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      skipBrowserRedirect: false,
    },
  });
}

export const LoginScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lendy 소셜 로그인</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.kakao]}
          onPress={() => signInWithProvider('kakao')}>
          <Text style={styles.buttonText}>카카오로 계속하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.google]}
          onPress={() => signInWithProvider('google')}>
          <Text style={styles.buttonText}>Google로 계속하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.apple]}
          onPress={() => signInWithProvider('apple')}>
          <Text style={styles.buttonText}>Apple로 계속하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  google: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  apple: {
    backgroundColor: '#000000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

