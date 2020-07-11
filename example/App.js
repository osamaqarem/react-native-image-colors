import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import ImageColors from 'react-native-image-colors';

const URL = 'https://i.imgur.com/68jyjZT.jpg';

const initialState = {
  colorOne: {value: '', name: ''},
  colorTwo: {value: '', name: ''},
  colorThree: {value: '', name: ''},
  colorFour: {value: '', name: ''},
  rawResult: {value: '', name: ''}
};

export default function App() {
  const [colors, setColors] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      const result = await ImageColors.getColors(URL, {
        dominant: true,
        average: true,
        vibrant: true,
        darkVibrant: true,
        lightVibrant: true,
        darkMuted: true,
        lightMuted: true,
        muted: true,
        defaultColor: '#000000'
      });

      if (result.platform === 'android') {
        setColors({
          colorOne: {value: result.average, name: 'average'},
          colorTwo: {value: result.dominant, name: 'dominant'},
          colorThree: {value: result.vibrant, name: 'vibrant'},
          colorFour: {value: result.darkVibrant, name: 'darkVibrant'},
          rawResult: JSON.stringify(result)
        });
      } else {
        setColors({
          colorOne: {value: result.background, name: 'background'},
          colorTwo: {value: result.detail, name: 'detail'},
          colorThree: {value: result.primary, name: 'primary'},
          colorFour: {value: result.secondary, name: 'secondary'},
          rawResult: JSON.stringify(result)
        });
      }

      setLoading(false);
    };

    fetchColors();
  }, []);

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.loading}>Result:</Text>
        <Text style={styles.result}>{colors.rawResult}</Text>
      </View>
      <Image resizeMode="contain" style={styles.image} source={{uri: URL}} />
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

const Box = props => {
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: props.value
        }
      ]}>
      <Text style={styles.colorName}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250
  },
  colorName: {
    backgroundColor: 'white',
    padding: 4,
    fontSize: 18
  },
  box: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  resultContainer: {
    flex: 1,
    padding: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  result: {
    textAlign: 'center',
    color: '#333333'
  }
});
