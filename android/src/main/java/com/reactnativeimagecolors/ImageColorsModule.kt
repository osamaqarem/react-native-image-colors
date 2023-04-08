package com.reactnativeimagecolors

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.Base64
import android.webkit.URLUtil
import androidx.annotation.NonNull
import androidx.palette.graphics.Palette

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.CoroutineScope

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

import java.net.MalformedURLException
import java.net.URI
class Config : Record {
  @Field
  val fallback: String = "#000000"

  @Field
  val headers: Map<String, String>? = null

  @Field
  val pixelSpacing: Int = 5
}

class ImageColorsModule : Module() {
  private val service = CoroutineScope(Dispatchers.IO)

  /**
   * pixelSpacing tells how many pixels to skip each pixel.
   * If pixelSpacing > 1: the average color is an estimate, but higher values mean better performance.
   * If pixelSpacing == 1: the average color will be the real average.
   * If pixelSpacing < 1: the method will most likely crash (don't use values below 1).
   */
  private fun calculateAverageColor(bitmap: Bitmap, pixelSpacing: Int): Int {
    var redSum = 0
    var greenSum = 0
    var blueSum = 0
    var pixelCount = 0

    for (x in 0 until bitmap.width step pixelSpacing) {
      for (y in 0 until bitmap.height step pixelSpacing) {
        val pixel = bitmap.getPixel(x, y)
        redSum += Color.red(pixel)
        greenSum += Color.green(pixel)
        blueSum += Color.blue(pixel)
        pixelCount++
      }
    }

    val redAvg = redSum / pixelCount
    val greenAvg = greenSum / pixelCount
    val blueAvg = blueSum / pixelCount

    return Color.rgb(redAvg, greenAvg, blueAvg)
  }

  private fun getHex(rgb: Int): String {
    return String.format("#%06X", 0xFFFFFF and rgb)
  }

  private fun handleError(promise: Promise, err: Exception) {
    GlobalScope.launch(Dispatchers.Main) {
      promise.reject("[ImageColors] Error", err.message, err)
    }
  }

  override fun definition() = ModuleDefinition {
    Name("ImageColors")

    AsyncFunction("getColors") { uri: String, config: Config, promise: Promise ->
      service.launch {
        try {
          val fallbackColorInt = Color.parseColor(config.fallback)
          var image: Bitmap? = null

          val context = appContext.reactContext
          val resourceId =
            context?.resources?.getIdentifier(uri, "drawable", context.packageName) ?: 0

          // check if local resource
          if (context != null && resourceId != 0) {
            image = BitmapFactory.decodeResource(context.resources, resourceId)
          }

          // check if base64
          if (uri.startsWith("data:image")) {
            val base64Uri = uri.split(",")[1]
            val decodedBytes = Base64.decode(base64Uri, Base64.DEFAULT)

            image = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
          }

          if (URLUtil.isValidUrl(uri)) {
            val parsedUri = URI(uri)
            val connection = parsedUri.toURL().openConnection()

            if (config.headers != null) {
              for (header in config.headers) {
                connection.setRequestProperty(header.key, header.value)
              }
            }

            image = BitmapFactory.decodeStream(connection.getInputStream())
          }

          if (image == null) {
            throw Exception("Filed to get image")
          }

          val paletteBuilder = Palette.Builder(image)
          val result: MutableMap<String, String> = mutableMapOf()

          result["average"] = getHex(calculateAverageColor(image, config.pixelSpacing))
          result["platform"] = "android"

          try {
            paletteBuilder.generate { palette ->
              if (palette == null) {
                throw Exception("Palette was null")
              }

              result["dominant"] = getHex(palette.getDominantColor(fallbackColorInt))
              result["vibrant"] = getHex(palette.getVibrantColor(fallbackColorInt))
              result["darkVibrant"] = getHex(palette.getDarkVibrantColor(fallbackColorInt))
              result["lightVibrant"] = getHex(palette.getLightVibrantColor(fallbackColorInt))
              result["muted"] = getHex(palette.getMutedColor(fallbackColorInt))
              result["darkMuted"] = getHex(palette.getDarkMutedColor(fallbackColorInt))
              result["lightMuted"] = getHex(palette.getLightMutedColor(fallbackColorInt))

              GlobalScope.launch(Dispatchers.Main) {
                promise.resolve(result)
              }
            }
          } catch (err: Exception) {
            result["dominant"] = config.fallback
            result["vibrant"] = config.fallback
            result["darkVibrant"] = config.fallback
            result["lightVibrant"] = config.fallback
            result["muted"] = config.fallback
            result["darkMuted"] = config.fallback
            result["lightMuted"] = config.fallback

            GlobalScope.launch(Dispatchers.Main) {
              promise.resolve(result)
            }
          }
        } catch (err: MalformedURLException) {
          handleError(promise, Exception("Invalid URL"))
        } catch (err: Exception) {
          handleError(promise, err)
        }
      }
    }
  }
}
