//
//  ImageColorsBridge.m
//  react-native-image-colors
//
//  Created by Osama Qarem on 2/16/20.
//  See LICENSE file for copyright.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ImageColors, NSObject)

RCT_EXTERN_METHOD(
                  getColors: (NSString *)url
                  config: (NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
