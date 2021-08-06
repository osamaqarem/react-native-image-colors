import Vibrant from 'node-vibrant'
import type { Palette } from 'node-vibrant/lib/color'
import type { Config, WebImageColors } from './types'

const getDominantSwatch = (palette: Palette) => {
  let dominant = palette[0]
  let highestPopulation = -1

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

export const RNImageColors = {
  getColors: async (src: string, config: Config): Promise<WebImageColors> => {
    // TODO: update docs (mention expo example, web support
    const { fallback } = config

    let img = new Image()
    img.src = src
    img.crossOrigin = 'Anonymous'

    const vibrant = new Vibrant(img, {})
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
