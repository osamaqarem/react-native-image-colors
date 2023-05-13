import Vibrant from 'node-vibrant'
import { Palette } from 'node-vibrant/lib/color'

import type { Config, WebImageColors } from './types'

const getQuality = (quality: Config['quality']): number => {
  switch (quality) {
    case 'lowest':
      return 10
    case 'low':
      return 5
    case 'high':
      return 1.333
    case 'highest':
      return 1
    default:
      return getQuality('low')
  }
}

const getDominantSwatch = (palette: Palette) => {
  let dominant = palette[0]
  const highestPopulation = -1

  const keys = Object.keys(palette)

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    const swatch = palette[key]

    if (swatch && swatch?.population > highestPopulation) {
      dominant = swatch
    }
  }

  return dominant
}

export default {
  getColors: async (src: string, config: Config): Promise<WebImageColors> => {
    const { fallback } = config

    const img = new Image()
    img.src = src
    img.crossOrigin = 'Anonymous'

    const vibrant = new Vibrant(img, {
      useWorker: true,
      quality: getQuality(config.quality),
    })

    const palette = await vibrant.getPalette()

    return {
      dominant: getDominantSwatch(palette)?.hex ?? fallback,
      vibrant: palette.Vibrant?.hex ?? fallback,
      darkVibrant: palette.DarkVibrant?.hex ?? fallback,
      lightVibrant: palette.LightVibrant?.hex ?? fallback,
      darkMuted: palette.DarkMuted?.hex ?? fallback,
      lightMuted: palette.LightMuted?.hex ?? fallback,
      muted: palette.Muted?.hex ?? fallback,
      platform: 'web',
    }
  },
}
