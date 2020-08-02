# react-native-image-colors

![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-green)
![TypeScript](https://img.shields.io/badge/typescript-typed-blue)
[![NPM Badge](https://img.shields.io/npm/v/react-native-image-colors)](https://www.npmjs.com/package/react-native-image-colors)
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

This module is a wrapper around the [Palette](https://developer.android.com/reference/androidx/palette/graphics/Palette) class on Android and [UIImageColors](https://github.com/jathu/UIImageColors) on iOS.

## Installation

```
$ npm install react-native-image-colors
```

or

```
$ yarn add react-native-image-colors
```

### Android

Rebuild the app.

### iOS

Install the pod, then rebuild the app.

`npx pod-install`

> **RN < 0.62**: if you face a compilation error while building, your Xcode project likely does not support Swift which this package requires. You can fix this by either **a)** Creating a blank dummy swift file using Xcode or **b)** [Following steps 1,2,3 here](https://github.com/facebook/flipper/blob/4297b3061f14ceca4d184aa3eebd0731b5bf20f5/docs/getting-started.md#for-pure-objective-c-projects).

## Usage

Start by importing the module

```js
import ImageColors from "react-native-image-colors"
```

🎨 Fetch colors

```js
const colors = await ImageColors.getColors(URI, config)
```

### URI

Can be a URL or a local asset.

- URL:

  [`https://i.imgur.com/O3XSdU7.jpg`](https://i.imgur.com/O3XSdU7.jpg)

- Local file:

  ```js
  const catImg = require("./images/cat.jpg")
  ```

### config

| Property                      | Description                                                                                                                                                 | Type                                                   | Required | Default     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- | ----------- |
| `fallback`                    | If a color property couldn't be retrieved, it will default to this hex color string (**note**: do not use shorthand hex. e.g. `#fff`).                      | `string`                                               | No       | `"#000000"` |
| `pixelSpacing` (Android only) | How many pixels to skip when iterating over image pixels. Higher means better performance (**note**: value cannot be lower than 1).                         | `number`                                               | No       | `5`         |
| `quality` (iOS only)          | Highest implies no downscaling and very good colors, but it is very slow. See [UIImageColors](https://github.com/jathu/UIImageColors#uiimagecolors-objects) | `'lowest'` <br> `'low'` <br> `'high'` <br> `'highest'` | No       | `"low"`     |

### Result (android)

On android, you will get an object with the following color properties, plus a `platform` key to help you figure out that this is the android result type.

| Property       | Type        |
| -------------- | ----------- |
| `dominant`     | `string`    |
| `average`      | `string`    |
| `vibrant`      | `string`    |
| `darkVibrant`  | `string`    |
| `lightVibrant` | `string`    |
| `darkMuted`    | `string`    |
| `lightMuted`   | `string`    |
| `muted`        | `string`    |
| `platform`     | `"android"` |

### Result (iOS)

On iOS, you get the following color properties object, plus the respective platform key.

| Property     | Type     |
| ------------ | -------- |
| `background` | `string` |
| `primary`    | `string` |
| `secondary`  | `string` |
| `detail`     | `string` |
| `platform`   | `"ios"`  |

### Example

```js
const coolImage = require("./cool.jpg")

const colors = await ImageColors.getColors(coolImage, {
  fallback: "#228B22",
})

if (colors.platform === "android") {
  // Access android properties
  // e.g.
  const averageColor = colors.average
} else {
  // Access iOS properties
  // e.g.
  const backgroundColor = colors.background
}
```

### Notes

- There is an [example](https://github.com/osamaq/react-native-image-colors/blob/master/example/App.js) react-native project.
