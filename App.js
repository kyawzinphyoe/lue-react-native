import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import  { createStackNavigator }  from 'react-navigation';


import Login from './users/Login';
import Profile from './users/Profile';
import Forgot from './users/Forgot';
import Apply from './users/Apply';
import Update from './users/Update';
import Home from './admin/home';
import TimeOffRequest from './admin/timeoffrequest';
import TimeOffList from './admin/timeofflist';
import UserList from './admin/userlist';
import Location from './admin/location';
import Position from './admin/position';
import AddEmployee from './admin/adduser.js';

const navigation = createStackNavigator({


	 
	login  : {screen : Login },
	profile : { screen : Profile },
	forgot : { screen : Forgot },
	apply : { screen : Apply },
	update: { screen : Update },
	home : { screen : Home },
	userlist : { screen : UserList },
	timeoffrequest : { screen : TimeOffRequest },
	timeofflist : { screen : TimeOffList },
	location : { screen : Location },
	position : { screen : Position },	
	addemployee : { screen : AddEmployee }


});


export default navigation;
