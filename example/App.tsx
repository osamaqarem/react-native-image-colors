import { StyleSheet, Text, View } from 'react-native';

import * as RNImageColors from 'react-native-image-colors';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{RNImageColors.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
