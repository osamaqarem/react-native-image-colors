import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import { getColors } from 'react-native-image-colors';

const yunaUrl = 'https://i.imgur.com/68jyjZT.jpg';
const catUrl = 'https://i.imgur.com/O3XSdU7.jpg';
const catImg = require('./assets/cat.jpg');

const initialState = {
  colorOne: { value: '', name: '' },
  colorTwo: { value: '', name: '' },
  colorThree: { value: '', name: '' },
  colorFour: { value: '', name: '' },
  rawResult: '',
};

export default function App() {
  const [colors, setColors] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      const result = await getColors(yunaUrl, {
        fallbackColor: '#000000',
        pixelSpacing: 5,
      });

      switch (result.platform) {
        case 'android':
        case 'web':
          setColors({
            colorOne: { value: result.lightVibrant, name: 'lightVibrant' },
            colorTwo: { value: result.dominant, name: 'dominant' },
            colorThree: { value: result.vibrant, name: 'vibrant' },
            colorFour: { value: result.darkVibrant, name: 'darkVibrant' },
            rawResult: JSON.stringify(result),
          });
          break;
        case 'ios':
          setColors({
            colorOne: { value: result.background, name: 'background' },
            colorTwo: { value: result.detail, name: 'detail' },
            colorThree: { value: result.primary, name: 'primary' },
            colorFour: { value: result.secondary, name: 'secondary' },
            rawResult: JSON.stringify(result),
          });
          break;
        default:
          throw new Error('Unexpected platform');
      }

      setLoading(false);
    };

    fetchColors();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.resultContainer}>
        <Text style={styles.loading}>Result:</Text>
        <Text style={styles.result}>{colors.rawResult}</Text>
      </SafeAreaView>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={{ uri: yunaUrl }}
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
  );
}

interface BoxProps {
  value: string;
  name: string;
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
  );
};

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
    width: Platform.select({
      web: 'fill-available',
      ios: '100%',
      android: '100%',
    }),
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
});
