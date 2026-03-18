import {PostMessage, type BridgeMessage, type ConsoleLogMessage} from '../types/bridge';

export const parseBridgeMessage = (
  raw: string,
): BridgeMessage | ConsoleLogMessage | null => {
  try {
    const parsed = JSON.parse(raw);

    if (parsed && parsed.type === 'console') {
      return parsed as ConsoleLogMessage;
    }

    if (!parsed || typeof parsed.message !== 'string') {
      return null;
    }

    const message = parsed.message as PostMessage;

    if (!Object.values(PostMessage).includes(message)) {
      return null;
    }

    return parsed as BridgeMessage;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[LendyBridge] failed to parse message', e, raw);
    return null;
  }
};

export interface BridgeHandlers {
  onWindowReady?: () => void;
  onHaptic?: (params: {style?: string; count?: number; interval?: number}) => void;
  onExternalBrowserOpen?: (url: string) => void;
  onGetNotificationPermission?: () => void;
  onMoveToNotificationSettings?: () => void;
  onMoveToAppSettings?: () => void;
  onLogout?: () => void;
  onTokenExpired?: () => void;
  onWithdrawal?: () => void;
  onRequestCameraPermission?: () => void;
  onDeviceInfoResult?: (result: 'SUCCESS' | 'FAIL') => void;
  onConsoleLog?: (log: ConsoleLogMessage) => void;
}

export const handleBridgeMessage = (
  message: BridgeMessage | ConsoleLogMessage,
  handlers: BridgeHandlers,
): void => {
  if ('type' in message && message.type === 'console') {
    handlers.onConsoleLog?.(message);
    return;
  }

  const bridgeMessage = message as BridgeMessage;

  switch (bridgeMessage.message) {
    case PostMessage.WINDOW_READY:
      handlers.onWindowReady?.();
      break;
    case PostMessage.HAPTIC:
      handlers.onHaptic?.({
        style: bridgeMessage.style,
        count: bridgeMessage.count,
        interval: bridgeMessage.interval,
      });
      break;
    case PostMessage.EXTERNAL_BROWSER_OPEN:
      handlers.onExternalBrowserOpen?.(bridgeMessage.url);
      break;
    case PostMessage.GET_NOTIFICATION_PERMISSION:
      handlers.onGetNotificationPermission?.();
      break;
    case PostMessage.MOVE_TO_NOTIFICATION_SETTINGS:
      handlers.onMoveToNotificationSettings?.();
      break;
    case PostMessage.MOVE_TO_APP_SETTINGS:
      handlers.onMoveToAppSettings?.();
      break;
    case PostMessage.LOGOUT:
      handlers.onLogout?.();
      break;
    case PostMessage.TOKEN_EXPIRED:
      handlers.onTokenExpired?.();
      break;
    case PostMessage.WITHDRAWAL:
      handlers.onWithdrawal?.();
      break;
    case PostMessage.REQUEST_CAMERA_PERMISSION:
      handlers.onRequestCameraPermission?.();
      break;
    case PostMessage.DEVICE_INFO_RESULT:
      handlers.onDeviceInfoResult?.(bridgeMessage.result);
      break;
    default:
      // eslint-disable-next-line no-console
      console.warn('[LendyBridge] unhandled message', message);
  }
};

