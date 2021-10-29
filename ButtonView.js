import React from'react';
import {StyleSheet} from 'react-native';
import {View,Button,Icon} from 'native-base';
import { Alert } from 'react-native';
import Styles from './StyleSheet';

ButtonView = () =>{
    return(
        <View style = {Styles.container}>
            <Button
                style = {Styles.addButton} 
                onPress = {()=>
                    /*{getCurrentLocation()}*/
                    Alert.alert('addButton Pressed!')}
                >
                <Icon 
                    type = 'FontAwesome5'
                    name = 'plus'
                    
                />
            </Button>
        </View>
    )
}


export default ButtonView;
