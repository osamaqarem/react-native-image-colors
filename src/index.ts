import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to RNImageColors.web.ts
// and on native platforms to RNImageColors.ts
import RNImageColorsModule from './RNImageColorsModule';
import RNImageColorsView from './RNImageColorsView';
import { ChangeEventPayload, RNImageColorsViewProps } from './RNImageColors.types';

// Get the native constant value.
export const PI = RNImageColorsModule.PI;

export function hello(): string {
  return RNImageColorsModule.hello();
}

export async function setValueAsync(value: string) {
  return await RNImageColorsModule.setValueAsync(value);
}

const emitter = new EventEmitter(RNImageColorsModule ?? NativeModulesProxy.RNImageColors);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { RNImageColorsView, RNImageColorsViewProps, ChangeEventPayload };
