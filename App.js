import React,{Component,useState,useEffect}from 'react';
import {Image,TouchableOpacity,Switch,View,Text,StyleSheet,PermissionsAndroid,Modal} from 'react-native';
/*import Icon from 'react-native-vector-icons/FontAwesome';*/
import MapView, {PROVIDER_GOOGLE,Region,Marker,Circle,Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PermissionAlertButton from './PermissionAlertButton';
import ButtonView from './ButtonView';
import CurrentLocation from './SetLocation';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Button, Right } from 'native-base';
import Styles from './StyleSheet';
import { Dimensions } from 'react-native';
/*import CurrentPosition from './CurrentPosition';*/
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs,setDoc,addDoc,updateDoc,doc } from 'firebase/firestore/lite';///lite
import { withTheme } from 'react-native-elements';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ04agm9PnU2jbJYFVoOkCTQKXRxRUhAY",
  authDomain: "naviapp-6e2a5.firebaseapp.com",
  projectId: "naviapp-6e2a5",
  storageBucket: "naviapp-6e2a5.appspot.com",
  messagingSenderId: "638234651587",
  appId: "1:638234651587:web:fe906f9d2ae3788a416b76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      
      dataCounter:[{
        inDataCounter:0,
        outDataCounter:0,
        roofDataCounter:0,
        },
      ],
      inItems:[
        { 
          dispMarker:true,
          latitude:33.2415596,
          longitude:130.2883215,
          tableButton:true,
          benchLowButton:false,
          benchMidButton:true,
          benchHighButton:false,
        },
      ],
      outItems:[
        { 
          dispMarker:true,
          latitude:33.2417000,
          longitude:130.2884000,
          tableButton:false,
          benchLowButton:false,
          benchMidButton:true,
          benchHighButton:false,
        },
      ],
      roofItems:[
        { 
          dispMarker:true,
          latitude:33.241300,
          longitude:130.2884100,
          tableButton:false,
          benchLowButton:false,
          benchMidButton:true,
          benchHighButton:false,
        },
      ],
      width:0 ,
      height:0,
      crosshair:false,
      modalVisible:false,
      detailInModal:false,
      detailOutModal:false,
      detailRoofModal:false,
      editMode:false,
      /*オプション*/
      disMarker:true,
      editInMarker:false,
      editOutMarker:false,
      editRoofMarker:false,
      inButton:false,
      outButton:false,
      roofButton:false,
      tableButton:false,
      benchLowButton:false,
      benchMidButton:false,
      benchHighButton:false,


      inModalNumber:0,
      outModalNumber:0,
      roofModalNumber:0,
      /*inDataCounter:1,
      outDataCounter:1,
      roofDataCounter:1,*/
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
    //FirebaseからdataCounterを読み取り
    const dataCounterCol = collection(db,'dataCounter');
    const dataCounterSnapshot = await getDocs(dataCounterCol);
    const dataCounterList = dataCounterSnapshot.docs.map(doc =>doc.data());
    //Firebaseから屋内データの読み取り
    const inDataCol = collection(db,'inData');
    const inDataSnapshot = await getDocs(inDataCol);
    const inDataList = inDataSnapshot.docs.map(doc => doc.data());
    //Firebaseから屋内データの読み取り
    const outDataCol = collection(db,'outData');
    const outDataSnapshot = await getDocs(outDataCol);
    const outDataList = outDataSnapshot.docs.map(doc => doc.data());
    //Firebaseから屋内データの読み取り
    const roofDataCol = collection(db,'roofData');
    const roofDataSnapshot = await getDocs(roofDataCol);
    const roofDataList = roofDataSnapshot.docs.map(doc => doc.data());
    //取ってきたデータを配列に追加
    this.setState({
      dataCounter:dataCounterList,
      inItems:inDataList,
      outItems:outDataList,
      roofItems:roofDataList,
    })
  }
  /*終了時*/
  /*async componentWillUnmount(){
    await updateDoc(doc(db,'dataCounter','counter'),{
      inDataCounter:this.state.dataCounter.inDataCounter,
      outDataCounter:this.state.dataCounter.outDataCounter,
      roofDataCounter:this.state.dataCounter.roofDataCounter,
    })
    console.log("success to update!");
  }*/


  /*更新時*/
  /*componentDidUpdate(){
    this.getLocation();
  }*/

  //Firebaseから飲食可能スペースの情報を取得
  async getLocation(){
    //FirebaseからdataCounterを読み取り
    const dataCounterCol = collection(db,'dataCounter');
    const dataCounterSnapshot = await getDocs(dataCounterCol);
    const dataCounterList = dataCounterSnapshot.docs.map(doc =>doc.data());

    //Firebaseから屋内データの読み取り
    const inDataCol = collection(db,'inData');
    const inDataSnapshot = await getDocs(inDataCol);
    const inDataList = inDataSnapshot.docs.map(doc => doc.data());
    
    //Firebaseから屋内データの読み取り
    const outDataCol = collection(db,'outData');
    const outDataSnapshot = await getDocs(outDataCol);
    const outDataList = outDataSnapshot.docs.map(doc => doc.data());

    //Firebaseから屋内データの読み取り
    const roofDataCol = collection(db,'roofData');
    const roofDataSnapshot = await getDocs(roofDataCol);
    const roofDataList = roofDataSnapshot.docs.map(doc => doc.data());
    //取ってきたデータを配列に追加
    this.setState({
      dataCounter:dataCounterList,
      inItems:inDataList,
      outItems:outDataList,
      roofItems:roofDataList,
      modalVisible:false,
      editMode:false,
      editInMarker:false,
      editOutMarker:false,
      editRoofMarker:false,
      region:{
        latitude:this.state.currentRegion.latitude,
        longitude:this.state.currentRegion.longitude
      }
    })
  }

  /*現在位置情報の取得*/
  getCurrentLocation(){
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.setState({
          region:position.coords,
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
        <View 
          style={{
            position:'absolute',
            height:'100%',
            width:'100%',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
          }}
          >
          <View
            style={{
              position:'absolute',
              justifyContent:'center',
              alignItems:'center',
            }}>
            <Icon
              style={{
                }}
                type='font-awesome-5'
                name='plus'
              /> 
          </View>
          <View
            style={{
              //position:'absolute',
              //justifyContent:'center',
              //alignItems:'center',
              flexDirection:'row',
              marginTop:'80%',
            }}>        
            <Button 
              style={{
                width:'20%',
                alignSelf:'center',
                justifyContent:'center',
                margin:'1%',
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
            <Button 
              style={{
                width:'20%',
                alignSelf:'center',
                justifyContent:'center',
                margin:'1%',
              }}
              onPress = {()=>{
                this.setState({
                  crosshair:false,
                })
              }}
            >
              <Text style={{
                color:'#FFF',
              }}>
                閉じる
              </Text>
            </Button>
          </View>
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
            marginBottom:'20%',
            textAlign:"center",
            fontSize:30,
            textDecorationLine:'underline',
          }}>
            オプション選択
          </Text>
          {/*オプションスイッチ(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Text>
            場所の情報
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
            <Button
              style={Styles.optionButton}
              backgroundColor={
                this.state.editInMarker? '#6495ed':this.state.editMode?"#ffffff":this.state.inButton? "#6495ed" : "#ffffff"
              }
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
              backgroundColor={
                this.state.editOutMarker? '#6495ed':this.state.editMode?"#ffffff":this.state.outButton? "#6495ed" : "#ffffff"
              }
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
              backgroundColor={
                this.state.editRoofMarker?'#6495ed':this.state.editMode?"#ffffff":this.state.roofButton? "#6495ed" : "#ffffff"
              }
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
          </View>
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
          <Text>
              席数
          </Text>
          <View
            style={Styles.numOfSeat}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.benchLowButton? "#6495ed" : "#ffffff"}
              onPress={()=>{
                this.setState({
                  benchLowButton:!this.state.benchLowButton,
                  benchMidButton:false,
                  benchHighButton:false,
                })
              }}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                1~2
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.benchMidButton? "#6495ed" : "#ffffff"}
              onPress={()=>{
                this.setState({
                  benchMidButton:!this.state.benchMidButton,
                  benchLowButton:false,
                  benchHighButton:false,
                })
              }}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                3~4
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.benchHighButton? "#6495ed" : "#ffffff"}
              onPress={()=>{
                this.setState({
                  benchHighButton:!this.state.benchHighButton,
                  benchLowButton:false,
                  benchMidButton:false,
                })
              }}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                5~
              </Text>
            </Button>
          </View>
          {/*決定ボタン*/}
          <View
            style={{
              flexDirection:'row',
            }}>
            <Button
              style={{
                alignSelf:'center',
                borderRadius: 15,
                padding: 10,
                margin:'3%',
              }}
              onPress={() =>{
                if(this.state.editMode===true){
                  this.editMarker();
                }else{
                  this.setLocation();
                }
                this.setState({
                  inButton:false,
                  outButton:false,
                  roofButton:false,
                  tableButton:false,
                  benchLowButton:false,
                  benchHighButton:false,
                  benchMidButton:false,
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
            <Button
              style={{
                alignSelf:'center',
                borderRadius: 15,
                padding: 10,
                margin:'3%'
              }}
              onPress={() =>{
                this.setState({
                  inButton:false,
                  outButton:false,
                  roofButton:false,
                  tableButton:false,
                  benchLowButton:false,
                  benchHighButton:false,
                  benchMidButton:false,
                  modalVisible:false,
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
        </View>
      </Modal>
    );
  }

  /*新しいピンをFirease上の配列に追加*/
  async setLocation(){
    if(this.state.inButton===true){
      await setDoc(doc(db,'inData',String(this.state.dataCounter[0].inDataCounter)),{
        dispMarker:true,
        latitude:this.state.region.latitude,
        longitude:this.state.region.longitude,
        tableButton:this.state.tableButton,
        benchLowButton:this.state.benchLowButton,
        benchMidButton:this.state.benchMidButton,
        benchHighButton:this.state.benchHighButton,
      })
      await updateDoc(doc(db,'dataCounter','counter'),{
        inDataCounter:this.state.dataCounter[0].inDataCounter+1,
      })
    }
    if(this.state.outButton===true){
      await setDoc(doc(db,'outData',String(this.state.dataCounter[0].outDataCounter)),{
        dispMarker:true,
        latitude:this.state.region.latitude,
        longitude:this.state.region.longitude,
        tableButton:this.state.tableButton,
        benchLowButton:this.state.benchLowButton,
        benchMidButton:this.state.benchMidButton,
        benchHighButton:this.state.benchHighButton,
      })
      await updateDoc(doc(db,'dataCounter','counter'),{
        outDataCounter:this.state.dataCounter[0].outDataCounter+1,
      })
    }
    if(this.state.roofButton===true){
      await setDoc(doc(db,'roofData',String(this.state.dataCounter[0].roofDataCounter)),{
        dispMarker:true,
        latitude:this.state.region.latitude,
        longitude:this.state.region.longitude,
        tableButton:this.state.tableButton,
        benchLowButton:this.state.benchLowButton,
        benchMidButton:this.state.benchMidButton,
        benchHighButton:this.state.benchHighButton,
      })
      await updateDoc(doc(db,'dataCounter','counter'),{
        roofDataCounter:this.state.dataCounter[0].roofDataCounter+1,
      })
    }
    console.log('success to push');
    this.getLocation();
  }
  //マーカーを削除
  async delMarker(){
    if(this.state.detailInModal===true){
      await updateDoc(doc(db,'inData',String(this.state.inModalNumber)),{
        dispMarker:false,
      })
    }
    if(this.state.detailOutModal===true){
      await updateDoc(doc(db,'outData',String(this.state.outModalNumber)),{
        dispMarker:false,
      })
    }
    if(this.state.detailRoofModal===true){
      await updateDoc(doc(db,'roofData',String(this.state.roofModalNumber)),{
        dispMarker:false,
      })
    }
    this.getLocation();
  }
  //マーカーを編集
  async editMarker(){
    if(this.state.editInMarker===true){
      await updateDoc(doc(db,'inData',String(this.state.inModalNumber)),{
        tableButton:this.state.tableButton,
        benchLowButton:this.state.benchLowButton,
        benchMidButton:this.state.benchMidButton,
        benchHighButton:this.state.benchHighButton,
      })
    }
    if(this.state.editOutMarker===true){
      await updateDoc(doc(db,'outData',String(this.state.outModalNumber)),{
        tableButton:this.state.tableButton,
        benchLowButton:this.state.benchLowButton,
        benchMidButton:this.state.benchMidButton,
        benchHighButton:this.state.benchHighButton,
      })
    }
    if(this.state.editRoofMarker===true){
      await updateDoc(doc(db,'roofData',String(this.state.roofModalNumber)),{
        tableButton:this.state.tableButton,
        benchLowButton:this.state.benchLowButton,
        benchMidButton:this.state.benchMidButton,
        benchHighButton:this.state.benchHighButton,
      })
    }
    this.getLocation();
  }

  showLocationInfo(){
    return(
      <View
        style={Styles.infoModal}>
        <View>
          <Icon
            color='#1e90ff'
            type="FontAwesome5"
            name="lightbulb"
            style={Styles.iconInfo}/>
          <Text>
            屋内
          </Text>
        </View>
      </View>
    );
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
            fontSize:30,
            textDecorationLine:'underline',
          }}>
            オプション
          </Text>
          {/*オプション表示(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Text>
            場所の情報
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
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
          </View>
          <Text>
            テーブル
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.inItems[this.state.inModalNumber].tableButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                あり
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.inItems[this.state.inModalNumber].tableButton? "#ffffff":"#6495ed" }
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                なし
              </Text>
            </Button>
          </View>
          <Text
            Style={{flexDirection:'row',}}>
            席数
          </Text>
          <View
            style={Styles.numOfSeat}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.inItems[this.state.inModalNumber].benchLowButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                1~2
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.inItems[this.state.inModalNumber].benchMidButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                3~4
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.inItems[this.state.inModalNumber].benchHighButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                5~
              </Text>
            </Button>
          </View>
          {/*閉じるボタン*/}
          <View style={Styles.numOfSeat}>
            <Button
              style={{
                /*alignSelf:'center',*/
                borderRadius: 20,
                padding: 10,
                margin:10,
              }}
              onPress={() =>{
                this.setState({
                  editMode:true,
                  modalVisible:true,
                  detailInModal:false,
                  editInMarker:true,
                  inButton:true,
                  tableButton:this.state.inItems[this.state.inModalNumber].tableButton,
                  benchHighButton:this.state.inItems[this.state.inModalNumber].benchHighButton,
                  benchMidButton:this.state.inItems[this.state.inModalNumber].benchMidButton,
                  benchLowButton:this.state.inItems[this.state.inModalNumber].benchLowButton,
                })
              }}
            >
              <Text 
              style={{
                color:'#FFF'
                }}>
                編集
              </Text>
            </Button>
            <Button
              style={{
                borderRadius: 20,
                padding: 10,
                margin:10,
              }}
              onPress={() =>{
                this.delMarker();
                this.setState({
                  detailInModal:false,
                })
              }}
            >
              <Text 
              style={{
                color:'#FFF'
                }}>
                削除
              </Text>
            </Button>
            <Button
              style={{
                borderRadius: 20,
                padding: 10,
                margin:10,
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
            fontSize:30,
            textDecorationLine:'underline',
          }}>
            オプション
          </Text>
          {/*オプション表示(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Text>
            場所の情報
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
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
          </View>
          <Text>
            テーブル
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.outItems[this.state.outModalNumber].tableButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                あり
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.outItems[this.state.outModalNumber].tableButton? "#ffffff":"#6495ed" }
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                なし
              </Text>
            </Button>
          </View>
          <Text
            Style={{flexDirection:'row',}}>
            席数
          </Text>
          <View style={Styles.numOfSeat}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.outItems[this.state.outModalNumber].benchLowButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                1~2
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.outItems[this.state.outModalNumber].benchMidButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                3~4
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.outItems[this.state.outModalNumber].benchHighButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                5~
              </Text>
            </Button>
          </View>
          {/*閉じるボタン*/}
          <View style={Styles.numOfSeat}>
            <Button
              style={{
                /*alignSelf:'center',*/
                borderRadius: 20,
                padding: 10,
                margin:10,
              }}
              onPress={() =>{
                this.setState({
                  editMode:true,
                  modalVisible:true,
                  editOutMarker:true,
                  detailOutModal:false,
                  tableButton:this.state.outItems[this.state.outModalNumber].tableButton,
                  benchHighButton:this.state.outItems[this.state.outModalNumber].benchHighButton,
                  benchMidButton:this.state.outItems[this.state.outModalNumber].benchMidButton,
                  benchLowButton:this.state.outItems[this.state.outModalNumber].benchLowButton,
                })
              }}
            >
              <Text 
              style={{
                color:'#FFF'
                }}>
                編集
              </Text>
            </Button>
            <Button
              style={{
                borderRadius: 20,
                padding: 10,
                margin:10,
              }}
              onPress={() =>{
                this.delMarker();
                this.setState({
                  detailOutModal:false,
                })
              }}
            >
              <Text 
              style={{
                color:'#FFF'
                }}>
                削除
              </Text>
            </Button>
            <Button
              style={{
                borderRadius: 20,
                padding: 10,
                margin:10,
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
            fontSize:30,
            textDecorationLine:'underline',
          }}>
            オプション
          </Text>
          {/*オプション表示(屋内,屋外,屋外(屋根付き),テーブル,ベンチ,コメント,)*/}
          <Text>
            場所の情報
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
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
          </View>
          <Text>
            テーブル
          </Text>
          <View
            style={{
              flexDirection:'row',
            }}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.roofItems[this.state.roofModalNumber].tableButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                あり
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.roofItems[this.state.roofModalNumber].tableButton? "#ffffff":"#6495ed" }
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                なし
              </Text>
            </Button>
          </View>
          <Text
            Style={{flexDirection:'row',}}>
            席数
          </Text>
          <View style={Styles.numOfSeat}>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.roofItems[this.state.roofModalNumber].benchLowButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                1~2
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.roofItems[this.state.roofModalNumber].benchMidButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                3~4
              </Text>
            </Button>
            <Button
              style={Styles.optionButton}
              backgroundColor={this.state.roofItems[this.state.roofModalNumber].benchHighButton? "#6495ed" : "#ffffff"}
              >
              <Text
                Style={{
                  color:"#000"
                }}>
                5~
              </Text>
            </Button>
          </View>
          {/*閉じるボタン*/}
          <View style={Styles.numOfSeat}>
            <Button
              style={{
                /*alignSelf:'center',*/
                borderRadius: 20,
                padding: 10,
                margin:10,
              }}
              onPress={() =>{
                this.setState({
                  editMode:true,
                  modalVisible:true,
                  editRoofMarker:true,
                  detailRoofModal:false,
                  tableButton:this.state.roofItems[this.state.roofModalNumber].tableButton,
                  benchHighButton:this.state.roofItems[this.state.roofModalNumber].benchHighButton,
                  benchMidButton:this.state.roofItems[this.state.roofModalNumber].benchMidButton,
                  benchLowButton:this.state.roofItems[this.state.roofModalNumber].benchLowButton,
                })
              }}
            >
              <Text 
              style={{
                color:'#FFF'
                }}>
                編集
              </Text>
            </Button>
            <Button
              style={{
                borderRadius: 20,
                padding: 10,
                margin:10,
              }}
              onPress={() =>{
                this.delMarker();
                this.setState({
                  detailRoofModal:false,
                })
              }}
            >
              <Text 
              style={{
                color:'#FFF'
                }}>
                削除
              </Text>
            </Button>
            <Button
              style={{
                borderRadius: 20,
                padding: 10,
                margin:10,
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
        </View>
      </Modal>
    );
  }
  //配列のマーカーを設置(circle)
  showCircle(item,index,color){
    return(
      <View>
        <Circle
          center={{
            latitude:item.latitude,
            longitude:item.longitude,
          }}//中心の座標
          radius={10}//円の半径(m)
          fillColor={color}//ストロークの色
        />
        {this.showInMarker(item,index)} 
      </View>
    );
  }
  //配列のマーカーを設置(ピン＆屋内ver)
  showInMarker(item,index){
    return(
      <Marker
        key={index}
        coordinate={{
          latitude:item.latitude,
          longitude:item.longitude,
        }}
        >
        {/*ピンの形(飲食可能スペース)*/}
        <View style={Styles.centerOfScreen}>
          <View
            style={Styles.iconBackground}>
            <Icon
              color='#1e90ff'
              type="FontAwesome5"
              name="lightbulb"
              style={Styles.icon}
            />
          </View>
          <View
            style={Styles.invertedTriangle}
          >
          </View>
        </View>
        {/**コールアウト */}
        <Callout tooltip
          onPress={()=>{
            this.setState({
              inModalNumber:index,
              detailInModal:true,
            })
          }}>
          <View style={Styles.bubble}>
            <View style={Styles.nameFloat}>
              <Text style={Styles.name}>
                テーブル：
              </Text>
              <Text style={Styles.name}>
                {item.tableButton? "あり":"なし"}
              </Text>
            </View>
            <View style={Styles.nameFloat}>
              <Text style={Styles.name}>
                イス：
              </Text>
              <Text style={Styles.name}>
                {item.benchLowButton? "1~2":""}
                {item.benchMidButton? "3~4":""}
                {item.benchHighButton? "5~":""}
              </Text>
            </View>
          </View>
        </Callout>
      </Marker>
    )
  }
  showOutMarker(item,index){
    <Marker
      key={index}
      coordinate={{
      latitude:item.latitude,
      longitude:item.longitude,
      }}
    >
      {/*ピンの形(飲食可能スペース)*/}
      <View style={Styles.centerOfScreen}>
        <View
          style={Styles.iconBackground}>
          <Icon
            color='yellow'
            type="FontAwesome5"
            name="lightbulb"
            style={Styles.icon}
          />
        </View>
      </View>
      {/**コールアウト */}
      <Callout tooltip
        onPress={()=>{
          this.setState({
            outModalNumber:index,
            detailOutModal:true,
          })
        }}>
        <View style={Styles.bubble}>
          <View style={Styles.nameFloat}>
            <Text style={Styles.name}>
              テーブル：
            </Text>
            <Text style={Styles.name}>
              {this.state.outItems[this.state.outModalNumber].tableButton? "あり":"なし"}
            </Text>
          </View>
          <View style={Styles.nameFloat}>
            <Text style={Styles.name}>
              イス：
            </Text>
            <Text style={Styles.name}>
              {item.benchLowButton? "1~2":""}
              {item.benchMidButton? "3~4":""}
              {item.benchHighButton? "5~":""}
            </Text>
          </View>
          <View style={{
            textAlign:'right',
          }}>
            <Text>
              詳細
            </Text>
          </View>
        </View>
      </Callout>
    </Marker>
  }

  render(){
    /*stateが変更された確認*/
    console.log('State changed!');
    console.log(this.state.inItems);
    console.log(this.state.outItems);
    console.log(this.state.roofItems);
    console.log(this.state.detailInModal);
    console.log(this.state.detailOutModal);
    console.log(this.state.detailRoofModal);
    console.log(this.state.dataCounter);

    /*画面サイズ取得*/
    const {width,height} = Dimensions.get('window');
    const aspectRatio = width/height;
    /*画面サイズの確認*/
    /*console.log(aspectRatio);*/
    const LATITUDE_DELTA = 0.001;
    const LONGITUDE_DELTA = LATITUDE_DELTA*aspectRatio;

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
            <View style={Styles.centerOfScreen}>
              {/*ピンの形(現在地)*/}
              <View
                style={{
                  top: 1,
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
          {this.state.inItems.map((item,index)=>{
            if(this.state.inItems[index].dispMarker===true){
              return(
                <Marker
                  key={index}
                  coordinate={{
                    latitude:item.latitude,
                    longitude:item.longitude,
                  }}
                  >
                  {/*ピンの形(飲食可能スペース)*/}
                  <View style={Styles.centerOfScreen}>
                    <View
                      style={Styles.iconBackground}>
                      <Icon
                        color='#1e90ff'
                        type="FontAwesome5"
                        name="lightbulb"
                        style={Styles.icon}
                      />
                    </View>
                    <View
                      style={Styles.invertedTriangle}
                    >
                    </View>
                  </View>
                  {/**コールアウト */}
                  <Callout tooltip
                    onPress={()=>{
                      this.setState({
                        inModalNumber:index,
                        detailInModal:true,
                      })
                    }}>
                    <View style={Styles.bubble}>
                      <View style={Styles.nameFloat}>
                        <Text style={Styles.name}>
                          テーブル：
                        </Text>
                        <Text style={Styles.name}>
                          {item.tableButton? "あり":"なし"}
                        </Text>
                      </View>
                      <View style={Styles.nameFloat}>
                        <Text style={Styles.name}>
                          イス：
                        </Text>
                        <Text style={Styles.name}>
                          {item.benchLowButton? "1~2":""}
                          {item.benchMidButton? "3~4":""}
                          {item.benchHighButton? "5~":""}
                        </Text>
                      </View>
                      <View>
                        <Text style={{
                          fontSize:13,
                          textAlign:'right',
                        }}>
                          詳細...
                        </Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              
              )
            }
          })}
          {this.state.outItems.map((item,index)=>{
            if(this.state.outItems[index].dispMarker===true){
              return(  
                <Marker
                  key={index}
                  coordinate={{
                  latitude:item.latitude,
                  longitude:item.longitude,
                  }}
                >
                {/*ピンの形(飲食可能スペース)*/}
                <View style={Styles.centerOfScreen}>
                  <View
                    style={Styles.iconBackground}>
                    <Icon
                      color='yellow'
                      type="FontAwesome5"
                      name="lightbulb"
                      style={Styles.icon}
                    />
                  </View>
                  <View
                      style={Styles.invertedTriangle}
                    />
                </View>
                {/**コールアウト */}
                <Callout tooltip
                  onPress={()=>{
                    this.setState({
                      outModalNumber:index,
                      detailOutModal:true,
                    })
                  }}>
                  <View style={Styles.bubble}>
                    <View style={Styles.nameFloat}>
                      <Text style={Styles.name}>
                        テーブル：
                      </Text>
                      <Text style={Styles.name}>
                        {item.tableButton? "あり":"なし"}
                      </Text>
                    </View>
                    <View style={Styles.nameFloat}>
                      <Text style={Styles.name}>
                        イス：
                      </Text>
                      <Text style={Styles.name}>
                        {item.benchLowButton? "1~2":""}
                        {item.benchMidButton? "3~4":""}
                        {item.benchHighButton? "5~":""}
                      </Text>
                    </View>
                    <View>
                        <Text style={{
                          fontSize:13,
                          textAlign:'right',
                        }}>
                          詳細...
                        </Text>
                      </View>
                  </View>
                </Callout>
              </Marker>
              )
            }
          })}
          {this.state.roofItems.map((item,index)=>{
            if(this.state.roofItems[index].dispMarker===true){
              return(  
                <Marker
                  key={index}
                  coordinate={{
                  latitude:item.latitude,
                  longitude:item.longitude,
                  }}
                >
                {/*ピンの形(飲食可能スペース)*/}
                <View style={Styles.centerOfScreen}>
                  <View
                    style={Styles.iconBackground}>
                    <Icon
                      color='magenta'
                      type="FontAwesome5"
                      name="lightbulb"
                      style={Styles.icon}
                    />
                  </View>
                  <View
                      style={Styles.invertedTriangle}
                    />
                </View>
                {/**コールアウト */}
                <Callout tooltip
                  onPress={()=>{
                    this.setState({
                      roofModalNumber:index,
                      detailRoofModal:true,
                    })
                  }}>
                  <View style={Styles.bubble}>
                    <View style={Styles.nameFloat}>
                      <Text style={Styles.name}>
                        テーブル：
                      </Text>
                      <Text style={Styles.name}>
                        {item.tableButton? "あり":"なし"}
                      </Text>
                    </View>
                    <View style={Styles.nameFloat}>
                      <Text style={Styles.name}>
                        イス：
                      </Text>
                      <Text style={Styles.name}>
                        {item.benchLowButton? "1~2":""}
                        {item.benchMidButton? "3~4":""}
                        {item.benchHighButton? "5~":""}
                      </Text>
                    </View>
                    <View>
                        <Text style={{
                          fontSize:13,
                          textAlign:'right',
                        }}>
                          詳細...
                        </Text>
                      </View>
                  </View>
                </Callout>
              </Marker>
              )
            }
          })}
        </MapView>
        {/*飲食可能スペース追加ボタン*/}
        <View
          style={{
            flexDirection:'row',
            justifyContent:'space-between',
          }}>
          <View
            style={Styles.infoModal}>
            <View
              style={{
                flexDirection:'row',
                alignItems:'center',
                margin:'1%',
              }}>
              <View
                style={Styles.currentIconBackground}
                >
                <Icon
                  color='black'
                  type="FontAwesome5"
                  name="person"
                  style={Styles.iconInfo}
                />
              </View>
              <Text>
                現在地
              </Text>
            </View>
            <View
              style={{
                flexDirection:'row',
                alignItems:'center',
                margin:'1%',
              }}>
              <View
                style={Styles.iconBackground}
                >
                <Icon
                  color='#1e90ff'
                  type="FontAwesome5"
                  name="lightbulb"
                  style={Styles.iconInfo}
                />
              </View>
              <Text>
                屋内
              </Text>
            </View>
            <View
              style={{
                flexDirection:'row',
                alignItems:'center',
                margin:'1%',
              }}>
              <View
                style={Styles.iconBackground}
                >
                <Icon
                  color='yellow'
                  type="FontAwesome5"
                  name="lightbulb"
                  style={Styles.iconInfo}
                />
              </View>
              <Text>
                屋外
              </Text>
            </View>
            <View
              style={{
                flexDirection:'row',
                alignItems:'center',
                margin:'1%',
              }}>
              <View
                style={Styles.iconBackground}
                >
                <Icon
                  color='magenta'
                  type="FontAwesome5"
                  name="lightbulb"
                  style={Styles.iconInfo}
                />
              </View>
              <Text>
                屋外(屋根)
              </Text>
            </View>
          </View>
            <Button
              style = {{
                marginTop:'5%',
                marginRight:'5%',
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
          
        
        {/**現在地更新ボタン */}
        <View
          Style={{
            //position:'absolute',
            //width:'100%',
            //height:'100%',
            justifyContent:'center',
            alignItems:'center',
          }}>
          <Button
            style = {{
              marginTop:'140%',
              marginLeft:'65%',
              width:'30%',
              justifyContent:'center',
              alignItems:'center',
              backgroundColor:'#FF7F50',
            }}
            onPress = {()=>{
                this.getCurrentLocation()
              }}
            >
            <Text>
              現在地更新
            </Text>
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