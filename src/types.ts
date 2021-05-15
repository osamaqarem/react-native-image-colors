export interface AndroidImageColors {
  dominant?: string
  average?: string
  vibrant?: string
  darkVibrant?: string
  lightVibrant?: string
  darkMuted?: string
  lightMuted?: string
  muted?: string
  platform: 'android'
}

export interface IOSImageColors {
  background: string
  primary: string
  secondary: string
  detail: string
  quality: Config['quality']
  platform: 'ios'
}

export interface Config {
  fallback?: string
  pixelSpacing?: number
  quality?: 'lowest' | 'low' | 'high' | 'highest'
}

declare function GetColors<C extends Config>(
  url: string,
  config?: C
): Promise<AndroidImageColors | IOSImageColors>

export interface RNImageColorsModule {
  getColors: typeof GetColors
}
