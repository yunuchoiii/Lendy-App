import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { MainWebViewScreen } from '../screens/MainWebViewScreen';
import { colors } from '../theme/colors';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Chat: undefined;
  MyLendy: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const HapticTabBarButton: React.FC<BottomTabBarButtonProps> = ({
  onPress,
  children,
  ...rest
}) => {
  const handlePress = (event: any) => {
    ReactNativeHapticFeedback.trigger('soft', hapticOptions);
    onPress?.(event);
  };

  return (
    <Pressable onPress={handlePress} {...(rest as any)}>
      {children}
    </Pressable>
  );
};

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
  const scheme = useColorScheme();
  const themeColors = scheme === 'dark' ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [
          {
            backgroundColor: themeColors.background,
            borderTopColor: themeColors.background,
            height: insets.bottom + 68,
            paddingTop: 5,
            paddingBottom: insets.bottom,
            paddingHorizontal: 10,
            shadowColor: themeColors.text,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: themeColors.primary,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Create') {
            const isDark = scheme === 'dark';
            const baseSecondary = isDark ? colors.dark.secondary : colors.light.secondary;

            return (
              <View style={styles.centerButtonWrapper}>
                <View
                  style={[
                    styles.centerButton,
                    {
                      backgroundColor: focused ? themeColors.secondaryLight : baseSecondary,
                      shadowColor: baseSecondary,
                    },
                  ]}>
                  <Icon name="plus" size={32} color={'white'} />
                </View>
              </View>
            );
          }

          let iconName: string = 'circle';
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Chat':
              iconName = 'message-circle';
              break;
            case 'MyLendy':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          const iconColor = focused ? themeColors.primary : themeColors.mutedText;

          return (
            <View style={styles.iconWrapper}>
              <Icon name={iconName} size={24} color={iconColor} />
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
                  ? '마이렌디'
                  : '',
        tabBarButton: props => <HapticTabBarButton {...props} />,
      })}>
      <Tab.Screen name="Home" component={HomeTabScreen} />
      <Tab.Screen name="Search" component={SearchTabScreen} />
      <Tab.Screen name="Create" component={CreateTabScreen} options={{ title: '' }} />
      <Tab.Screen name="Chat" component={ChatTabScreen} />
      <Tab.Screen name="MyLendy" component={MyLendyTabScreen} options={{ title: '마이 렌디' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  centerButtonFocused: {
    backgroundColor: '#0a2a40',
  },
  centerButtonText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '600',
    marginTop: -2,
  },
});

