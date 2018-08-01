import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import AlertInput from 'react-native-alert-input';

export default class TimeOffRequest extends Component {

   url='https://hr.comquas.com/api';
  static navigationOptions = {
                title:'Time Off Requests',
                headerTintColor:'white',
                headerStyle:{
                  backgroundColor:'#3B5998'
                }
               };
  constructor(props){
    super(props);
      this.state={
        requestData:[],
        prompt:false,
        rejectId:'',
        process:false,        
      }
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

   fetchData(){    
    fetch(this.url+'/admin/time-off/list', {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' + window.token,
     },
   })
     .then(response => response.json())
     .then(res => {
       this.setState({ requestData: res.data});       
     });
 }

 approve(id){
  this.setState({process:true});
  fetch(this.url+'/admin/approve/'+id, {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' + window.token,
     },
   })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({process:false});
     });
 }
 reject(input){    
    this.setState({process:true});
    this.setState({prompt:false});
    fetch(this.url+'/admin/reject',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
      body: JSON.stringify({
        leave_id: this.state.rejectId,
        remark: input,
      })
    })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({process:false});
     });
 }
  showRequest(){
    
      return this.state.requestData.map((req)=>{
      return(
          <Card>
            <CardItem>
              <Left style={{alignItems:'center'}}><Text style={{fontWeight:'bold'}}>{req.name}</Text></Left>
              <Right><Text>Request leave</Text></Right>
            </CardItem>
            <CardItem><Left><Text>Type</Text></Left><Body><Text>{req.type==1 ? "Annual" : "Sick" }</Text></Body></CardItem>
            <CardItem><Left><Text>From</Text></Left><Body><Text>{req.from}</Text></Body></CardItem>
            <CardItem><Left><Text>To</Text></Left><Body><Text>{req.to}</Text></Body></CardItem>
            <CardItem><Left><Text>No of day</Text></Left><Body><Text>{req.no_of_day}</Text></Body></CardItem>
            <CardItem><Left><Text>Reason</Text></Left><Body><Text>{req.reason}</Text></Body></CardItem>
            <CardItem>
              <Left><Button small onPress={()=>this.approve(req.id)}><Text>Approve</Text></Button></Left>              
              <Right><Button small danger onPress={()=>{this.setState({prompt:true}),this.setState({rejectId:req.id})}}><Text>Reject</Text></Button></Right>
            </CardItem>            
          </Card>
        )
    })  
  }
 
  render() {
    return (
      <Container>        
        <Content>
            {this.showRequest()}                                                  
        </Content>          
        <AlertInput
           title = "Input Reject Message"
           placeholder= "reject text.."
           show = {this.state.prompt}
           onSubmit = {(input)=>this.reject(input)}
           onCancel = {()=>this.setState({prompt:false})}
         />
         <ProgressDialog 
            visible={this.state.process} 
            title='Processing...'
            message="Please, wait..."
         />              
      </Container>                 
    );
  }
}
                 