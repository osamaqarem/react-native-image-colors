declare module "react-native-image-colors" {
  export function getColors(
    url: string,
    config: Config
  ): Promise<AndroidImageColors | IOSImageColors>;
}

type AndroidImageColors = {
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

type IOSImageColors = {
  background: string;
  primary: string;
  secondary: string;
  detail: string;
  platform: "ios";
};

type Config = {
  defaultColor?: string;
  dominant?: boolean;
  average?: boolean;
  vibrant?: boolean;
  darkVibrant?: boolean;
  lightVibrant?: boolean;
  darkMuted?: boolean;
  lightMuted?: boolean;
  muted?: boolean;
};
