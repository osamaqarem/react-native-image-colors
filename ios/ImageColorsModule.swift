import ExpoModulesCore
import UIKit

public class ImageColorsModule: Module {

    enum ERRORS {
        static let INVALID_URL = "Invalid URL."
        static let DOWNLOAD_ERR = "Could not download image."
        static let PARSE_ERR = "Could not parse image."
        static let INVALID_FALLBACK_COLOR = "Invalid fallback hex color. Must be in the format #ffffff or #fff."
    }

    enum QUALITY {
        static let LOWEST = "lowest"
        static let LOW = "low"
        static let HIGH = "high"
        static let HIGHEST = "highest"
    }

    private func getQuality(qualityOption: String) -> UIImageColorsQuality {
        switch qualityOption {
        case QUALITY.LOWEST:
            return UIImageColorsQuality.lowest
        case QUALITY.LOW:
            return UIImageColorsQuality.low
        case QUALITY.HIGH:
            return UIImageColorsQuality.high
        case QUALITY.HIGHEST:
            return UIImageColorsQuality.highest
        default:
            return UIImageColorsQuality.low
        }
    }


    private func toHexString(color: UIColor) -> String {
        let comp = color.cgColor.components

        let r: CGFloat = comp![0]
        let g: CGFloat = comp![1]
        let b: CGFloat = comp![2]

        let rgb: Int = (Int)(r * 255) << 16 | (Int)(g * 255) << 8 | (Int)(b * 255) << 0

        return String(format: "#%06X", rgb)
    }

    private func parseFallbackColor(hexColor: String) -> String? {
        let regex = try! NSRegularExpression(pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", options: .caseInsensitive)

        let range = NSRange(location: 0, length: hexColor.utf16.count)
        let match = regex.firstMatch(in: hexColor, options: [], range: range)

        if match == nil {
            return nil
        }

        if hexColor.count == 7 {
            return hexColor
        }

        let red = String(hexColor[hexColor.index(hexColor.startIndex, offsetBy: 1)])
        let green = String(hexColor[hexColor.index(hexColor.startIndex, offsetBy: 2)])
        let blue = String(hexColor[hexColor.index(hexColor.startIndex, offsetBy: 3)])

        return "#\(red)\(red)\(green)\(green)\(blue)\(blue)"
    }

    struct Config: Record {
        @Field
        var fallback: String = "#000000"

        @Field
        var headers: [String: String]? = [:]

        @Field
        var quality: String = QUALITY.LOW
    }

    public func definition() -> ModuleDefinition {
        Name("ImageColors")

        AsyncFunction("getColors") { (uri: String, config: Config, promise: Promise) in
            guard let fallbackColor = parseFallbackColor(hexColor: config.fallback) else {
                let error = NSError.init(domain: ImageColorsModule.ERRORS.INVALID_FALLBACK_COLOR, code: -1)
                promise.reject(error)
                return
            }

            guard let parsedUri = URL(string: uri) else {
                let error = NSError.init(domain: ImageColorsModule.ERRORS.INVALID_URL, code: -1)
                promise.reject(error)
                return
            }

            var request = URLRequest(url: parsedUri)

            config.headers?.forEach { key, value in
                request.setValue(value, forHTTPHeaderField: key)
            }

            URLSession.shared.dataTask(with: request) { [unowned self] (data, response, error) in
                guard let data = data, error == nil else {
                    promise.reject(NSError.init(domain: ImageColorsModule.ERRORS.DOWNLOAD_ERR, code: -2))
                    return
                }

                guard let uiImage = UIImage(data: data) else {
                    let error = NSError.init(domain: ImageColorsModule.ERRORS.PARSE_ERR, code: -3)
                    promise.reject(error)
                    return
                }

                let qualityProp = config.quality
                let quality = getQuality(qualityOption: qualityProp)

                uiImage.getColors(quality: quality) { colors in
                    var resultDict: Dictionary<String, String> = ["platform": "ios"]

                    if let background = colors?.background {
                        resultDict["background"] = self.toHexString(color: background)
                    } else {
                        resultDict["background"] = fallbackColor
                    }


                    if let primary = colors?.primary {
                        resultDict["primary"] = self.toHexString(color: primary)
                    } else {
                        resultDict["primary"] = fallbackColor
                    }


                    if let secondary = colors?.secondary {
                        resultDict["secondary"] = self.toHexString(color: secondary)
                    } else {
                        resultDict["secondary"] = fallbackColor
                    }

                    if let detail = colors?.detail {
                        resultDict["detail"] = self.toHexString(color: detail)
                    } else {
                        resultDict["detail"] = fallbackColor
                    }

                    promise.resolve(resultDict)
                }
            }.resume()
        }
    }
}
