//
//  ImageColors.swift
//  react-native-image-colors
//
//  Created by Osama Qarem on 2/16/20.
//  See LICENSE file for copyright.
//
import UIKit

@objc(ImageColors)
class ImageColors: NSObject {
    private let fallback = "#000"

    enum ERRORS {
        static let ERROR_1 = "Invalid URL";
        static let ERROR_2 = "Could not download image.";
        static let ERROR_3 = "Could not parse image.";
    }

    private func getQuality(qualityOption: String) -> UIImageColorsQuality {
        switch qualityOption {
        case "lowest": return UIImageColorsQuality.lowest
        case "low": return UIImageColorsQuality.low
        case "high": return UIImageColorsQuality.high
        case "highest": return UIImageColorsQuality.highest
        default: return UIImageColorsQuality.low
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

    @objc
    func getColors(_ uri: String, config: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {

        let defColor = config.value(forKey: "defaultColor") as? String

        guard let parsedUri = URL(string: uri) else {
            let error = NSError.init(domain: ImageColors.ERRORS.ERROR_1, code: -1)
            reject("Error", ImageColors.ERRORS.ERROR_1, error)
            return
        }

        var request = URLRequest(url: parsedUri)

        if let headers = config.value(forKey: "headers") as? NSDictionary {
            let allKeys = headers.allKeys

            allKeys.forEach { (key) in
                let key = key as! String
                let value = headers.value(forKey: key) as? String
                request.setValue(value, forHTTPHeaderField: key)
            }
        }

        URLSession.shared.dataTask(with: request) { [unowned self] (data, response, error) in
            guard let data = data, error == nil else {
                reject("Error", ImageColors.ERRORS.ERROR_2, error)
                return
            }

            guard let uiImage = UIImage(data: data) else {
                let error = NSError.init(domain: ImageColors.ERRORS.ERROR_3, code: -3)
                reject("Error", ImageColors.ERRORS.ERROR_3, error)
                return
            }

            let qualityProp = config["quality"] as? String ?? "low"
            let quality = getQuality(qualityOption: qualityProp)

            uiImage.getColors(quality: quality) { colors in
                var resultDict: Dictionary<String, String> = ["platform": "ios"]

                if let background = colors?.background {
                    resultDict["background"] = self.toHexString(color: background)
                } else {
                    resultDict["background"] = defColor ?? self.fallback
                }


                if let primary = colors?.primary {
                    resultDict["primary"] = self.toHexString(color: primary)
                } else {
                    resultDict["primary"] = defColor ?? self.fallback
                }


                if let secondary = colors?.secondary {
                    resultDict["secondary"] = self.toHexString(color: secondary)
                } else {
                    resultDict["secondary"] = defColor ?? self.fallback
                }

                if let detail = colors?.detail {
                    resultDict["detail"] = self.toHexString(color: detail)
                } else {
                    resultDict["detail"] = defColor ?? self.fallback
                }

                resolve(resultDict)
            }
        }.resume()
    }
}
