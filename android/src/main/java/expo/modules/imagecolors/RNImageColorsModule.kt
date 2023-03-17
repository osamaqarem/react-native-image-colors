package expo.modules.imagecolors

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

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

import java.net.URI

class Config : Record {
  @Field
  val defaultColor: String = "#000000"

  @Field
  val headers: Map<String, String>? = null

  @Field
  val pixelSpacing: Int = 5
}

class RNImageColorsModule : Module() {

  /**
   * https://gist.github.com/maxjvh/a6ab15cbba9c82a5065d
   * pixelSpacing tells how many pixels to skip each pixel.
   * If pixelSpacing > 1: the average color is an estimate, but higher values mean better performance.
   * If pixelSpacing == 1: the average color will be the real average.
   * If pixelSpacing < 1: the method will most likely crash (don't use values below 1).
   */
  private fun calculateAverageColor(@NonNull bitmap: Bitmap, pixelSpacing: Int): Int {
    var R = 0
    var G = 0
    var B = 0

    val height: Int = bitmap.height
    val width: Int = bitmap.width

    var n = 0
    val pixels = IntArray(width * height)

    bitmap.getPixels(pixels, 0, width, 0, 0, width, height)

    var i = 0

    while (i < pixels.size) {
      val color = pixels[i]
      R += Color.red(color)
      G += Color.green(color)
      B += Color.blue(color)
      n++
      i += pixelSpacing
    }
    return Color.rgb(R / n, G / n, B / n)
  }

  private fun getHex(rgb: Int): String {
    return String.format("#%06X", 0xFFFFFF and rgb)
  }

  private fun handleError(promise: Promise, err: Exception) {
    GlobalScope.launch(Dispatchers.Main) {
      promise.reject("[RNImageColors] Error", err.message, err)
    }
  }

  override fun definition() = ModuleDefinition {
    Name("RNImageColors")

    AsyncFunction("getColors") { uri: String, config: Config, promise: Promise ->
      try {
        val defaultColorInt = Color.parseColor(config.defaultColor)
        var image: Bitmap? = null

        val context = appContext.reactContext
        val resourceId = context?.resources?.getIdentifier(uri, "drawable", context.packageName) ?: 0

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
            for(header in config.headers) {
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

            result["dominant"] = getHex(palette.getDominantColor(defaultColorInt))
            result["vibrant"] = getHex(palette.getVibrantColor(defaultColorInt))
            result["darkVibrant"] = getHex(palette.getDarkVibrantColor(defaultColorInt))
            result["lightVibrant"] = getHex(palette.getLightVibrantColor(defaultColorInt))
            result["muted"] = getHex(palette.getMutedColor(defaultColorInt))
            result["darkMuted"] = getHex(palette.getDarkMutedColor(defaultColorInt))
            result["lightMuted"] = getHex(palette.getLightMutedColor(defaultColorInt))

            GlobalScope.launch(Dispatchers.Main) {
              promise.resolve(result)
            }
          }
        } catch (err: Exception) {
          result["dominant"] = config.defaultColor
          result["vibrant"] =config.defaultColor
          result["darkVibrant"] = config.defaultColor
          result["lightVibrant"] = config.defaultColor
          result["muted"] = config.defaultColor
          result["darkMuted"] = config.defaultColor
          result["lightMuted"] = config.defaultColor

          GlobalScope.launch(Dispatchers.Main) {
            promise.resolve(result)
          }
        }
      } catch (err: Exception) {
        handleError(promise, err)
      }
    }
  }
}
