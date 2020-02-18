require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNImageColors"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.authors      = package['author']
  s.homepage     = package['homepage']

  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/osamaq/react-native-image-colors.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,swift}"
  s.dependency 'React'
  s.pod_target_xcconfig = {
    "SWIFT_VERSION" => "5.0"
  }  

end