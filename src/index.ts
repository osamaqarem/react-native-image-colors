import { Image } from 'react-native'
import { RNImageColors } from './module'
import { cache } from './cache'
import type { ImageRequireSource } from 'react-native'
import type { ImageColorsResult, RNImageColorsModule } from './types'

const MAX_KEY_LEN = 500

const resolveImageSource = (source: string | ImageRequireSource): string => {
  if (typeof source === 'string') {
    return source
  } else {
    return Image.resolveAssetSource(source).uri
  }
}

const getColors: RNImageColorsModule['getColors'] = async (source, config) => {
  const resolvedSrc = resolveImageSource(source)

  if (config?.cache) {
    const cachedResult = config.key
      ? cache.getItem(config.key)
      : cache.getItem(resolvedSrc)

    if (cachedResult) return cachedResult
  }

  const result: ImageColorsResult = await RNImageColors.getColors(
    resolvedSrc,
    config
  )

  if (config?.cache) {
    if (!config.key && resolvedSrc.length > MAX_KEY_LEN) {
      throw new Error(
        `You enabled caching, but you didn't pass a key. We fallback to using the image URI as the key. However the URI is longer than ${MAX_KEY_LEN}. Please pass a short unique key.`
      )
    }

    cache.setItem(config.key ?? resolvedSrc, result)
  }

  return result
}

const ImageColors: RNImageColorsModule = {
  getColors,
  cache,
}

export default ImageColors
