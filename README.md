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

```
npm install react-native-image-colors
```

```
yarn add react-native-image-colors
```

### Expo
react-native-image-colors requires Expo SDK 47+

Please ensure that your app has at least iOS 13 as a deployment target, which is required for `react-native-image-colors` as well as Expo SDK 47+

Build custom native code

```
expo prebuild

# iOS
expo run:ios

# Android
expo run:android
```

> The [example](https://github.com/osamaqarem/react-native-image-colors/blob/master/example/package.json) is an expo app.

### Android

Rebuild the app.

### iOS

Install the pod, then rebuild the app.

```
npx pod-install
```

### Web

You're good to go!

## Usage

```js
import ImageColors from 'react-native-image-colors'

const uri = require('./cool.jpg')

const result = await ImageColors.getColors(uri, {
  fallback: '#228B22',
  cache: true,
  key: 'unique_key',
})

switch (result.platform) {
  case 'android':
    // android result properties
    const vibrantColor = result.vibrant
    break
  case 'web':
    // web result properties
    const lightVibrantColor = result.lightVibrant
    break
  case 'ios':
    // iOS result properties
    const primaryColor = result.primary
    break
  default:
    throw new Error('Unexpected platform key')
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

#### `Config`

| Property       | Description                                                                                                                                                                                    | Type                                                   | Required | Default     | Supported platforms |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- | ----------- | ------------------- |
| `fallbackColor`     | If a color property couldn't be retrieved, it will default to this hex color string (**note**: do not use shorthand hex. e.g. `#fff`).                                                         | `string`                                               | No       | `"#000000"` | All                 |
| `cache`        | Enables in-memory caching of the result - skip downloading the same image next time.                                                                                                           | `boolean`                                              | No       | `false`     | All                 |
| `key`          | Unique key to use for the cache entry. The image URI is used as the unique key by default. You should explicitly pass a key if you enable caching and you're using a base64 string as the URI. | `string`                                               | No       | `undefined` | All                 |
| `headers`      | HTTP headers to be sent along with the GET request to download the image                                                                                                                       | `Record<string, string>`                               | No       | `undefined` | iOS, Android        |
| `pixelSpacing` | How many pixels to skip when iterating over image pixels. Higher means better performance (**note**: value cannot be lower than 1).                                                            | `number`                                               | No       | `5`         | Android             |
| `quality`      | Highest implies no downscaling and very good colors.                                                                                                                                           | `'lowest'` <br> `'low'` <br> `'high'` <br> `'highest'` | No       | `"low"`     | iOS, Web            |

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

- There is an [example](https://github.com/osamaqarem/react-native-image-colors/blob/master/example/App.js) app.
- Since the implementation of each platform is different you can get **different color results for each**.
