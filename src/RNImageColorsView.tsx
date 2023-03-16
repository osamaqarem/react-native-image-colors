import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { RNImageColorsViewProps } from './RNImageColors.types';

const NativeView: React.ComponentType<RNImageColorsViewProps> =
  requireNativeViewManager('RNImageColors');

export default function RNImageColorsView(props: RNImageColorsViewProps) {
  return <NativeView {...props} />;
}
