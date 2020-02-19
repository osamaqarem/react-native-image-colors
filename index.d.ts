import { Platform } from "react-native";

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

type iOSImageColors = {
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

export declare type ImageColors = {
  getColors: <T>(
    url: string,
    config: Config
  ) => Promise<AndroidImageColors | iOSImageColors>;
};
