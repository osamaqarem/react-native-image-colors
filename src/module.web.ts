import Vibrant from 'node-vibrant'
import type { Config } from './types'

export const RNImageColors = {
  getColors: async (src: string, config: Config) => {
    // TODO: test against local image
    // TODO: support base64 string
    // TODO: look into supporting average/dominant colors to match android api
    // TODO: update types
    // TODO: update docs (mention expo example, web support
    const { fallback } = config

    const vibrant = new Vibrant(src, {})
    const palettes = await vibrant.getPalette()

    return {
      // dominant: string
      // average: string
      vibrant: palettes.Vibrant?.getHex() ?? fallback,
      darkVibrant: palettes.DarkVibrant?.getHex() ?? fallback,
      lightVibrant: palettes.LightVibrant?.getHex() ?? fallback,
      darkMuted: palettes.DarkMuted?.getHex() ?? fallback,
      lightMuted: palettes.LightMuted?.getHex() ?? fallback,
      muted: palettes.Muted?.getHex() ?? fallback,
      platform: 'web',
    }
  },
}
