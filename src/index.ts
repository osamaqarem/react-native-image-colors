import { NativeModules, Image } from 'react-native'
import type { RNImageColorsModule } from './types'

const { ImageColors: RNImageColors } = NativeModules

const ImageColors: RNImageColorsModule = {
  getColors: (source, config) => {
    if (typeof source === 'string') {
      return RNImageColors.getColors(source, config)
    } else {
      const resolvedSource = Image.resolveAssetSource(source).uri
      return RNImageColors.getColors(resolvedSource, config)
    }
  },
}

export default ImageColors
