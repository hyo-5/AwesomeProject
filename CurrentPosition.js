import React from 'react';
import Geeolocation,{GeolocationResponse} from '@react-native-community/geolocation';

import Geolocation from 'react-native-geolocation-service';

async componentDidMount() {
 if(Platform.OS === 'ios'){
      this.getCurrentLocation();
    }else{
      try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
         {
           title: 'Device current location permission',
           message:
             'Allow app to get your current location',
           buttonNeutral: 'Ask Me Later',
           buttonNegative: 'Cancel',
           buttonPositive: 'OK',
         },
       );
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         this.getCurrentLocation();
       } else {
         console.log('Location permission denied');
       }
     } catch (err) {
       console.warn(err);
     }
    }
}

getCurrentLocation(){
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
       (position) => {
           console.log(position);
       },
       (error) => {
         console.log("map error: ",error);
           console.log(error.code, error.message);
       },
       { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
   );
  }