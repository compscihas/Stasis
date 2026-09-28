import Constants from 'expo-constants';

export type BleCapability = {
  available: boolean;
  reason?: string;
};

export function bleCapability(): BleCapability {
  if (Constants.appOwnership === 'expo') {
    return {
      available: false,
      reason: 'BLE requires a Stasis EAS development build; Expo Go has no custom native module.',
    };
  }
  return { available: true };
}

export async function createBleManager() {
  const capability = bleCapability();
  if (!capability.available) throw new Error(capability.reason);
  const { BleManager } = await import('react-native-ble-plx');
  return new BleManager();
}

/**
 * Protocol offload is deliberately unavailable until the Dart protocol package
 * has been ported byte-for-byte and its fixtures pass. A partial implementation
 * could ACK uncommitted history and permanently delete data from the band.
 */
export async function startHistoryOffload(): Promise<never> {
  throw new Error('WHOOP history offload is not yet enabled in the Expo migration.');
}
