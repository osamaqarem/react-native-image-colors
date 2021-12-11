package com.reactnativeimagecolors;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.palette.graphics.Palette;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URLConnection;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ImageColorsModule extends ReactContextBaseJavaModule {
  private static final String base64Scheme = "data";
  private final ExecutorService executorService;
  private Integer pixelSpacing;


    ImageColorsModule(ReactApplicationContext reactContext) {
      super(reactContext);
      executorService = new ThreadPoolExecutor(
        0,
        Integer.MAX_VALUE,
        30L,
        TimeUnit.SECONDS,
        new SynchronousQueue<>()
      );
    }

    @NonNull
    @Override
    public String getName() {
        return "ImageColors";
    }


    /**
     * https://gist.github.com/maxjvh/a6ab15cbba9c82a5065d
     * pixelSpacing tells how many pixels to skip each pixel.
     * If pixelSpacing > 1: the average color is an estimate, but higher values mean better performance.
     * If pixelSpacing == 1: the average color will be the real average.
     * If pixelSpacing < 1: the method will most likely crash (don't use values below 1).
     */
    private int calculateAverageColor(@NonNull Bitmap bitmap) {
        int R = 0;
        int G = 0;
        int B = 0;
        int height = bitmap.getHeight();
        int width = bitmap.getWidth();
        int n = 0;
        int[] pixels = new int[width * height];

        bitmap.getPixels(pixels, 0, width, 0, 0, width, height);

        int spacing = 5;

        if(pixelSpacing != null){
            spacing = pixelSpacing;
        }

        for (int i = 0; i < pixels.length; i += spacing) {
            int color = pixels[i];
            R += Color.red(color);
            G += Color.green(color);
            B += Color.blue(color);
            n++;
        }
        return Color.rgb(R / n, G / n, B / n);
    }

    private String getHex(int rgb) {
        return String.format("#%06X", (0xFFFFFF & rgb));
    }

    private int parseColorFromHex(String colorHex) {
        return Color.parseColor(colorHex);
    }

    @ReactMethod
    public void getColors(String source, ReadableMap config, Promise promise) {
      executorService.execute(() -> {
          try {
              String defColor = "#000000";
              pixelSpacing = null;

              if (config != null){
                  if (config.hasKey("defaultColor")) {
                      defColor = config.getString("defaultColor");
                  }
                  if (config.hasKey("pixelSpacing")) {
                      pixelSpacing = config.getInt("pixelSpacing");
                  }
              }

              int defColorInt = parseColorFromHex(defColor);

              WritableMap resultMap = Arguments.createMap();
              resultMap.putString("platform", "android");


              Context context = getReactApplicationContext();
              int resourceId = context.getResources().getIdentifier(source, "drawable", context.getPackageName());
              Bitmap image = null;

              if (resourceId == 0) {
                  // resource is not a local file
                  // could be a URL, base64.
                  URI uri = new URI(source);
                  String scheme = uri.getScheme();

                  if(scheme == null) throw new Exception("Invalid URI scheme");

                  if (scheme.equals(base64Scheme)) {
                      String[] parts = source.split(",");
                      String base64Uri = parts[1];
                      byte[] decodedString = Base64.decode(base64Uri, Base64.DEFAULT);
                      image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
                  } else {
                      URLConnection urlConnection = uri.toURL().openConnection();

                      ReadableMap headers = config != null ? config.getMap("headers") : null;
                      if(headers != null){
                          ReadableMapKeySetIterator iterator = headers.keySetIterator();
                          while(iterator.hasNextKey()){
                              String key = iterator.nextKey();
                              urlConnection.setRequestProperty(key, headers.getString(key));
                          }
                      }

                      image = BitmapFactory.decodeStream(urlConnection.getInputStream());
                  }
              } else {
                  image = BitmapFactory.decodeResource(context.getResources(), resourceId);
              }

              if (image == null) throw new Exception("Invalid image URI – failed to get image");

              int rgbAvg = calculateAverageColor(image);
              String hexAvg = getHex(rgbAvg);
              resultMap.putString("average", hexAvg);

                  Palette.Builder builder = new Palette.Builder(image);
                  builder.generate(palette -> {
                      try {
                          if (palette != null) {
                                  int rgb = palette.getDominantColor(defColorInt);
                                  String hex = getHex(rgb);
                                  resultMap.putString("dominant", hex);

                                  int rgb1 = palette.getVibrantColor(defColorInt);
                                  String hex1 = getHex(rgb1);
                                  resultMap.putString("vibrant", hex1);

                                  int rgb2 = palette.getDarkVibrantColor(defColorInt);
                                  String hex2 = getHex(rgb2);
                                  resultMap.putString("darkVibrant", hex2);

                                  int rgb3 = palette.getLightVibrantColor(defColorInt);
                                  String hex3 = getHex(rgb3);
                                  resultMap.putString("lightVibrant", hex3);

                                  int rgb4 = palette.getDarkMutedColor(defColorInt);
                                  String hex4 = getHex(rgb4);
                                  resultMap.putString("darkMuted", hex4);

                                  int rgb5 = palette.getLightMutedColor(defColorInt);
                                  String hex5 = getHex(rgb5);
                                  resultMap.putString("lightMuted", hex5);

                                  int rgb6 = palette.getMutedColor(defColorInt);
                                  String hex6 = getHex(rgb6);
                                  resultMap.putString("muted", hex6);

                                  promise.resolve(resultMap);
                          } else {
                              throw new Exception("Palette was null");
                          }
                      } catch (Exception e) {
                          handleException(e, promise);
                      }
                  });

          } catch (MalformedURLException e) {
              handleException(new Exception("Invalid URL"), promise);
          } catch (Exception e) {
              handleException(e, promise);
          }
      });
    }


    private void handleException(Exception e, Promise promise) {
        e.printStackTrace();
        promise.reject("Error", "ImageColors: " + e.getMessage());
    }
}
