import ExpoModulesCore
import UIKit

public class ImageColorsModule: Module {

    enum ERRORS {
        static let INVALID_URL = "Invalid URL";
        static let DOWNLOAD_ERR = "Could not download image.";
        static let PARSE_ERR = "Could not parse image.";
    }

    enum QUALITY {
        static let LOWEST = "lowest";
        static let LOW = "low";
        static let HIGH = "high";
        static let HIGHEST = "highest";
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
        let comp = color.cgColor.components;

        let r: CGFloat = comp![0]
        let g: CGFloat = comp![1]
        let b: CGFloat = comp![2]

        let rgb: Int = (Int)(r * 255) << 16 | (Int)(g * 255) << 8 | (Int)(b * 255) << 0

        return String(format: "#%06X", rgb)
    }

    struct Config: Record {
        @Field
        var fallback: String = "#000000"

        @Field
        var headers: NSDictionary? = nil

        @Field
        var quality: String = QUALITY.LOW
    }

    public func definition() -> ModuleDefinition {
        Name("ImageColors")

        AsyncFunction("getColors") { (uri: String, config: Config, promise: Promise) in
            let fallbackColor = config.fallback

            guard let parsedUri = URL(string: uri) else {
                let error = NSError.init(domain: ImageColorsModule.ERRORS.INVALID_URL, code: -1)
                DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                    promise.reject(error)
                }
                return
            }

            var request = URLRequest(url: parsedUri)

            if let headers = config.headers {
                let allKeys = headers.allKeys

                allKeys.forEach { (key) in
                    let key = key as! String
                    let value = headers.value(forKey: key) as? String
                    request.setValue(value, forHTTPHeaderField: key)
                }
            }

            URLSession.shared.dataTask(with: request) { [unowned self] (data, response, error) in
                guard let data = data, error == nil else {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                        promise.reject(NSError.init(domain: ImageColorsModule.ERRORS.DOWNLOAD_ERR, code: -2))
                    }
                    return
                }

                guard let uiImage = UIImage(data: data) else {
                    let error = NSError.init(domain: ImageColorsModule.ERRORS.PARSE_ERR, code: -3)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                        promise.reject(error)
                    }
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
