import React from 'react';
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    container:{
        height:'100%',
        width:'100%',
    },
    optionButton:{
      alignSelf:'center',
      borderRadius: 20,
      padding: 10,
      margin:10,
    },
    addButton:{
        position : 'absolute',
        right : '3%',
        top : '1%',
        margin:9,
    },
    center:{
        position:'absolute',
        backgroundColor:'red',
        top:'50%',
        left:'50%',
        borderRadius:100,
    },
    permissionButtonContainer:{
        position : 'absolute',
        justifyContent:'center',
        padding:8,
    }


})

/*下三角形のsample
              <View
                style={{
                  top: -2,
                  width: 0,
                  height: 0,
                  alignSelf: 'center',
                  backgroundColor: 'transparent',
                  borderLeftWidth: 10,
                  borderRightWidth: 10,
                  borderTopWidth: 20,
                  borderBottomWidth: 0,
                  borderTopColor: '#FF4F02',
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                }}
              >
              </View>
              

refPositionButton:{
        position : 'absolute',
        right : '3%',
        top : '1%',
        margin:9,
    }, 


    十字マーク
    <View
            style={{
              top:'100%',
              left:'40%',
              width:10,
              height:10,
            }}>
            <View style={{ backgroundColor: "black", flex: 3 }}/>
          </View>
          <View
            style={{
              top:'100%',
              left:'50%',
              width:'10%',
              height: '10%',
            }}>
            <View style={{ backgroundColor: "black", flex: 3 }}/>
    */
export default Styles;