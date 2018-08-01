import React, { Component } from 'react'
import { Item, Input, Content, Icon, Button, Text, Textarea } from 'native-base';
import { StyleSheet, SafeAreaView,AsyncStorage, View,
         KeyboardAvoidingView,BackHandler,Picker,ScrollView,Alert} from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';   
import { CheckBox } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

    export default class Apply  extends Component {
        url='https://hr.comquas.com/api';
         static navigationOptions = {
                title:'Apply Leave',
                headerTintColor:'white',
                headerStyle:{
                  backgroundColor:'#5D6D7E'
                }
               }; 
        constructor(props){
            super(props)
            this.state={
                from:"",
                to:"",
                type:"",
                nod:"",
                reason:"",
                progress:false,
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
          async leave(){             
            if(this.state.type == '' || this.state.from == '' || this.state.to == '' || this.state.reason == ''){
              alert('Some field empty !!')
            }else{
                this.setState({progress: true})
            try{              
                let response = await fetch(this.url + '/admin/time-off/apply', {
                    method: 'POST',
                    headers: {                        
                        'Content-Type': 'application/json',
                         "Authorization":'Bearer'+ window.token
                    },
                    body: JSON.stringify({
                        type : this.state.type,
                        from_date: this.state.from,
                        to_date: this.state.to,
                        no_of_day: this.state.nod,
                        reason: this.state.reason
                    })
                });
              let res=await response.json();
              if(response.status >= 200 && response.status < 300){
                this.setState({progress:false})
                      Alert.alert(
                        'Message',
                        'Apply Leave Successfully', [{
                            
                        }, {
                            text: 'Ok',
                            onPress: () => {this.profile()}
                        }, ], {
                            cancelable: false
                        }
                         )
              }
            }catch(error){
                alert("No Internet Connection!!")
            }
            }
      }
      profile(){
        this.props.navigation.navigate('profile');
      }
      calc = () => {
       let f=this.state.from;
       let t=this.state.to;
        if(f == t ){
          this.setState({nod : '1'})
        }else{
          let a = moment(f,"YYYY,0,D");
          let b = moment(t,"YYYY,0,D");
          let c = a.diff(b, 'days')  
          let nod=Math.floor(c/-365+1);
          this.setState({nod : `${nod}`});
        }
      }
      render(){        
        return(     
          <SafeAreaView style={styles.container}>          
          <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>      
          <ScrollView>                                    
          {this.state.progress? 
          <ProgressDialog 
            visible={this.state.progress} 
            title='Apply leave...'
            message="Please, wait..."
          />
          : null}   
          <View style={{alignItems: 'center',marginTop:50}}>
          <Content style={{width:'90%'}}>
            <Item>
              <Picker mode="dropdown" selectedValue={this.state.type} style={{ height: 40,width:'100%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
                <Picker.Item label="Leave type"/><Picker.Item label="Annual" value="1" /><Picker.Item label="Sick" value="2" />                
              </Picker>
            </Item> 
            <Item style={{marginTop:20}}>
              <DatePicker
              style={{width: '100%'}}
              date={this.state.from}
              mode="date"
              placeholder="select date From"
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
            onDateChange={(date) => {this.setState({from: date})}}
             />
            </Item>
            <Item style={{marginTop:20}}>
              <DatePicker
                style={{width: '100%'}}
                date={this.state.to}
                mode="date"
                placeholder="select date To"
                format="DD-MM-YYYY"
                minDate={this.state.from?this.state.from:new Date()}            
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{                 
                  dateInput: {
                    margin: 0,
                    borderWidth: 0
                  }
                }}
                onDateChange={(date) => {this.setState({to: date}),this.calc()}
              }
              />
            </Item>
            <Item style={{marginTop:20}}>
              <Input diabled placeholder="no of day" value={this.state.nod}/>
              {this.state.nod == '1'?<CheckBox title='0.5' size={15}           
              checked={this.state.checked} containerStyle={{backgroundColor:''}}
              onPress={()=>this.setState({checked: !this.state.checked? this.setState({nod : '0.5'}) : this.setState({nod : '1'})})}
              />: <Icon name="like" type="Foundation"/> }
            </Item>            
            <Item style={{marginTop:20}}>
              <Textarea rowSpan={4} width="100%" bordered placeholder="Reason" onChangeText={r=>this.setState({reason:r})}/>
            </Item>
            <Item style={{marginTop:20}}>
            <Button style={{backgroundColor:"#5D6D7E",width:"100%",justifyContent:"center"}} onPress={()=>this.leave()}>
            <Text>Apply</Text></Button>
            </Item>
          </Content>                          
          </View>
          </ScrollView>
          </KeyboardAvoidingView>
          </SafeAreaView>          
          )
      }
    }
    const styles=StyleSheet.create({
      container:{
        flex:1,
        justifyContent:'center',                        
      }
  })
