// swift-tools-version: 6.0
import PackageDescription

// Expo SwiftPM autolinking supplies ExpoModulesCore from the host app.
let package = Package(
  name: "ImageColors",
  platforms: [.iOS("13.4")],
  products: [
    .library(name: "ImageColors", targets: ["ImageColors"]),
  ],
  dependencies: [
    .package(url: "https://github.com/swhitty/SwiftDraw.git", from: "0.27.0"),
  ],
  targets: [
    .target(
      name: "ImageColors",
      dependencies: [.product(name: "SwiftDraw", package: "SwiftDraw")],
      path: "ios",
      exclude: ["ImageColors.podspec"]
    ),
  ]
)
