export enum PostMessage {
  WINDOW_READY = 'WINDOW_READY',
  HAPTIC = 'HAPTIC',
  EXTERNAL_BROWSER_OPEN = 'EXTERNAL_BROWSER_OPEN',
  GET_NOTIFICATION_PERMISSION = 'GET_NOTIFICATION_PERMISSION',
  MOVE_TO_NOTIFICATION_SETTINGS = 'MOVE_TO_NOTIFICATION_SETTINGS',
  MOVE_TO_APP_SETTINGS = 'MOVE_TO_APP_SETTINGS',
  REQUEST_CAMERA_PERMISSION = 'REQUEST_CAMERA_PERMISSION',
  LOGOUT = 'LOGOUT',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  WITHDRAWAL = 'WITHDRAWAL',
  DEVICE_INFO_RESULT = 'DEVICE_INFO_RESULT',
}

export type HapticStyle = 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'SOFT' | 'RIGID';

export interface WindowReadyMessage {
  message: PostMessage.WINDOW_READY;
}

export interface HapticMessage {
  message: PostMessage.HAPTIC;
  style?: HapticStyle;
  count?: number;
  interval?: number;
}

export interface ExternalBrowserOpenMessage {
  message: PostMessage.EXTERNAL_BROWSER_OPEN;
  url: string;
}

export interface GetNotificationPermissionMessage {
  message: PostMessage.GET_NOTIFICATION_PERMISSION;
}

export interface MoveToNotificationSettingsMessage {
  message: PostMessage.MOVE_TO_NOTIFICATION_SETTINGS;
}

export interface MoveToAppSettingsMessage {
  message: PostMessage.MOVE_TO_APP_SETTINGS;
}

export interface LogOutMessage {
  message: PostMessage.LOGOUT;
}

export interface TokenExpiredMessage {
  message: PostMessage.TOKEN_EXPIRED;
}

export interface WithdrawalMessage {
  message: PostMessage.WITHDRAWAL;
}

export interface RequestCameraPermissionMessage {
  message: PostMessage.REQUEST_CAMERA_PERMISSION;
}

export type DeviceOS = 'ios' | 'android';

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface DeviceInfo {
  deviceModel: string;
  appVersion: string;
  os: DeviceOS;
  osVersion: string;
  deviceId: string;
  safeAreaInsets: SafeAreaInsets;
  accessToken?: string | null;
  isNewUser?: boolean;
}

export type DeviceInfoResult = 'SUCCESS' | 'FAIL';

export interface DeviceInfoResultMessage {
  message: PostMessage.DEVICE_INFO_RESULT;
  result: DeviceInfoResult;
}

export type BridgeMessage =
  | WindowReadyMessage
  | HapticMessage
  | ExternalBrowserOpenMessage
  | GetNotificationPermissionMessage
  | MoveToNotificationSettingsMessage
  | MoveToAppSettingsMessage
  | LogOutMessage
  | TokenExpiredMessage
  | WithdrawalMessage
  | RequestCameraPermissionMessage
  | DeviceInfoResultMessage;

export interface ConsoleLogMessage {
  type: 'console';
  logType: 'log' | 'warn' | 'error' | 'info' | 'debug';
  timestamp: number;
  args: unknown[];
  stack?: string;
  rawArgs?: unknown[];
}

