import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export default class Chat extends React.Component{
	componentDidMount(){
         let { name} = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
    }
	render(){
		return(
			<View 
			style={{backgroundColor:this.props.route.params.color,
			flex:1, 
			justifyContent: 'center', 
			alignItems: 'center',
			}}
			>
		        <Text>Hello Chat view</Text>
		    </View>
			)
	}
}

const styles= StyleSheet.create({
	container:{
		flex:1, 
		justifyContent: 'center', 
		alignItems: 'center',
	}
});