// Import the native module. On web, it will be resolved to RNImageColors.web.ts
// and on native platforms to RNImageColors.ts
import { ImageRequireSource, Image } from 'react-native'

import { cache } from './cache'
import RNImageColorsModule from './module'
import { ImageColorsResult, Config } from './types'

const MAX_KEY_LEN = 500

const resolveImageSource = (source: string | ImageRequireSource): string => {
  if (typeof source === 'string') {
    return source
  } else {
    return Image.resolveAssetSource(source).uri
  }
}

/**
 *
 * @param uri - source of the image. Can be a remote URL, a base64 string or a local file path.
 * ```ts
 *  const fromUrl = await getColors('https://example.com/image.jpg')
 *
 *  const fromBase64 = await getColors('data:image/jpeg;base64,/9j/4Ri...')
 *
 *  const fromLocalFile = await getColors(require('./images/cat.jpg'))
 * ```
 * @param config - configuration
 */
const getColors = async (uri: string, config: Partial<Config> = {}) => {
  const resolvedSrc = resolveImageSource(uri)

  if (config?.cache) {
    const cachedResult = config.key
      ? cache.getItem(config.key)
      : cache.getItem(resolvedSrc)

    if (cachedResult) return cachedResult
  }

  const result: ImageColorsResult = await RNImageColorsModule.getColors(
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

const ImageColors = {
  getColors,
  cache,
}

export default ImageColors

export { getColors, cache }
export type { ImageColorsResult }
