import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import * as Location from 'expo-location';
import { insertLocation, selectAllReadings } from '../lib/db';

const GetLocation = () => {
  const [location, setLocation] = useState(null);

  const requestPermissionsSetLocation = async () => {
    console.log('Request Location Permissions and Setting Current Location...');
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const location = await Location.getCurrentPositionAsync();
      if (location === null) {
        console.log('Location is null');
        return null;
      }
      console.log('Current location updated: ', location);
      const { latitude, longitude } = location.coords;
      await insertLocation(latitude, longitude, location.timestamp);
      await selectAllReadings();
      setLocation(location);
    } else {
      console.log('Location permissions not granted');
    }
  };

  const getCurrentLocation = async () => {
    console.log('Fetching current location...');
    const { status: foregroundStatus } =
      await Location.getForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const location = await Location.getCurrentPositionAsync();
      if (location === null) {
        console.log('Location is null');
        return null;
      }
      const { latitude, longitude } = location.coords;
      await insertLocation(latitude, longitude, location.timestamp);
      await selectAllReadings();
      setLocation(location);
      console.log('Current location updated: ', location);
    } else {
      console.log('Location permissions not granted');
    }
  };

  return (
    <View>
      <Button
        onPress={requestPermissionsSetLocation}
        radius={'lg'}
        containerStyle={{
          margin: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Enable Location Services
        <Icon
          type="ionicon"
          name="earth-outline"
          color="white"
          style={{ marginLeft: 3 }}
        />
      </Button>
      <Button
        onPress={getCurrentLocation}
        radius={"lg"}
        color="secondary"
        containerStyle={{
          margin: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Update Location
      </Button>
    </View>
  );
};

export default GetLocation;
