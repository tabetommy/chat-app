import React from 'react';
import {View, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble,InputToolbar} from 'react-native-gifted-chat';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
// import MapView from "react-native-maps";


export default class Chat extends React.Component{
	constructor() {
	    super();
	    this.state = {
	      messages: [],
	      uid: 0,
		  isConnected:false,
	    }

	    const firebaseConfig = {
			apiKey: "AIzaSyAZcf4bjU9ubqrvCNUYwJ7tKyNkpG5l25E",
			authDomain: "chatapp-84454.firebaseapp.com",
			projectId: "chatapp-84454",
			storageBucket: "chatapp-84454.appspot.com",
			messagingSenderId: "203169596879",
			appId: "1:203169596879:web:237b4cb66ece80ca4ffeba",
			measurementId: "G-MLJMF5CCCE"
		  };
		if (!firebase.apps.length){
			firebase.initializeApp(firebaseConfig);
			};
		//reference firestore collection
		this.referenceChatMessages = firebase.firestore().collection("messages");
	  }


	  //store messages locally
		async saveMessages() {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
		
		} catch (error) {
			console.log(error.message); 
		}
		}
		
	//retrieve message from local storage
		async getMessages() {
		let messages = '';
		try {
			messages = await AsyncStorage.getItem('messages') || [];
			this.setState({
			messages: JSON.parse(messages)
			});
		} catch (error) {
			console.log(error.message);
		}
		}
		
	//delete message from local storage
		async deleteMessages() {
		try {
			await AsyncStorage.removeItem('messages');
		} catch (error) {
			console.log(error.message);
		}
		}

    //retrieves new messge, pushes it to this.state.message from where it is displayed
	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each document
		querySnapshot.forEach((doc) => {
		  // get the QueryDocumentSnapshot's data
		  let data = doc.data();
		  messages.push({
			_id:data._id,
			text: data.text,
			createdAt:data.createdAt.toDate(),
			user:data.user,
			image: data.image || null,
        	location: data.location || null
		  });
		});
		this.setState({messages});
	  };


	componentDidMount(){
		let { name} = this.props.route.params;
		this.props.navigation.setOptions({ title: name });
		NetInfo.fetch().then(connection => {
			if (connection.isConnected) {
			  this.setState({ isConnected: true });
			  console.log('online');
			  this.referenceChatMessages = firebase.firestore().collection("messages");
			  this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
					if (!user) {
					firebase.auth().signInAnonymously();
					}
					this.setState({
					uid: user.uid,
					messages: [],
					});
					this.unsubscribe = this.referenceChatMessages
					.orderBy("createdAt", "desc")
					.onSnapshot(this.onCollectionUpdate);
					this.saveMessages();
			 });
	
			} else {
				console.log('Offline')
				this.getMessages();
				this.setState({isConnected:false});		  
			}	
	})
	}

	
	 //stores new message to firstore database
	 addMessages() {
		const recentMessage=this.state.messages[0];
		this.referenceChatMessages.add({
		  _id: recentMessage._id,
		  text: recentMessage.text || "",
		  createdAt:recentMessage.createdAt,
		  user:recentMessage.user,
		  image: recentMessage.image || null,
		  location: recentMessage.location || null
		});
	  }

    //appends message to be sent to previous message state
	onSend(messages = []) {
		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}), () => {
			this.addMessages();
			this.saveMessages();
		});
		}

	 //set color of bubble to black
	 renderBubble(props) {
		return (
			<Bubble
			{...props}
			wrapperStyle={{
				right: {
				backgroundColor: '#000'
				}
			}}
			/>
		)
		}

    //hide input tool bar when connection is offlie
	renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
		return(
			<InputToolbar
			{...props}
			/>
		);
		}
	}

	renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	  };



	//custom map view
	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
		  return (
			<MapView
			  style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
			  region={{
				latitude: currentMessage.location.latitude,
				longitude: currentMessage.location.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			  }}
			/>
		  );
		}
		return null;
	  }


	// componentWillUnmount() {
	// 	// this.authUnsubscribe();
	// 	this.unsubscribe();
	// 	}

	render(){
		return(
			<View 
			style={{
			backgroundColor:this.props.route.params.color,
			flex:1, 
			}}
			>
		        <GiftedChat
				  renderBubble={this.renderBubble}
				  messages={this.state.messages}
				  renderInputToolbar={this.renderInputToolbar.bind(this)}
				  renderActions={this.renderCustomActions}
				  renderCustomView={this.renderCustomView}
				  user={{
				    _id: this.state.uid,
				  }}
				/>
			{/* correct android not showing input field*/}
				{ Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
		    </View>
			)
	}
}