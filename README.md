# react-native-image-colors

![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-green)
![TypeScript](https://img.shields.io/badge/typescript-typed-blue)
![NPM Badge](https://img.shields.io/npm/v/react-native-image-colors)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-%23ff69b4)

Fetch prominent colors from an image using a URL.

<p align="center" >
  <kbd>
    <img src="https://github.com/osamaq/react-native-image-colors/blob/master/assets/demo.gif" title="Demo">
  </kbd>
  <br>
  <em>Example usage with a <a href="https://github.com/react-native-community/react-native-linear-gradient">gradient</a></em>
</p>

This module is a wrapper around the [Palette](https://developer.android.com/reference/androidx/palette/graphics/Palette) class on Android and [UIImageColors](https://github.com/jathu/UIImageColors) on iOS.

## Installation

```
$ npm install react-native-image-colors
# --- or ---
$ yarn add react-native-image-colors
```

### Android

Rebuild the app.

### iOS

Install the pod, then rebuild the app.

`cd ios && pod install`

(if you face a compilation error while building, you probably need to create a blank swift file in XCode. [See #1](https://github.com/osamaq/react-native-image-colors/issues/1)).

## Usage

Start by importing the module

```js
import ImageColors from "react-native-image-colors";
```

🎨 Fetch colors

```js
const colors = await ImageColors.getColors(URL, config);
```

### URL

e.g.

[`https://i.imgur.com/O3XSdU7.jpg`](https://i.imgur.com/O3XSdU7.jpg)

### config

| Property       | description                                                                                                                                                                                                                    | type      | Required | Android | iOS |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | -------- | ------- | --- |
| `dominant`     | Get the dominant color if true.                                                                                                                                                                                                | `boolean` | No       | ✅      | ❌  |
| `average`      | Get the average color if true.                                                                                                                                                                                                 | `boolean` | No       | ✅      | ❌  |
| `vibrant`      | Get the vibrant color if true.                                                                                                                                                                                                 | `boolean` | No       | ✅      | ❌  |
| `darkVibrant`  | Get the dark vibrant color if true.                                                                                                                                                                                            | `boolean` | No       | ✅      | ❌  |
| `lightVibrant` | Get the light vibrant color if true.                                                                                                                                                                                           | `boolean` | No       | ✅      | ❌  |
| `darkVibrant`  | Get the dark vibrant color if true.                                                                                                                                                                                            | `boolean` | No       | ✅      | ❌  |
| `darkMuted`    | Get the dark muted color if true.                                                                                                                                                                                              | `boolean` | No       | ✅      | ❌  |
| `lightMuted`   | Get the light muted color if true.                                                                                                                                                                                             | `boolean` | No       | ✅      | ❌  |
| `muted`        | Get the muted color if true.                                                                                                                                                                                                   | `boolean` | No       | ✅      | ❌  |
| `defaultColor` | If a color property couldn't be retrieved, it will default to this hex color string. If this parameter is not passed, `#000000` will be used (**_important_**: shorthand hex will not work e.g. `#fff` ❌ **vs** `#ffffff` ✅) | `string`  | No       | ✅      | ✅  |

```ts
type Config = {
  dominant?: boolean;
  average?: boolean;
  vibrant?: boolean;
  darkVibrant?: boolean;
  lightVibrant?: boolean;
  darkMuted?: boolean;
  lightMuted?: boolean;
  muted?: boolean;
  defaultColor?: string;
};
```

### Result

On android, you will only get the color properties you marked as `true` in the config object, plus a `platform` key to help you figure out that this is the android result type.

```ts
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
```

On iOS, you will always get all of the following properties regardless of what you pass to the config object, plus the respective platform key:

```ts
type IOSImageColors = {
  background: string;
  primary: string;
  secondary: string;
  detail: string;
  platform: "ios";
};
```

### Notes

- The `background` property in the iOS result and the `dominant` property in the android result are usually similar colors.
- There is an [example](https://github.com/osamaq/react-native-image-colors/tree/master/example) react-native project.
