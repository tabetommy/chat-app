import React from 'react';
import {View, Text, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";


export default class Chat extends React.Component{
	constructor() {
	    super();
	    this.state = {
	      messages: [],
	      uid: 0,
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
			user:data.user
		  });
		});
		this.setState({messages});
	  };

	componentDidMount(){
       let { name} = this.props.route.params;
       this.props.navigation.setOptions({ title: name });
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
		  });		
    }

	 //stores new message to firstore database
	  addMessages(message) {
		this.referenceChatMessages = firebase.firestore().collection("messages");
		const recentMessage=message[0];
		this.referenceChatMessages.add({
		  _id: recentMessage._id,
		  text: recentMessage.text,
		  createdAt:recentMessage.createdAt,
		  user:recentMessage.user
		});
	  }

    //appends message to be sent to previous message state
    onSend(messages = []) {
	   this.addMessages(messages);
	 }


    componentWillUnmount() {
		this.unsubscribe();
	 }
	 
	render(){
		return(
			<View 
			style={{
			backgroundColor:this.props.route.params.color,
			flex:1, 
			}}
			>
		        <GiftedChat
				  messages={this.state.messages}
				  onSend={messages => this.onSend(messages)}
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