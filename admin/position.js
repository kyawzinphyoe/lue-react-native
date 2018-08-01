import React from "react";
import { BackHandler } from 'react-native';
import AlertInput from 'react-native-alert-input';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Input, Item, Container, Content, Card, CardItem, Text, Button, Icon, Left, Body, Right } from 'native-base';
export default class Position extends React.Component {

   url='https://hr.comquas.com/api';
   constructor(props){
       super(props);
       this.state={
          positions:[],          
          progress:false,          
          newPosition:false,
          title:'',
          level:'',
          hide:true,
          btntitle:'',
          pid:''
       }       
       this.fetchData();
       this.handleBackButtonClick=this.handleBackButtonClick.bind(this);
   }
	static navigationOptions = {
                title:'Position',
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
    this.setState({hide:true})
    fetch(this.url+'/positions', {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' +window.token,
     },
   })
     .then(response => response.json())
     .then(res => {
       this.setState({ positions: res.data});              
     });
 }
 positions(){
      return this.state.positions.map((req)=>{
        return (
              <CardItem>
                <Left><Text>{req.title}</Text></Left>   
                <Icon name="edit" type="FontAwesome" onPress={()=>{this.setState({title:req.title,level:req.level,btntitle:"Update",pid:req.id}),this.state.newPosition?this.setState({newPosition:false}):this.setState({newPosition:true,hide:false})}}/>
                <Icon style={{color:'maroon'}} name="delete-forever" type="MaterialIcons" onPress={()=>this.delete(req.id)}/>                  
              </CardItem>
          )
      })
 }
delete(id){
  this.setState({progress:true})
  fetch(this.url+'/position/'+id, {
     method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      }
    })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({progress:false})       
     });
}
 new () {
  this.setState({progress:true})
  fetch(this.url+'/position', {
     method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
      body: JSON.stringify({
        title : this.state.title,
        level : this.state.level,
      })
    })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({progress:false})
       this.setState({newPosition:false})       
     });
 }
 edit () {
  this.setState({progress:true})
  fetch(this.url+'/position/'+this.state.pid, {
     method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
      body: JSON.stringify({
        title : this.state.title,
        level : this.state.level
      })
    })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({progress:false,newPosition:false,title:'',level:'',pid:'',btntitle:''})       
     });
 }
  render() {
    return (
    	<Container>
      {this.state.newPosition?
              <Card transparent>              
                <CardItem>                                
                  <Item><Input placeholder="Position" value={this.state.title} onChangeText={(t)=>this.setState({title:t})}/></Item>                                
                </CardItem>
                <CardItem>
                  <Item><Input keyboardType="numeric" placeholder="Level" value={this.state.level.toString()} onChangeText={(l)=>this.setState({level:l})}/></Item>
                </CardItem>
                <CardItem>
                  <Left><Button onPress={()=>{this.state.pid?this.edit():this.new(),this.setState({hide:true})}}><Text>{this.state.btntitle?this.state.btntitle:"ADD"}</Text></Button></Left>
                  <Right><Button onPress={()=>this.setState({newPosition:false,hide:true,title:'',level:'',pid:'',btntitle:''})}><Text>Cancel</Text></Button></Right>
                </CardItem>
              </Card>
              :null}
         <Content> 
         {this.state.hide?
          <Card>    
              <CardItem>
                <Left><Text style={{fontWeight:'bold'}}>Position</Text></Left>               
                <Right>               
                <Button style={{height:30}} rounded>                 
                <Icon name="add" type="MaterialIcons" onPress={()=>this.state.newPosition?this.setState({newPosition:false}):this.setState({newPosition:true,hide:false})}/>               
                </Button>
                </Right>
              </CardItem>                         
                {this.positions()}
            </Card>:null
         }                       
         </Content>         
         <ProgressDialog 
            visible={this.state.progress} 
            title='Processing...'
            message="Please, wait..."
         />         
      </Container>
    );
  }
}
