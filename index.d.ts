declare module "react-native-image-colors" {
  export function getColors<C extends Config>(
    url: string,
    config: C
  ): Promise<
    | (AndroidImageColors &
        (C["dominant"] extends true ? { ["dominant"]: string } : {}) &
        (C["average"] extends true ? { ["average"]: string } : {}) &
        (C["vibrant"] extends true ? { ["vibrant"]: string } : {}) &
        (C["darkVibrant"] extends true ? { ["darkVibrant"]: string } : {}) &
        (C["lightVibrant"] extends true ? { ["lightVibrant"]: string } : {}) &
        (C["darkMuted"] extends true ? { ["darkMuted"]: string } : {}) &
        (C["lightMuted"] extends true ? { ["lightMuted"]: string } : {}) &
        (C["muted"] extends true ? { ["muted"]: string } : {}))
    | IOSImageColors
  >;
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
