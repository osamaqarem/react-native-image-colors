# react-native-image-colors

![Platform](https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20expo%20%7C%20web-%239cf)
[![NPM Badge](https://img.shields.io/npm/v/react-native-image-colors)](https://www.npmjs.com/package/react-native-image-colors)
[![install size](https://packagephobia.com/badge?p=react-native-image-colors)](https://packagephobia.com/result?p=react-native-image-colors)
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

This package works with Expo managed workflow apps. Set up [`expo-dev-client`](https://docs.expo.dev/clients/getting-started/) so you can use this package.
The [example](https://github.com/osamaqarem/react-native-image-colors/blob/master/example/package.json) project demonstrates this.

### Android

Rebuild the app.

### iOS

Install the pod, then rebuild the app.

```
npx pod-install
```

> **RN < 0.62**: if you face a compilation error while building, your Xcode project likely does not support Swift which this package requires. You can fix this by creating a blank dummy swift file using Xcode.

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

| Property                      | Description                                                                                                                                                                                    | Type                                                   | Required | Default     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- | ----------- |
| `fallback`                    | If a color property couldn't be retrieved, it will default to this hex color string (**note**: do not use shorthand hex. e.g. `#fff`).                                                         | `string`                                               | No       | `"#000000"` |
| `cache`                       | Enables in-memory caching of the result.                                                                                                                                                       | `boolean`                                              | No       | `false`     |
| `key`                         | Unique key to use for the cache entry. The image URI is used as the unique key by default. You should explicitly pass a key if you enable caching and you're using a base64 string as the URI. | `string`                                               | No       | `undefined` |
| `pixelSpacing` (Android only) | How many pixels to skip when iterating over image pixels. Higher means better performance (**note**: value cannot be lower than 1).                                                            | `number`                                               | No       | `5`         |
| `quality` (iOS and web)          | Highest implies no downscaling and very good colors, but it is very slow.                                    | `'lowest'` <br> `'low'` <br> `'high'` <br> `'highest'` | No       | `"low"`     |


### `ImageColorsResult`

#### `AndroidImageColors`

On Android, you will get an object with the following color properties, plus a `platform` key to help you figure out that this is the android result type.

| Property       | Type        |
| -------------- | ----------- |
| `dominant`     | `string?`    |
| `average`      | `string?`    |
| `vibrant`      | `string?`    |
| `darkVibrant`  | `string?`    |
| `lightVibrant` | `string?`    |
| `darkMuted`    | `string?`    |
| `lightMuted`   | `string?`    |
| `muted`        | `string?`    |
| `platform`     | `"android"` |

#### `WebImageColors`

On web, the result is similar to Android but lacks the average color.

| Property       | Type        |
| -------------- | ----------- |
| `dominant`     | `string?`    |
| `vibrant`      | `string?`    |
| `darkVibrant`  | `string?`    |
| `lightVibrant` | `string?`    |
| `darkMuted`    | `string?`    |
| `lightMuted`   | `string?`    |
| `muted`        | `string?`    |
| `platform`     | `"web"` |

#### `IOSImageColors`

On iOS, you get the following color properties object, plus the respective platform key.

| Property     | Type     |
| ------------ | -------- |
| `background` | `string` |
| `primary`    | `string` |
| `secondary`  | `string` |
| `detail`     | `string` |
| `platform`   | `"ios"`  |

------

### Notes

- There is an [example](https://github.com/osamaqarem/react-native-image-colors/blob/master/example/App.js) react-native project.
- Since the implementation of each platform is different you can get different color results on each.