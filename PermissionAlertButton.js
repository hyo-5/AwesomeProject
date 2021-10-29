import React,{Component}from 'react';
import {PermissionsAndroid,Button,Text,View} from 'react-native';
import Styles from './StyleSheet';

const RequestPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Position Infomation Permission",
            message:"This app needs access to your position infomation ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use this app");
        } else {
        console.log("position infomation permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
};

const PermissionAlertButton = () => (
    <View style ={Styles.permissionButton}>
        <Button title = 'request permissions'
                onPress = {RequestPermission} 
        />
    </View>
);

export default PermissionAlertButton;