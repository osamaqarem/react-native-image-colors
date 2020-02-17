//
//  ImageColorsBridge.m
//  spotifyclone
//
//  Created by Osama Qarem on 2/16/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ImageColors, NSObject)

RCT_EXTERN_METHOD(
                  getImageColorsFromURL: (NSString *)url
                  config: (NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
