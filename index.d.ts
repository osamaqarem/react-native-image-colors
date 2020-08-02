declare module "react-native-image-colors" {
  export function getColors<C extends Config>(
    url: string,
    config: C
  ): Promise<AndroidImageColors | IOSImageColors>;
}

export type AndroidImageColors = {
  dominant?: string;
  average?: string;
  vibrant?: string;
  darkVibrant?: string;
  lightVibrant?: string;
  darkMuted?: string;
  lightMuted?: string;
  muted?: string;
  platform: "android";
};

export type IOSImageColors = {
  background: string;
  primary: string;
  secondary: string;
  detail: string;
  quality: Config['quality']
  platform: "ios";
};

export type Config = {
  fallback?: string;
  pixelSpacing?: number;
  quality?: "lowest" | "low" | "high" | "highest";
};
