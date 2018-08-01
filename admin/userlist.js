import React from "react";
import { Image,BackHandler } from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Container, Content, Header, Title, Card, CardItem, Text, Button, Icon, Left, Body, Right } from 'native-base';
export default class UserList extends React.Component {

   url='https://hr.comquas.com/api';
   constructor(props){
       super(props);
       this.state={
         userlist:[],
         process:false,
       }
       this.fetchData();
       this.handleBackButtonClick=this.handleBackButtonClick.bind(this);
   }
	static navigationOptions = {
                header:null
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
          componentDidMount(){
            this.timer=setInterval(
              ()=>this.fetchData(),2000
            )
            }
            componentWillUnmount(){
              clearInterval(this.timer);
            }                      
  fetchData(){
    fetch(this.url+'/admin/user/list', {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' + window.token,
     },
   })
     .then(response => response.json())
     .then(res => {
       this.setState({ userlist: res.data});       
     });
 }
 deleteuser(id){
    this.setState({process:true});
    fetch(this.url+'/user/'+id, {
     method: 'DELETE',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' + window.token,
     },
   }).then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({process:false});
     });
 }
 payslip(id){
    this.setState({process:true});
    fetch(this.url+'/generate-payslip/'+id,{
      method: 'GET',
      headers:{
        Accept: 'application/json',
        'Content-Type':'applicaion/json',
        Authorization: 'Bearer' + window.token,
      },
    }).then(response => response.json())
     .then(res => {
       this.setState({process:false});
       alert("Pay Success!");
     });
 }
 showruserList(){
      return this.state.userlist.map((req)=>{
        return (                    
              <Card>
                <CardItem>
                  <Left>
                    <Image source={{uri: req.avatar}} style={{height: 140,width:100}}/>
                  </Left>
                  <Body style={{marginLeft:-100}}>
                <Text>{req.name}</Text>
                <Text>{req.email}</Text>
                <Text>{req.position}</Text>
                <Text>{req.salary}</Text>
                <CardItem>
                  <Button style={{marginRight:10}} onPress={()=>this.payslip(req.id)}><Text>payslip</Text></Button>
                  <Button danger onPress={()=>this.deleteuser(req.id)}><Text>delete</Text></Button>            
                </CardItem>
                </Body>            
                </CardItem>    
              </Card>                   
          );
      })
 }
  render() {
    return (
    	<Container>
         <Content>
             <Header style={{height:80}}>
                <Left style={{paddingTop:20}}>
                  <Button transparent onPress={()=>this.props.navigation.navigate('home')}>
                    <Icon name="md-arrow-back" />
                  </Button>
                </Left>
                <Body style={{paddingTop:16,alignItems:'center'}}>
                  <Title>Employee Lists</Title>
                </Body> 
                <Right style={{paddingTop:20}}>
                  <Button transparent onPress={()=>this.props.navigation.navigate('addemployee')}>
                    <Icon name="md-add-circle" />
                  </Button>
                </Right>               
              </Header>
            {this.showruserList()}                 
            <ProgressDialog 
            visible={this.state.process} 
            title='Processing...'
            message="Please, wait..."
            />
         </Content>         
      </Container>
    );
  }
}
