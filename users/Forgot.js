import React, { Component } from 'react';
import { Alert,TouchableOpacity,View, StyleSheet,Text,TextInput, KeyboardAvoidingView,BackHandler,SafeAreaView,AsyncStorage,ActivityIndicator,Linking } from 'react-native';
import { Header,Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';

export default class Forgot extends Component {


          constructor(props){
            super(props);
            this.state={
                mail:'',
                loader:false,
              
            }
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
        
          static navigationOptions = {     
              title:'Fotgot Password',
              headerTintColor:'white',
              headerStyle:{
                backgroundColor:'#5D6D7E'
              }
          };

        async forgot () {
          
          const {mail}=this.state;
            if(mail == ''){
                Alert.alert(
                  'Missing Email !!',
                  'Please input email for reset password.'
                  )
                  
            } else{
              this.setState({loader:true})
            try{
                let response = await fetch('https://hr.comquas.com/api/reset', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        
                            email: mail,
                        
                    })
                });
                if(response.status >= 200 && response.status < 300){
                  this.setState({loader:false})
                   Alert.alert(
                        'Confirm Email',
                        'Check Your Mail Box', [{
                            
                        }, {
                            text: 'Go',
                            onPress: () => {Linking.openURL('https://mail.google.com/mail/'+mail)}
                        }, ], {
                            cancelable: false
                        }
                         )
                }else{
                  Alert.alert('Error!!','Invalid email address')
                  this.setState({loader:false})
                }
             }catch(error){
                alert("No Internet Connection!!")
             }
            
                
        }
        }     
            

       render(){

           return(
                
                <View style={styles.container}>
              
                
      
                <KeyboardAvoidingView style={styles.innerContainer} behavior="padding" enabled>
                {this.state.loader? <ActivityIndicator style={{marginTop:80}} size='large' color='blue' /> : null}
                <View style={styles.innerContainer}>
                            <TextInput 
                            style={styles.textInput}
                            placeholder='Email'
                            value={this.state.mail}
                            placeholderTextColor='black'
                            underlineColorAndroid='transparent'
                            fontSize={16}
                            onChangeText={(mail)=>this.setState({mail})}
                            ></TextInput>
                          
                            <TouchableOpacity style={styles.btn} onPress={()=>this.forgot()}>
                            <Text style={{fontWeight:'bold',fontSize:16,color:'white'}}>Get Reset Link</Text>
                            </TouchableOpacity>

                </View>
                </KeyboardAvoidingView>

                </View>

            )
        }
  }

  const styles=StyleSheet.create({
    container:{
      flex:1,
      flexDirection:'column',
       
      
    },
    innerContainer:{
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    textInput:{
        borderWidth:1,
        borderRadius:10,
        borderColor: '#bdc3c7',
        height:40,
        width: 300,
        padding:10,
        fontSize:16,
        paddingHorizontal:14,
        marginTop:-120,
        backgroundColor:'#E7F1F7'
    },
    btn:{
        marginTop:20,
        width: 300,
        height:40,
        backgroundColor:'#5D6D7E',
        alignItems:'center',
        padding:9,
        borderRadius:10,

      },
  
  })