import { NativeModules, Image } from "react-native"

const { ImageColors: ImageColorsModule } = NativeModules

const ImageColors = {
  getColors: (source, config) => {
    if (typeof source === "string") {
      return ImageColorsModule.getColors(source, config)
    } else {
      const resolvedSource = Image.resolveAssetSource(source).uri
      return ImageColorsModule.getColors(resolvedSource, config)
    }
  },
}

export default ImageColors
