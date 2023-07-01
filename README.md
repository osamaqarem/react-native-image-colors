# react-native-image-colors

![Platform](https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20expo%20%7C%20web-%239cf)
[![NPM Badge](https://img.shields.io/npm/v/react-native-image-colors)](https://www.npmjs.com/package/react-native-image-colors)
![Publish size](https://badgen.net/packagephobia/publish/react-native-image-colors)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-%23ff69b4)

Fetch prominent colors from an image.

<p align="center" >
  <img
    width="250px"
    src="https://github.com/osamaq/react-native-image-colors/raw/master/assets/example1.png"
    alt="Example 1"
  />
  <img
    width="250px"
    src="https://github.com/osamaq/react-native-image-colors/raw/master/assets/demo1.png"
    alt="Demo 1 Android"
  />
  <img
    width="250px"
    src="https://github.com/osamaq/react-native-image-colors/raw/master/assets/demo1_ios.png"
    alt="Demo 1 iOS"
  />
  <img
    width="250px"
    src="https://github.com/osamaq/react-native-image-colors/raw/master/assets/demo2.png"
    alt="Demo 2 Android"
  />
  <img
    width="250px"
    src="https://github.com/osamaq/react-native-image-colors/raw/master/assets/demo2_ios.png"
    alt="Demo 2 iOS"
  />
</p>

This module is a wrapper around the [Palette](https://developer.android.com/reference/androidx/palette/graphics/Palette) class on Android, [UIImageColors](https://github.com/jathu/UIImageColors) on iOS and [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) for the web.

## Installation

- [Expo](#expo)
- [React Native CLI](#react-native-cli)
- [Web](#web)

### Expo

#### Requirements

- Expo SDK 47+

```
yarn add react-native-image-colors
```

```
npx expo prebuild
```

iOS

```
npx expo run:ios
```

Android

```
npx expo run:android
```

> The [example](https://github.com/osamaqarem/react-native-image-colors/blob/master/example/package.json) is an expo app.

### React Native CLI

#### Requirements

- React Native v0.70.0+
- iOS 13+
- [Expo modules](https://docs.expo.dev/bare/installing-expo-modules/) must be configured

> Users on < RN0.69 and older can use v1.x.x

```
yarn add react-native-image-colors
```

iOS

```
npx pod-install
```

```
npx react-native run-ios
```

Android

```
npx react-native run-android
```

### Web

```
yarn add react-native-image-colors
```

## Usage

```js
import React from 'react'
import { getColors } from 'react-native-image-colors'

const useImageColors = () => {
  const [colors, setColors] = React.useState(null)

  React.useEffect(() => {
    const url = 'https://i.imgur.com/68jyjZT.jpg'

    getColors(url, {
      fallback: '#228B22',
      cache: true,
      key: url,
    }).then(setColors)
  }, [])

  return colors
}
```

## API

#### `ImageColors.getColors(uri: string, config?: Config): Promise<ImageColorsResult>`

#### `uri`

A string which can be:

- URL:

  [`https://i.imgur.com/O3XSdU7.jpg`](https://i.imgur.com/O3XSdU7.jpg)

- Local file:

  ```js
  const catImg = require('./images/cat.jpg')
  ```

- Base64:

  ```js
  const catImgBase64 = 'data:image/jpeg;base64,/9j/4Ri...'
  ```

  > The mime type prefix for base64 is required (e.g. data:image/png;base64).

#### `Config?`

The config object is optional.

| Property       | Description                                                                                                                                                                                    | Type                                                   | Default     | Supported platforms |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------- | ------------------- |
| `fallback`     | If a color property couldn't be retrieved, it will default to this hex color string                                                         | `string`                                               | `"#000000"` | All                 |
| `cache`        | Enables in-memory caching of the result - skip downloading the same image next time.                                                                                                           | `boolean`                                              | `false`     | All                 |
| `key`          | Unique key to use for the cache entry. The image URI is used as the unique key by default. You should explicitly pass a key if you enable caching and you're using a base64 string as the URI. | `string`                                               | `undefined` | All                 |
| `headers`      | HTTP headers to be sent along with the GET request to download the image                                                                                                                       | `Record<string, string>`                               | `undefined` | iOS, Android        |
| `pixelSpacing` | How many pixels to skip when iterating over image pixels. Higher means better performance (**note**: value cannot be lower than 1).                                                            | `number`                                               | `5`         | Android             |
| `quality`      | Highest implies no downscaling and very good colors.                                                                                                                                           | `'lowest'` <br> `'low'` <br> `'high'` <br> `'highest'` | `"low"`     | iOS, Web            |

### `ImageColorsResult`

Every result object contains a respective `platform` key to help narrow down the type.

#### `AndroidImageColors`

| Property       | Type        |
| -------------- | ----------- |
| `dominant`     | `string`   |
| `average`      | `string`   |
| `vibrant`      | `string`   |
| `darkVibrant`  | `string`   |
| `lightVibrant` | `string`   |
| `darkMuted`    | `string`   |
| `lightMuted`   | `string`   |
| `muted`        | `string`   |
| `platform`     | `"android"` |

#### `WebImageColors`

| Property       | Type      |
| -------------- | --------- |
| `dominant`     | `string` |
| `vibrant`      | `string` |
| `darkVibrant`  | `string` |
| `lightVibrant` | `string` |
| `darkMuted`    | `string` |
| `lightMuted`   | `string` |
| `muted`        | `string` |
| `platform`     | `"web"`   |

#### `IOSImageColors`

| Property     | Type     |
| ------------ | -------- |
| `background` | `string` |
| `primary`    | `string` |
| `secondary`  | `string` |
| `detail`     | `string` |
| `platform`   | `"ios"`  |

---

### Notes

- There is an [example](https://github.com/osamaqarem/react-native-image-colors/blob/master/example/App.tsx) app.
- Since the implementation of each platform is different you can get **different color results for each**.
