import * as DocumentPicker from 'expo-document-picker'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { getColors } from 'react-native-image-colors'

const yunaUrl = 'https://i.imgur.com/68jyjZT.jpg'
// const catUrl = 'https://i.imgur.com/O3XSdU7.jpg'
// const catImg = require('../assets/cat.jpg')

// 120x120 SVG: dark background (#1B1B3A), red/orange/navy circles, teal bar
// const base64Image =
//   'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiMxQjFCM0EiLz4KICA8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSIyNSIgZmlsbD0iI0U5NDU2MCIvPgogIDxjaXJjbGUgY3g9Ijg1IiBjeT0iNDAiIHI9IjI1IiBmaWxsPSIjRjVBNjIzIi8+CiAgPGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMjUiIGZpbGw9IiMwRjM0NjAiLz4KICA8cmVjdCB4PSIxMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEyIiByeD0iNiIgZmlsbD0iIzE2Qzc5QSIvPgo8L3N2Zz4='

const initialState = {
  colorOne: { value: '', name: '' },
  colorTwo: { value: '', name: '' },
  colorThree: { value: '', name: '' },
  colorFour: { value: '', name: '' },
  rawResult: '',
}

export default function Page() {
  const [imageUrl, setImageUrl] = useState(yunaUrl)
  const [colors, setColors] = useState(initialState)
  const [loading, setLoading] = useState(true)

  const fetchColors = async (imageUrl: string) => {
    const result = await getColors(imageUrl, {
      fallback: '#000000',
      pixelSpacing: 5,
    })
    switch (result.platform) {
      case 'android':
      case 'web':
        setColors({
          colorOne: { value: result.lightVibrant, name: 'lightVibrant' },
          colorTwo: { value: result.dominant, name: 'dominant' },
          colorThree: { value: result.vibrant, name: 'vibrant' },
          colorFour: { value: result.darkVibrant, name: 'darkVibrant' },
          rawResult: JSON.stringify(result),
        })
        break
      case 'ios':
        setColors({
          colorOne: { value: result.background, name: 'background' },
          colorTwo: { value: result.detail, name: 'detail' },
          colorThree: { value: result.primary, name: 'primary' },
          colorFour: { value: result.secondary, name: 'secondary' },
          rawResult: JSON.stringify(result),
        })
        break
      default:
        throw new Error('Unexpected platform')
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchColors(imageUrl)
  }, [])

  const selectImage = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: false,
    })
    if (res.canceled) return
    setImageUrl(res.assets?.[0].uri || '')
    fetchColors(res.assets?.[0].uri || '')
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.resultContainer}>
        {Platform.OS === 'android' && (
          <Button
            title="Select Image"
            onPress={() => {
              selectImage()
            }}
          />
        )}

        <Text style={styles.loading}>Result:</Text>
        <Text style={styles.result}>{colors.rawResult}</Text>
      </SafeAreaView>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={{ uri: imageUrl }}
      />
      <View style={styles.row}>
        <Box name={colors.colorOne.name} value={colors.colorOne.value} />
        <Box name={colors.colorTwo.name} value={colors.colorTwo.value} />
      </View>
      <View style={styles.row}>
        <Box name={colors.colorThree.name} value={colors.colorThree.value} />
        <Box name={colors.colorFour.name} value={colors.colorFour.value} />
      </View>
    </View>
  )
}

interface BoxProps {
  value: string
  name: string
}

const Box = ({ value, name }: BoxProps) => {
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: value,
        },
      ]}
    >
      <Text style={styles.colorName}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
  },
  colorName: {
    backgroundColor: 'white',
    padding: 4,
    fontSize: 18,
  },
  box: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  result: {
    textAlign: 'center',
    color: '#333333',
  },
})
