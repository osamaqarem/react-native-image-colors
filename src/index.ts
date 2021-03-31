import { NativeModules, Image } from 'react-native'
import type { Config } from './types'

const { ImageColors: ImageColorsModule } = NativeModules

const ImageColors = {
  getColors: (source: string, config: Config) => {
    if (typeof source === 'string') {
      return ImageColorsModule.getColors(source, config)
    } else {
      const resolvedSource = Image.resolveAssetSource(source).uri
      return ImageColorsModule.getColors(resolvedSource, config)
    }
  },
}

export default ImageColors
