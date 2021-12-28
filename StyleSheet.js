import React from 'react';
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    container:{
        height:'100%',
        width:'100%',
    },
    centerOfScreen:{
      position:'absolute',
      justifyContent: 'center',
    },
    iconBackground:{
      top:0,
      bottom:0,
      width: 30,
      height: 30,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 30 / 2,
      backgroundColor: '#00FFFF',
    },
    currentIconBackground:{
      top:0,
      bottom:0,
      width: 30,
      height: 30,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 30 / 2,
      backgroundColor: '#FF4F02',
    },
    
    icon:{
        top:0,
        textAlign: 'center',
        fontSize: 5,
    },
    iconInfo:{
      top:0,
      fontSize: 5,
  },
    invertedTriangle:{
      top: -4,
      width: 0,
      height: 1,
      alignSelf: 'center',
      backgroundColor: 'transparent',
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 8,
      borderBottomWidth: -20,
      borderTopColor: '#00FFFF',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    optionButton:{
      alignSelf:'center',
      borderRadius: 20,
      padding: 10,
      margin:10,
    },
    optionButton1:{
      flexDirection:'row',
      borderRadius: 20,
      padding: 10,
      margin:10,
    },
    numOfSeat:{
      flexDirection:'row',
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
    },
    bubble:{
      flexDirection:'row',
      alignSelf:'flex-start',
      backgroundColor:'#fff',
      borderRadius:6,
      borderColor:'#ccc',
      borderWidth:0.5,
      padding:15,
      width:150,
      flexDirection:'column',
    },
    name:{
      fontSize:16,
      marginBottom:5,
    },
    nameFloat:{
      flexDirection:'row',
      fontSize:16,
      marginBottom:5,
    },
    invertedTriangle1:{
      top: -4,
      width: 0,
      height: 1,
      alignSelf: 'center',
      backgroundColor: 'transparent',
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 8,
      borderBottomWidth: -20,
      borderTopColor: '#FF4F02',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    infoModal:{
      marginTop:'1%',
      marginLeft:'1%',
      padding:'1%',
      borderRadius:20,
      backgroundColor:'white',
      borderWidth:1,
      borderColor:'black',
    },

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