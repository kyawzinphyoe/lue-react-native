import React, { Component } from 'react';
import { Item, Input, Content, Icon, Button, Text } from 'native-base';
import { ProgressDialog } from 'react-native-simple-dialogs';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  BackHandler,
  KeyboardAvoidingView
} from 'react-native';
import { Constants } from 'expo';
import { ImagePicker, Asset } from 'expo';
import DatePicker from 'react-native-datepicker';

import '@expo/vector-icons';

export default class App extends Component {
  url='https://hr.comquas.com/api';
  static navigationOptions = {
    title: 'Update Profile',
    headerTintColor:'white',
    headerStyle:{
      backgroundColor:'#5D6D7E',
      
    },
    
  };

  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null,
      mobile_no: null,
      location: null,
      locationid:null,
      join_date: null,
      birthday: null,
      password:null,
      confirm_password:null,
      bank_name: null,
      bank_account: null,
      personal_email: null,
      github: null,
      twitter: null,
      slack: null,
      supervisor: null,
      avatar: '',
      base64Img: '',
      progress:false,
    };
    this.fetchData();
    this.handleBackButtonClick=this.handleBackButtonClick.bind(this);
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
   fetchData() {
    fetch(this.url+'/user/detail', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
    })
    .then(response => response.json())
    .then(res => {
      this.setState({ name: res.name });
      this.setState({ email: res.email });
      this.setState({ avatar: res.avatar });
      this.setState({ mobile_no: res.mobile_no });
      this.setState({ personal_email: res.personal_email });
      this.setState({ github: res.github });
      this.setState({ twitter: res.twitter });
      this.setState({ slack: res.slack });
      this.setState({ bank_name : res.bank_name });
      this.setState({ bank_account : res.bank_account });
      this.setState({ location : res.location });
      this.setState({ locationid : res.location_id })
      this.setState({ birthday : res.birthday });
      this.setState({ join_date : res.join_date });
    });  
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      isCamera: true,
      openCameraOnStart: true,
    });

    if (!result.cancelled) {
      const imagePath = result.uri;
      let base64Img = `${result.base64}`;
      this.setState({ avatar: imagePath });
      this.setState({ base64Img: base64Img });
    }
  };
  
  
   update() {     
    this.setState({progress:true});
    fetch(this.url+'/profile/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token
      },
      body: JSON.stringify({
        name:this.state.name,
        email:this.state.email,
        password:this.state.password,
        password_confirmation:this.state.confirm_password,
        birthday:this.state.birthday,
        join_date:this.state.join_date,
        bank_name:this.state.bank_name,
        bank_account:this.state.bank_account,
        mobile_no:this.state.mobile_no,
        personal_email:this.state.personal_email,
        github:this.state.github,
        twitter:this.state.twitter,
        slack:this.state.slack,
        location:this.state.locationid,
        supervisor:1,
        avatar:this.state.base64Img? this.state.base64Img:null
      })
    })
    .then(response => response.json())
    .then(res => {         
         this.setState({progress:false})
         this.props.navigation.navigate('profile')
      });
  }


  render() {
    return (
      <KeyboardAvoidingView behavior='padding' enabled>
      <ScrollView>        
      <View style={{ flex: 1 }}>{this.renderHero()}</View>
      <View style={{ flex: 1 }}>{this.renderContent()}</View>
      </ScrollView>
      </KeyboardAvoidingView>
      );
  }

  renderHero() {
    return (
      <View style={{ flex: 1 }}>
      <View
      style={{
        flex: 1,
        backgroundColor: 'purple',
        alignItems: 'center',
      }}
      />
      </View>
      );
    }

    renderContent() {
      return (      
      <View style={{ flex: 1 }}>      
      <View style={{flex:1,alignItems:'center',marginBottom:30}}>
      {this.state.progress? 
        <ProgressDialog 
            visible={this.state.progress} 
            title='Updating information...'
            message="Please, wait..."
         />
        : null}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <Content style={{width:'90%'}}>                          
          <Image
          source={ this.state.avatar? { uri: this.state.avatar }:require('../images/default.jpg')}
          style={{ width: '100%', height: 150,borderRadius:8,marginBottom:10}}          
          />                            
          <Button rounded dark style={{width:'16%',height:'3%'}} onPress={this._pickImage}>
          <Icon name="ios-camera"/>
          </Button>
          <Item><Icon name="person"/><Input placeholder="Name" value={this.state.name} onChangeText={n=>this.setState({name:n})}/></Item> 
          <Item><Icon name="email" type="Entypo"/><Input placeholder="Email" value={this.state.email} onChangeText={e=>this.setState({email:e})}/></Item> 
          <Item><Icon name="call"/><Input placeholder="Mobile" value={this.state.mobile_no} onChangeText={m=>this.setState({mobile_no:m})}/></Item> 
          <Item><Icon name="location-pin" type="Entypo"/><Input disabled placeholder="Office Location" value={this.state.location} onChangeText={l=>this.setState({location:l})}/></Item> 
          <Item><Icon name="calendar"/><Input disabled placeholder="Join" value={this.state.join_date} onChangeText={j=>this.setState({join_date:j})}/></Item> 
          <Item><Icon name="calendar"/><Input disabled placeholder="Birthday" value={this.state.birthday} onChangeText={b=>this.setState({birthday:b})}/></Item> 
          <Item><Icon name="key"/><Input secureTextEntry={ true } placeholder="Password" value={this.state.password} onChangeText={p=>this.setState({password:p})}/></Item> 
          <Item><Icon name="key"/><Input secureTextEntry={ true } placeholder="Confirm Password" value={this.state.confirm_password} onChangeText={cp=>this.setState({confirm_password:cp})}/></Item>
          <Item><Icon name="bank" type="MaterialCommunityIcons"/><Input placeholder="Bank Name" value={this.state.bank_name} onChangeText={bn=>this.setState({bank_name:bn})}/></Item>
          <Item><Icon name="bank" type="MaterialCommunityIcons"/><Input placeholder="Bank Account" value={this.state.bank_account} onChangeText={bc=>this.setState({bank_account:bc})}/></Item>
          <Item><Icon name="email" type="Entypo"/><Input placeholder="Personal Email" value={this.state.personal_email} onChangeText={pe=>this.setState({personal_email:pe})}/></Item>
          <Item><Icon name="github" type="Feather"/><Input placeholder="Github Username" value={this.state.github} onChangeText={g=>this.setState({github:g})}/></Item>
          <Item><Icon name="twitter" type="FontAwesome"/><Input placeholder="Twitter Username" value={this.state.twitter} onChangeText={t=>this.setState({twitter:t})}/></Item>
          <Item><Icon name="slack" type="MaterialCommunityIcons"/><Input placeholder="Slack Username" value={this.state.slack} onChangeText={s=>this.setState({slack:s})}/></Item>
          <Button onPress={()=>this.update()} style={{marginBottom:50,marginTop:5,width:'100%',justifyContent:'center',backgroundColor:'#5D6D7E'}}><Text>Update</Text></Button>
          </Content>             
          </View>
          </View>
          );
        }
      }
