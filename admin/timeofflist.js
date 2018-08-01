import React from "react";
import { BackHandler } from 'react-native';
import { Container, Content, Card, CardItem, Text, Button, Icon, Left, Body, Right } from 'native-base';
export default class TimeOffList extends React.Component {

   url='https://hr.comquas.com/api';
   constructor(props){
       super(props);
       this.state={
          requestList:[],
       }       
       this.fetchData();
       this.handleBackButtonClick=this.handleBackButtonClick.bind(this);
   }
	static navigationOptions = {
                title:'Time Off Lists',
                headerTintColor:'white',
                headerStyle:{
                  backgroundColor:'#3B5998'
                }
               };
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
    fetch(this.url+'/admin/decided/time-off/list', {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' +window.token,
     },
   })
     .then(response => response.json())
     .then(res => {
       this.setState({ requestList: res.data});       
     });
 }
 showreqestList(){
      return this.state.requestList.map((req)=>{
        return (
              <CardItem>
                <Left><Text>{req.name}</Text></Left>
                <Body><Text>{req.status==1 ? "Approved" : "Rejected"}</Text></Body>
                <Right>{req.remark==null? <Text>Ok</Text>:<Text style={{color:"red"}}>{req.remark}</Text>}</Right>
              </CardItem>
          )
      })
 }
  render() {
    return (
    	<Container>
         <Content>
            <Card>    
              <CardItem>
                <Left><Text style={{fontWeight:'bold'}}>Name</Text></Left>
                <Body><Text style={{fontWeight:'bold'}}>Action</Text></Body>
                <Right><Text style={{fontWeight:'bold'}}>Remark</Text></Right>
              </CardItem>          
                {this.showreqestList()}          
            </Card>
         </Content>
      </Container>
    );
  }
}
