import React, { Component } from 'react'
import { StyleSheet, Text, View, Image,
 TouchableWithoutFeedback, StatusBar,
 TextInput, Keyboard, SafeAreaView,
 TouchableOpacity, Button,TouchableHighlight,ImageBackground,
 KeyboardAvoidingView,BackHandler,Alert} from 'react-native';
import { Icon } from 'react-native-elements';

    export default class Login extends Component {

        baseUrl='https://hr.comquas.com/api';
         static navigationOptions = {
                header: null
               };
        
        constructor(props){
            super(props)
            this.state={
                email:'',
                password:'',
                mailEmpty: '',
                passEmpty:'',
                level:'',
            }

            BackHandler.addEventListener('hardwareBackPress',function(){
             Alert.alert(
                'Confirm Exit',
                'Are you sure you want to exit?', [{
                    text: 'No',
                    style: 'cancel'
                }, {
                    text: 'Yes',
                    onPress: () => BackHandler.exitApp()
                }, ], {
                    cancelable: false
                }
                )
             return true;
         })
        }
        async login () {
            const {email,password} = this.state;
            if(email == '' && password == ''){
                this.setState({
                    mailEmpty:true,
                    passEmpty:true
                })
            }else if(email == ''){
                this.setState({
                    mailEmpty:true
                })
            }
            else if(password == ''){

                this.setState({
                    passEmpty:true
                })
            }else{
                this.setState({
                    mailEmpty:false,
                    passEmpty:false
                })

                try{

                    let response = await fetch(this.baseUrl+'/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({

                            email: this.state.email,
                            password: this.state.password,

                        })
                    });

                    let res=await response.json();
                    this.setState({level: res.position_id})
                    if(response.status >= 200 && response.status < 300){
                        window.token=res['token'];
                        if(this.state.level == 1){
                            this.props.navigation.navigate('home');
                        }else{
                            this.props.navigation.navigate('profile');
                        }                        

                    }else{
                        Alert.alert(
                            'Error!!',
                            'Invalid email or password.'
                            )
                    }
                }catch(error){
                    alert("No Internet Connection!!");
                }
            }         
        }
        forgot = () => {
            this.props.navigation.navigate('forgot');
        }
        render(){
            return(
                <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>
                <ImageBackground
                style={{
                  flex: 1,
                  backgroundColor:'black'
                 }}
                    //source={require('../images/login.png')}
                    >
                    <View style={styles.container}>
                    <View style={styles.logoContainer}>
                    <Text style={{fontSize: 50,color:'white'}}>
                    COMQUAS
                    </Text>

                    <TextInput style={[styles.inputmail,this.state.mailEmpty ? styles.error : null]}
                    placeholder="Email" 
                    value={this.state.email}
                    placeholderTextColor="white"
                    KeyboardType='email-address'
                    underlineColorAndroid='transparent'
                    selectionColor='#2471A3'
                    onSubmitEditing={()=>this.password.focus()}
                    onChangeText={
                        email => this.setState({email})
                    }
                    >

                    </TextInput>
                    <TextInput style={[styles.inputpass,this.state.passEmpty ? styles.error : null]}
                    placeholder="password"
                    value={this.state.password}
                    placeholderTextColor="white"
                    secureTextEntry={true}
                    selectionColor='#2471A3'
                    underlineColorAndroid='transparent'
                    ref={(input) => this.password =input }
                    onChangeText={
                        password => this.setState({password})
                    }
                    >
                    </TextInput>



                    <TouchableOpacity
                    style={styles.btn}
                    onPress={()=>{this.login()}}
                    activeOpacity={0.4} underlayColor="white"
                    >
                    <Text style={styles.btnText}>LOG IN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.forgot}>
                    <Text style={styles.forgotpass}>FORGOT PASSWORD?</Text>
                    </TouchableOpacity>



                    </View>
                    </View>
                    </ImageBackground>
                    </KeyboardAvoidingView>
                    </SafeAreaView>

                    )
                }
    }
    const styles=StyleSheet.create({
       
        container:{
            flex:1,
            
            flexDirection:'column',
        },
        logoContainer:{
            
            alignItems:'center',
            justifyContent:'center',
            flex:1,
        },
        inputmail:{
            borderWidth:1.5,
            marginTop:50,
            height:40,
            width: '80%',
            padding:10,
            borderRadius:30,
            borderColor:'#2471A3',
            fontSize:16,
            paddingHorizontal:14,
            color:'white'
        },
        error:{
            borderColor:'#F00',
            borderWidth:1
        },
        inputpass:{
            borderWidth:1.5,
            marginTop:30,
            height:40,
            width: '80%',
            padding:10,
            borderRadius:30,
            borderColor:'#2471A3',
            fontSize:16,
            paddingHorizontal:14,
            color:'white'
        },
        btn:{
            marginTop:30,
            width:'40%',
            height:40,
            backgroundColor:'#2471A3',
            borderRadius:30,
            alignItems:'center',
            padding:5
        },
        btnText:{
            fontSize:18,
            fontWeight:'bold',
            color:'white',
        },
        forgotpass:{
            color:'red',
            fontSize:13,
            marginTop:28,
            fontWeight:'bold'

        }
        
    })
