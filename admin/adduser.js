import React, { Component } from 'react';
import { Item, Input, Content, Icon, Button, Text } from 'native-base';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Picker } from 'react-native';
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
    title: 'Add New Employee',
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
      locations:[],
      positions:[],      
      postitle:'',
      no_of_leave:'',
      sick_leave:''
    };
    this.fetchLocation();
    this.fetchPosition();
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
  fetchLocation() {
    fetch(this.url+'/locations', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
    })
    .then(response => response.json())
    .then(res => {
      this.setState({locations:res.data})     
    });    
  }
  fetchPosition() {
    fetch(this.url+'/positions', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
    })
    .then(response => response.json())
    .then(res => {
      this.setState({positions:res.data})     
    });    

  }
showloc () {
    return this.state.locations.map(req => {
      return (
        <Picker.Item label={req.name} value={req.id} />
        )
  })
}
showpos () {
    return this.state.positions.map(req => {
      return (
        <Picker.Item label={req.title} value={req.id} />
        )
  })
}
add () {
  this.setState({progress:true})
  fetch(this.url+'/user',{
    method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
      body: JSON.stringify({
          name : this.state.name,
          email : this.state.email,
          mobile_no : this.state.mobile_no,
          location : this.state.location,
          position : this.state.postitle,
          join_date : this.state.join_date,
          birthday : this.state.birthday,  
          salary : this.state.salary,
          password : this.state.password,
          password_confirmation : this.state.confirm_password,
          no_of_leave : this.state.no_of_leave,
          sick_leave : this.state.sick_leave,
          supervisor : 1,
          bank_name : null,
          bank_account : null,
          personal_email : null,
          github : null,
          twitter : null,
          slack : null,
          avatar : this.state.avatar?this.state.avatar:null
      })
  })
  .then(response => response.json())
    .then(res => {
      this.setState({progress:false})
      this.props.navigation.navigate('userlist')     
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
            title='Add new employee...'
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
          <Item><Input placeholder="name" onChangeText={n=>this.setState({name:n})}/></Item>
          <Item><Input placeholder="email" onChangeText={e=>this.setState({email:e})} keyboardType="email-address"/></Item>
          <Item><Input placeholder="mobile" onChangeText={m=>this.setState({mobile_no:m})} keyboardType="phone-pad"/></Item>
          <Item>
            <Picker mode="dropdown" style={{ height: 50,width:'100%'}} selectedValue={this.state.location}
                onValueChange={(itemValue, itemIndex) => this.setState({location: itemValue})}>                
                <Picker.Item label="Office Location"/>
                {this.showloc()}             
            </Picker>
          </Item>
          <Item>
            <Picker mode="dropdown" style={{ height: 50,width:'100%'}} selectedValue={this.state.postitle}
                onValueChange={(itemValue, itemIndex) => this.setState({postitle: itemValue})}>                
                <Picker.Item label="Position"/>
                {this.showpos()}             
            </Picker>
          </Item>
          <Item>
              <DatePicker
              style={{width: '100%',height:50}}
              date={this.state.join_date}
              mode="date"
              placeholder="select join date"
              format="DD-MM-YYYY"
              minDate={new Date()}            
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{                
                dateInput: {
                  margin: 0,
                  borderWidth: 0
                }
              }}
            onDateChange={(date) => {this.setState({join_date: date})}}
             />
            </Item>
            <Item>
              <DatePicker
                style={{width: '100%',height:50}}
                date={this.state.birthday}
                mode="date"
                placeholder="select birthday"
                format="DD-MM-YYYY"                        
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{                 
                  dateInput: {
                    margin: 0,
                    borderWidth: 0
                  }
                }}
                onDateChange={(date) => {this.setState({birthday: date})}
              }
              />
            </Item>
          <Item><Input placeholder="salary" keyboardType="numeric" onChangeText={s=>this.setState({salary:s})}/></Item>          
          <Item><Input placeholder="password" onChangeText={p=>this.setState({password:p})} secureTextEntry={true}/></Item>          
          <Item><Input placeholder="confrim password" onChangeText={cp=>this.setState({confirm_password:cp})} secureTextEntry={true}/></Item>
          <Item><Input placeholder="no of leave" onChangeText={nl=>this.setState({no_of_leave:nl})} keyboardType="numeric"/></Item>          
          <Item><Input placeholder="sick leave" onChangeText={sick=>this.setState({sick_leave:sick})} keyboardType="numeric"/></Item>
          <Item><Input placeholder="supervisor" onChangeText={su=>this.setState({supervisor:su})}/></Item>       
          <Item><Input placeholder="bank name" onChangeText={bn=>this.setState({bank_name:bn})}/></Item>
          <Item><Input placeholder="bank account" onChangeText={bc=>this.setState({bank_account:bc})} keyboardType="numeric"/></Item>
          <Item><Input placeholder="personal email" onChangeText={pe=>this.setState({personal_email:pe})} keyboardType="email-address"/></Item>
          <Item><Input placeholder="github username" onChangeText={g=>this.setState({github:g})}/></Item>
          <Item><Input placeholder="twitter username" onChangeText={t=>this.setState({twitter:t})}/></Item>
          <Item><Input placeholder="slack username" onChangeText={sl=>this.setState({slack:sl})}/></Item>
             
          <Button onPress={()=>this.add()} style={{marginBottom:50,marginTop:5,width:'100%',justifyContent:'center',backgroundColor:'#5D6D7E'}}><Text>Add</Text></Button>
          </Content>             
          </View>
          </View>
          );
        }
      }
