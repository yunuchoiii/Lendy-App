import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainWebViewScreen} from '../screens/MainWebViewScreen';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Chat: undefined;
  MyLendy: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeTabScreen = () => (
  <MainWebViewScreen initialUrl="https://lendy-webview.local/home" />
);

const SearchTabScreen = () => (
  <MainWebViewScreen initialUrl="https://lendy-webview.local/search" />
);

const CreateTabScreen = () => (
  <MainWebViewScreen initialUrl="https://lendy-webview.local/create" />
);

const ChatTabScreen = () => (
  <MainWebViewScreen initialUrl="https://lendy-webview.local/chat" />
);

const MyLendyTabScreen = () => (
  <MainWebViewScreen initialUrl="https://lendy-webview.local/mylendy" />
);

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({focused}) => {
          if (route.name === 'Create') {
            return (
              <View style={styles.centerButtonWrapper}>
                <View style={[styles.centerButton, focused && styles.centerButtonFocused]}>
                  <Text style={styles.centerButtonText}>＋</Text>
                </View>
              </View>
            );
          }

          let label = '';
          switch (route.name) {
            case 'Home':
              label = '홈';
              break;
            case 'Search':
              label = '검색';
              break;
            case 'Chat':
              label = '대화';
              break;
            case 'MyLendy':
              label = '마이 렌디';
              break;
            default:
              label = '';
          }

          return (
            <View style={styles.iconWrapper}>
              <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{label[0]}</Text>
            </View>
          );
        },
        tabBarLabel:
          route.name === 'Home'
            ? '홈'
            : route.name === 'Search'
            ? '검색'
            : route.name === 'Chat'
            ? '대화'
            : route.name === 'MyLendy'
            ? '마이 렌디'
            : '',
      })}>
      <Tab.Screen name="Home" component={HomeTabScreen} />
      <Tab.Screen name="Search" component={SearchTabScreen} />
      <Tab.Screen name="Create" component={CreateTabScreen} options={{title: ''}} />
      <Tab.Screen name="Chat" component={ChatTabScreen} />
      <Tab.Screen name="MyLendy" component={MyLendyTabScreen} options={{title: '마이 렌디'}} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 11,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#4B5563',
  },
  iconTextFocused: {
    color: '#111827',
    fontWeight: '600',
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: -24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F3C5D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 4,
  },
  centerButtonFocused: {
    backgroundColor: '#0a2a40',
  },
  centerButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -2,
  },
});

