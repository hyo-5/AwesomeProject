import React,{Component,useState,useEffect}from 'react';
import {Image,TouchableOpacity,Switch,View,Text,StyleSheet,PermissionsAndroid,Modal} from 'react-native';
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
      
      inItems:[
        { 
          //id:0,//変更点
          latitude:33.2415596,
          longitude:130.2883215,
          tableButton:true,
          benchButton:false,
        },
      ],
      outItems:[
        { 
          latitude:33.2417000,
          longitude:130.2884000,
          tableButton:false,
          benchButton:true,
        },
      ],
      roofItems:[
        { 
          //id:0,//変更点
          latitude:33.241300,
          longitude:130.2884100,
          tableButton:false,
          benchButton:true,
        },
      ],

      //roofId:1,
      //inId:3,
      //outId:1,//変更点

      crosshair:false,
      modalVisible:false,
      detailInModal:false,
      detailOutModal:false,
      detailRoofModal:false,
      /*オプション*/
      inButton:false,
      outButton:false,
      roofButton:false,
      tableButton:false,
      benchButton:false,

      inModalNumber:0,
      outModalNumber:0,
      roofModalNumber:0,
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
        <View 
          style={{
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
          {/*オプションスイッチ(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.inButton? "#6495ed" : "#ffffff"}
            onPress={()=>{
              this.setState({
                inButton:!this.state.inButton,
                outButton:false,
                roofButton:false,
              })
            }}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋内
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.outButton? "#6495ed" : "#ffffff"}
            onPress={()=>{
              this.setState({
                outButton:!this.state.outButton,
                inButton:false,
                roofButton:false,
              })
            }}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.roofButton? "#6495ed" : "#ffffff"}
            onPress={()=>{
              this.setState({
                roofButton:!this.state.roofButton,
                inButton:false,
                outButton:false,
              })
            }}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外(屋根あり)
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.tableButton? "#6495ed" : "#ffffff"}
            onPress={()=>{
              this.setState({
                tableButton:!this.state.tableButton,
              })
            }}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              テーブル
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.benchButton? "#6495ed" : "#ffffff"}
            onPress={()=>{
              this.setState({
                benchButton:!this.state.benchButton,
              })
            }}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              ベンチ
            </Text>
          </Button>
          {/*決定ボタン*/}
          <Button
            style={{
              alignSelf:'center',
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() =>{
              this.setLocation();
              this.setState({
                inButton:false,
                outButton:false,
                roofButton:false,
                tableButton:false,
                benchButton:false,
              })
            }}
          >
            <Text 
            style={{
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
    if(this.state.inButton===true){
      this.setState({
        inItems:this.state.inItems.concat({
          latitude:this.state.region.latitude,
          longitude:this.state.region.longitude,
          tableButton:this.state.tableButton,
          benchButton:this.state.benchButton,
        }),
        modalVisible:false
      })
    }
    if(this.state.outButton===true){
      this.setState({
        outItems:this.state.outItems.concat({
          latitude:this.state.region.latitude,
          longitude:this.state.region.longitude,
          tableButton:this.state.tableButton,
          benchButton:this.state.benchButton,
        }),
        modalVisible:false
      })
    }
    console.log(this.state.outItems)
    if(this.state.roofButton===true){
      this.setState({
        roofItems:this.state.roofItems.concat({
          latitude:this.state.region.latitude,
          longitude:this.state.region.longitude,
          tableButton:this.state.tableButton,
          benchButton:this.state.benchButton,
        }),
        modalVisible:false
      })
    }

    this.setState({
      region:{
        latitude:this.state.currentRegion.latitude,
        longitude:this.state.currentRegion.longitude
      }
    })

    /*現在地に戻る*/
    /*this.getCurrentLocation();*/
    console.log('success to push!');
  }

  /*飲食可能スペースの詳細を表示*/
  showDetailInModal(){
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.detailInModal}
        >
        <View 
          style={{
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
            オプション
          </Text>
          {/*オプション表示(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Button
            style={Styles.optionButton}
            backgroundColor="#6495ed"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋内
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor="#ffffff"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor="#ffffff"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外(屋根あり)
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.inItems[this.state.inModalNumber].tableButton? "#6495ed" : "#ffffff"}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              テーブル
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.inItems[this.state.inModalNumber].benchButton? "#6495ed" : "#ffffff"}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              ベンチ
            </Text>
          </Button>
          {/*閉じるボタン*/}
          <Button
            style={{
              alignSelf:'center',
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() =>{
              this.setState({
                detailInModal:false
              })
            }}
          >
            <Text 
            style={{
              color:'#FFF'
              }}>
              閉じる
            </Text>
          </Button>
        </View>
      </Modal>
    );
  }
  showDetailOutModal(){
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.detailOutModal}
        >
        <View 
          style={{
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
            オプション
          </Text>
          {/*オプション表示(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Button
            style={Styles.optionButton}
            backgroundColor="#ffffff"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋内
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor="#6495ed"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor="#ffffff"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外(屋根あり)
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.outItems[this.state.outModalNumber].tableButton? "#6495ed" : "#ffffff"}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              テーブル
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.outItems[this.state.outModalNumber].benchButton? "#6495ed" : "#ffffff"}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              ベンチ
            </Text>
          </Button>
          {/*閉じるボタン*/}
          <Button
            style={{
              alignSelf:'center',
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() =>{
              this.setState({
                detailOutModal:false
              })
            }}
          >
            <Text 
            style={{
              color:'#FFF'
              }}>
              閉じる
            </Text>
          </Button>
        </View>
      </Modal>
    );
  }
  showDetailRoofModal(){
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.detailRoofModal}
        >
        <View 
          style={{
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
            オプション
          </Text>
          {/*オプション表示(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Button
            style={Styles.optionButton}
            backgroundColor="#ffffff"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋内
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor="#ffffff"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor="#6495ed"
            >
            <Text
              Style={{
                color:"#000"
              }}>
              屋外(屋根あり)
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.roofItems[this.state.roofModalNumber].tableButton? "#6495ed" : "#ffffff"}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              テーブル
            </Text>
          </Button>
          <Button
            style={Styles.optionButton}
            backgroundColor={this.state.roofItems[this.state.roofModalNumber].benchButton? "#6495ed" : "#ffffff"}
            >
            <Text
              Style={{
                color:"#000"
              }}>
              ベンチ
            </Text>
          </Button>
          {/*閉じるボタン*/}
          <Button
            style={{
              alignSelf:'center',
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() =>{
              this.setState({
                detailRoofModal:false
              })
            }}
          >
            <Text 
            style={{
              color:'#FFF'
              }}>
              閉じる
            </Text>
          </Button>
        </View>
      </Modal>
    );
  }
  

  render(){
    /*stateが変更された確認*/
    console.log('State changed!');
    /*画面サイズ取得*/
    const {width,height} = Dimensions.get('window');
    const aspectRatio = width/height;
    /*画面サイズの確認*/
    /*console.log(aspectRatio);*/
    const LATITUDE_DELTA = 0.001;
    const LONGITUDE_DELTA = LATITUDE_DELTA*aspectRatio;
    /*変数定義*/

    console.log(this.state.inItems);
    console.log(this.state.outItems);
    console.log(this.state.roofItems);
    console.log(this.state.modalNumber);
    console.log(this.state.detailInModal);
    console.log(this.state.detailOutModal);
    console.log(this.state.detailRoofModal);

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
          {/*配列の飲食可能スペースのピンを設置*/}
          {this.state.inItems.map((item,index)=>(
            console.log('in'),
            <Marker
            key={index}
            coordinate={{
              latitude:item.latitude,
              longitude:item.longitude,
            }}
            onPress={()=>{
              this.setState({
                inModalNumber:index,
                detailInModal:true,
              })
            }}
            >
            {/*ピンの形(飲食可能スペース)*/}
            <View style={{
              position:'absolute',
              justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor:'FFF',
                  top: 0,
                  width: 30,
                  height: 30,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 30 / 2,
                  backgroundColor: '#00FFFF',
                }}>
                <Icon
                  color='#1e90ff'
                  type="FontAwesome5"
                  name="lightbulb"
                  style={{
                    top:0,
                    color:'###',
                    textAlign: 'center',
                    fontSize: 10,
                  }}
                />
              </View>
            </View>
          </Marker>
          ))}
          {this.state.outItems.map((item,index)=>(
            console.log('out'),
            <Marker
            key={index}
            coordinate={{
              latitude:item.latitude,
              longitude:item.longitude,
            }}
            onPress={()=>{
              this.setState({
                outModalNumber:index,
                detailOutModal:true,
              })
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
                  color='yellow'
                  type="FontAwesome5"
                  name="lightbulb"
                  style={{
                    top:0,
                    textAlign: 'center',
                    fontSize: 10,
                  }}
                />
              </View>
            </View>
          </Marker>
          ))}
          {this.state.roofItems.map((item,index)=>(
            console.log('roof'),
            <Marker
            key={index}
            coordinate={{
              latitude:item.latitude,
              longitude:item.longitude,
            }}
            onPress={()=>{
              this.setState({
                roofModalNumber:index,
                detailRoofModal:true,
              })
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
                  color='magenta'
                  type="FontAwesome5"
                  name="lightbulb"
                  style={{
                    top:0,
                    color: 'F00',
                    textAlign: 'center',
                    fontSize: 10,
                  }}
                />
              </View>
            </View>
          </Marker>
          ))}
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
        {/*飲食可能スペースの詳細*/}
        {this.showDetailInModal()}
        {this.showDetailOutModal()}
        {this.showDetailRoofModal()}
      </View>
    )
  }
}



export default App;