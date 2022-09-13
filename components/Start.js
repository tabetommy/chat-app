import React from 'react';
import { View,Button, StyleSheet, TextInput,Image,
        Text,ImageBackground,TouchableOpacity} from 'react-native';
import bckImg from '../assets/Background-Image.png';
import userImg from '../assets/user.png';

// #B9C6AE

export default class Start extends React.Component {
  constructor(props){
    super(props);
    this.state={
      name: '',
      color:'',
    }
  }

  //navigate to chat screen
  navigateToChat=()=>{
    this.props.navigation.navigate('Chat',{ name: this.state.name, color:this.state.color })
  }

  //assigns chosen color to background for chat screen
  switchColor=(color)=>this.setState({color})

  render() {
    return (
      <View style={styles.container1}>
        <ImageBackground source={bckImg} resizeMode="cover" style={styles.image}>
          <Text style={styles.appName}>Convo</Text>
          <View style={styles.container2}>
               <View style={styles.input}>
                {/*alternatively use icon from react native vector icon and react native paper*/}
                   <Image 
                   style={{width:25,height:25,marginRight:5}}
                   source={userImg}
                   />
                   <TextInput
                    style={styles.name}
                    onChangeText={name=>this.setState({name})}
                    value={this.state.name}
                    placeholder='Your Name...'
                    underlineColorAndroid="transparent"
                  />
               </View>
               <View style={styles.colors}>
                  <Text style={styles.chooseColor}>
                    Choose a Background Color.
                  </Text>
                  <View style={styles.allColors}>
                     <TouchableOpacity
                     onPress={()=>this.switchColor(styles.color1.backgroundColor)}
                     >
                       <View style={styles.color1}></View>
                     </TouchableOpacity>
                     <TouchableOpacity
                     onPress={()=>this.switchColor(styles.color2.backgroundColor)}
                     >
                       <View style={styles.color2}></View>
                     </TouchableOpacity>
                     <TouchableOpacity
                     onPress={()=>this.switchColor(styles.color3.backgroundColor)}
                     >
                       <View style={styles.color3}></View>
                     </TouchableOpacity>
                     <TouchableOpacity
                     onPress={()=>this.switchColor(styles.color4.backgroundColor)}
                     >
                       <View style={styles.color4}></View>
                     </TouchableOpacity>
                  </View>
              </View>
              <TouchableOpacity 
              style = {styles.btn1}
              onPress={this.navigateToChat}
              > 
                 <Text style = {styles.btn2}>
                     Start Chatting
                 </Text>
              </TouchableOpacity >
          </View>  
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container1: {
    flex:1,    
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems:'center',
  },
  appName:{
    fontSize:45,
    fontWeight:600,
    color:'#ffffff',
    marginTop:60
  },
  container2:{
    flex:0.50,
    justifyContent: 'space-between',
    alignItems:'center',
    backgroundColor:'#fff',
    width: '88%',
    paddingVertical:15,
    marginBottom:20
  },
  input:{ 
    flexDirection:'row',
    alignItems:'center',
    width: '88%',
    height:60,
    borderWidth: 3,
    borderColor:'#75708370',
    borderStyle:'solid',
    paddingStart:20
  },
  name:{
    flex:1,
    fontSize:16, 
    fontWeight:300,
    color:'#757083',
    
  },
  colors:{
    width:'88%', 
  },
  chooseColor:{
    flex:0.3,
    fontSize:16, 
    fontWeight:600,
    color:'#75708380',
    width: '100%',
  },
  allColors:{
    flex:0.7,
    flexDirection: "row",
    justifyContent:'start',
    width: '100%',
    marginTop:10
  },
  color1:{
    width:45,
    height:45,
    backgroundColor:'#090C08',
    borderRadius: '50%',
    marginRight:20
  },
  color2:{
    width:45,
    height:45,
    height:'100%',
    backgroundColor:'#474056',
    borderRadius: '50%',
    marginRight:20
    
  },
  color3:{
    width:45,
    height:45,
    backgroundColor:'#8A95A5',
    borderRadius: '50%',
    marginRight:20
    
  },
  color4:{
    width:45,
    height:45,
    backgroundColor:'#B9C6AE',
    borderRadius: '50%',
    marginRight:20
    
  },
  btn1:{
    backgroundColor:'#757083',
    width: '88%',
    height:50,
    justifyContent:'center',
    alignItems:'center'
  },
  btn2:{
    fontSize:20,
    fontWeight:600,
    color:'#FFFFFF',
  }
});