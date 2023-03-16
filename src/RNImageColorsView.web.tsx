import * as React from 'react';

import { RNImageColorsViewProps } from './RNImageColors.types';

export default function RNImageColorsView(props: RNImageColorsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
