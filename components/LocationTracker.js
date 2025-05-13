import React, {useEffect, useState} from 'react';
import {Text, View, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from '../utils/geoUtils';
import {sendEmail} from '../utils/mailer';

const HOME_COORDS = {
  latitude: 40.7128, // Replace with your home lat
  longitude: -74.0060, // Replace with your home lng
};

const GEOFENCE_RADIUS = 100; // in meters

let hasExited = false;

export default function LocationTracker() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
    };

    requestPermission();

    const watchId = Geolocation.watchPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setLocation({latitude, longitude});

        const distance = getDistance({latitude, longitude}, HOME_COORDS);

        if (distance > GEOFENCE_RADIUS && !hasExited) {
          hasExited = true;
          sendEmail('Exit', latitude, longitude);
        } else if (distance <= GEOFENCE_RADIUS && hasExited) {
          hasExited = false;
          sendEmail('Return', latitude, longitude);
        }
      },
      error => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <View>
      <Text>Tracking your location...</Text>
      {location && (
        <Text>
          Lat: {location.latitude}, Lng: {location.longitude}
        </Text>
      )}
    </View>
  );
}
