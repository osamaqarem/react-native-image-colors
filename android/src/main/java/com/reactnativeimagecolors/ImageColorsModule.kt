package com.reactnativeimagecolors

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.Base64
import android.util.Log
import android.webkit.URLUtil
import androidx.palette.graphics.Palette

import expo.modules.core.errors.ModuleDestroyedException
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

import kotlinx.coroutines.*
import kotlin.math.ceil

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
    val segmentWidth = 500

    val width = bitmap.width
    val height = bitmap.height

    val numSegments = ceil(width.toDouble() / segmentWidth).toInt()
    val segmentPixels = IntArray(segmentWidth * height)

    var redSum = 0
    var greenSum = 0
    var blueSum = 0
    var pixelCount = 0

    for (i in 0 until numSegments) {
      val xStart = i * segmentWidth
      val xEnd = minOf(width, (i + 1) * segmentWidth)

      bitmap.getPixels(segmentPixels, 0, segmentWidth, xStart, 0, xEnd - xStart, height)

      for (index in segmentPixels.indices step pixelSpacing) {
        redSum += Color.red(segmentPixels[index])
        greenSum += Color.green(segmentPixels[index])
        blueSum += Color.blue(segmentPixels[index])
        pixelCount++
      }
    }
    return if (pixelCount == 0) {
      Color.BLACK
    } else {
      val red = redSum / pixelCount
      val green = greenSum / pixelCount
      val blue = blueSum / pixelCount
      Color.rgb(red, green, blue)
    }
  }

  private fun parseFallbackColor(hex: String): String {
    if(!hex.matches(Regex("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"))) {
      throw Exception("Invalid fallback hex color. Must be in the format #ffffff or #fff")
    }

    if(hex.length == 7) {
      return hex
    }

    return "#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}"
  }

  private fun getHex(rgb: Int): String {
    return String.format("#%06X", 0xFFFFFF and rgb)
  }

  private fun handleError(promise: Promise, err: Exception) {
    promise.reject("[ImageColors]", err.message, err)
  }

  override fun definition() = ModuleDefinition {
    Name("ImageColors")

    AsyncFunction("getColors") { uri: String, config: Config, promise: Promise ->
      service.launch {
        try {
          val fallbackColor = parseFallbackColor(config.fallback)
          val fallbackColorInt = Color.parseColor(fallbackColor)
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
            val palette = paletteBuilder.generate()

            result["dominant"] = getHex(palette.getDominantColor(fallbackColorInt))
            result["vibrant"] = getHex(palette.getVibrantColor(fallbackColorInt))
            result["darkVibrant"] = getHex(palette.getDarkVibrantColor(fallbackColorInt))
            result["lightVibrant"] = getHex(palette.getLightVibrantColor(fallbackColorInt))
            result["muted"] = getHex(palette.getMutedColor(fallbackColorInt))
            result["darkMuted"] = getHex(palette.getDarkMutedColor(fallbackColorInt))
            result["lightMuted"] = getHex(palette.getLightMutedColor(fallbackColorInt))

            promise.resolve(result)
          } catch (err: Exception) {
            result["dominant"] = fallbackColor
            result["vibrant"] = fallbackColor
            result["darkVibrant"] = fallbackColor
            result["lightVibrant"] = fallbackColor
            result["muted"] = fallbackColor
            result["darkMuted"] = fallbackColor
            result["lightMuted"] = fallbackColor

            promise.resolve(result)
          }
        } catch (err: MalformedURLException) {
          handleError(promise, Exception("Invalid URL"))
        } catch (err: Exception) {
          handleError(promise, err)
        }
      }

      OnDestroy {
        try {
          service.cancel(ModuleDestroyedException())
        } catch (e: IllegalStateException) {
          Log.e("[ImageColors]", "The scope does not have a job in it")
        }
      }
    }
  }
}
