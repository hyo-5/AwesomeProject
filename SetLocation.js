import React,{Component,useState,useEffect}from 'react';
import {Image,TouchableOpacity,Alert,View,Text,StyleSheet,PermissionsAndroid,Modal} from 'react-native';
/*import Icon from 'react-native-vector-icons/FontAwesome';*/
import MapView, {PROVIDER_GOOGLE,Region,Marker,MapEvent} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PermissionAlertButton from './PermissionAlertButton';
import ButtonView from './ButtonView';
import CurrentLocation from './SetLocation';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Button } from 'native-base';
import Styles from './StyleSheet';
import { Dimensions } from 'react-native';
/*import CurrentPosition from './CurrentPosition';*/



class App extends Component  {
  constructor(props){
    super(props);
    this.state = {
      region:{
        latitude:0,
        longitude:0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      currentRegion:{
        latitude:0,
        longitude:0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      items:[
        {latitude:33.2421896,longitude:130.2914147},
        {latitude:33.2421000,longitude:130.2914000},
        {latitude:33.2421500,longitude:130.2914500},
      ],
      crosshair:false,
      modalVisible:false,
    };
  }

  /*起動時*/
  async componentDidMount(){
    if(Platform.OS==='ios'){
      this.getCurrentLocation();
    }else{
      try{
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

  /*更新時*/
  /*componentDidUpdate(){
    this.getCurrentLocation();
  }*/

  /*位置情報の取得*/
  getCurrentLocation(){
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.setState({
          region:position.coords
            /*latitude : position.coords.latitude,
            longitude : position.coords.longitude,
            latitudeDelta:position.coords.latitudeDelta,
            longitudeDelta:position.coords.longitudeDelta*/
          ,
          currentRegion:{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
          }          
        })
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  /*マップの中心を追跡*/
  onRegionChangeComplete(region){
    if(this.state.crosshair===true){
      if(region.latitude.toFixed(6) === this.state.region.latitude.toFixed(6)
        && region.longitude.toFixed(6) === this.state.region.longitude.toFixed(6)){
          return;
      }else{
        this.setState({
          region:region
        })
      }
      console.log(region);
    }
  }

  /*クロスヘアと「決定」ボタンを表示*/
  distSetLocation(){
    if(this.state.crosshair===true){
      return(
        <View style={{
          height:'90%',
        }}>
          <View style={{
            marginTop:'75%',
            marginLeft:'45%',
            marginRight:'45%',
          }}>
            <Icon
            style={{
              }}
              type='font-awesome-5'
              name='plus'
            /> 
          </View>         
          <Button 
            style={{
              marginTop:'20%',
              width:'20%',
              alignSelf:'center',
              justifyContent:'center',
            }}
            onPress = {()=>{
              this.setState({
                modalVisible:true,
                crosshair:false,
              })
            }}
          >
            <Text style={{
              color:'#FFF',
            }}>
              決定
            </Text>
          </Button>
        </View>
      )
    }
  }

  /*飲食可能スペースのオプション設定*/
  setOption(){
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.modalVisible}
        >
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
          padding:30,
          marginHorizontal:40,
          borderRadius:20,
          backgroundColor:'white',
          borderWidth:1,
          borderColor:'black',
        }}>
          <Text style={{
            marginBottom: 15,
            textAlign: "center",
          }}>
            オプション選択
          </Text>
          <Button
            style={{
              alignSelf:'center',
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() =>{
              this.setLocation();
            }}
          >
            <Text style={{
              color:'#FFF'
              }}>
              決定
            </Text>
          </Button>
        </View>
      </Modal>
    );
  }

  /*新しいピンを配列に追加する*/
  setLocation(){
    this.setState({
      items:this.state.items.concat({
        latitude:this.state.region.latitude,
        longitude:this.state.region.longitude,
      }),
      modalVisible:false
    })
    /*現在地に戻る*/
    this.getCurrentLocation();
    console.log('success to push!');
  }

  render(){
    /*画面サイズ取得*/
    const {width,height} = Dimensions.get('window');
    const aspectRatio = width/height;
    console.log(aspectRatio);
    const LATITUDE_DELTA = 0.001;
    const LONGITUDE_DELTA = LATITUDE_DELTA*aspectRatio;
    /*変数定義*/
    let items = this.state.items;
    

    return (
      <View 
        style={{
          height:'100%',
          width:'100%',
      }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          /*初期位置を指定*/
          initialRegion={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          /*現在位置を指定*/
          region={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onRegionChangeComplete={(region)=>this.onRegionChangeComplete(region)}
          >
          {/*現在地にピンを設置*/}
          <Marker
            coordinate={{
              latitude: this.state.currentRegion.latitude,
              longitude: this.state.currentRegion.longitude,
            }}>
            <View style={{
              position:'absolute',
              justifyContent: 'center',
              }}>
              {/*ピンの形(現在地)*/}
              <View
                style={{
                  top: 2,
                  width: 30,
                  height: 30,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 30 / 2,
                  backgroundColor: '#FF4F02',
                }}>
                <Icon
                  type="FontAwesome5"
                  name="person"
                  style={{
                    top:-2,
                    color: '###',
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                />
              </View>
            
            </View>
          </Marker>
          {/*飲食可能スペースにピンを設置*/}
          {items.map((item,index) => (
            <Marker
              key={index}
              coordinate={{
                latitude:item.latitude,
                longitude:item.longitude,
              }}
              >
              {/*ピンの形(飲食可能スペース)*/}
              <View style={{
                position:'absolute',
                justifyContent: 'center',
                }}>
                <View
                  style={{
                    top: 0,
                    width: 30,
                    height: 30,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 30 / 2,
                    backgroundColor: '#00FFFF',
                  }}>
                  <Icon
                    type="FontAwesome5"
                    name="lightbulb"
                    style={{
                      top:0,
                      color: 'FF0',
                      textAlign: 'center',
                      fontSize: 10,
                    }}
                  />
                </View>
              </View>
            </Marker>))
          }
        </MapView>
        {/*飲食可能スペース追加ボタン*/}
        <View
          style={{
            height:'10%'
          }}>
          <Button
            style = {{
              marginTop:'5%',
              marginLeft:'80%',
              justifyContent:'center',
              width:'15%',
            }}
            onPress = {()=>{
                this.setState({
                  crosshair:true,
                })
              }}
            >
            <Icon 
              type = 'FontAwesome5'
              name = 'add'
              color = '#FFF'
              style = {{
              }}
            />
          </Button>
        </View>
        {/*ピンを設置する位置指定*/}
        {this.distSetLocation()}
        {/*オプション一覧*/}
        {this.setOption()}
      </View>
    )
  }
}



export default App;

/*
region.latitude.toFixed(6)*/