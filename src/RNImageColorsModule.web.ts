import Vibrant from 'node-vibrant';
import type { Config, WebImageColors } from './RNImageColors.types';

type Palette = Awaited<ReturnType<Vibrant['getPalette']>>;

const getQuality = (quality: Config['quality']): number => {
  switch (quality) {
    case 'lowest':
      return 10;
    case 'low':
      return 5;
    case 'high':
      return 1.333;
    case 'highest':
      return 1;
    default:
      return getQuality('low');
  }
};

const getDominantSwatch = (palette: Palette) => {
  let dominant = palette[0];
  const highestPopulation = -1;

  const keys = Object.keys(palette);

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const swatch = palette[key];

    if (swatch && swatch?.population > highestPopulation) {
      dominant = swatch;
    }
  }

  return dominant;
};

export default {
  getColors: async (src: string, config: Config): Promise<WebImageColors> => {
    const { defaultColor } = config;

    const img = new Image();
    img.src = src;
    img.crossOrigin = 'Anonymous';

    const vibrant = new Vibrant(img, {
      useWorker: true,
      quality: getQuality(config.quality),
    });

    const palette = await vibrant.getPalette();

    return {
      dominant: getDominantSwatch(palette)?.hex ?? defaultColor,
      vibrant: palette.Vibrant?.hex ?? defaultColor,
      darkVibrant: palette.DarkVibrant?.hex ?? defaultColor,
      lightVibrant: palette.LightVibrant?.hex ?? defaultColor,
      darkMuted: palette.DarkMuted?.hex ?? defaultColor,
      lightMuted: palette.LightMuted?.hex ?? defaultColor,
      muted: palette.Muted?.hex ?? defaultColor,
      platform: 'web',
    };
  },
};
