'use strict';
// @ts-check

import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { createInitialTables, } from './lib/db';
import GetLocation from './components/GetLocation';

export default function App() {
  useEffect(() => {
    createInitialTables();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text>This app needs this device's location permissions</Text>
        <StatusBar style="auto" />
        <GetLocation />
      </View>
    </SafeAreaProvider>
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
