import React from "react";
import { BackHandler } from 'react-native';
import AlertInput from 'react-native-alert-input';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Input, Container, Content, Card, CardItem, Text, Button, Icon, Left, Body, Right } from 'native-base';
export default class Location extends React.Component {

   url='https://hr.comquas.com/api';
   constructor(props){
       super(props);
       this.state={
          locations:[],
          prompt:false,
          title:'',
          progress:false,
          editloc:'',
          editid:''
       }       
       this.fetchData();
       this.handleBackButtonClick=this.handleBackButtonClick.bind(this);
   }
	static navigationOptions = {
                title:'Office Location',
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
    fetch(this.url+'/locations', {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer' +window.token,
     },
   })
     .then(response => response.json())
     .then(res => {
       this.setState({ locations: res.data});              
     });
 }
 locations(){
      return this.state.locations.map((req)=>{
        return (
              <CardItem>
                <Left><Text>{req.name}</Text></Left>   
                <Icon name="edit" type="FontAwesome" onPress={()=>{this.setState({editloc:req.name}),this.setState({editid:req.id}),this.setState({prompt:true}),this.setState({title:"Edit location"})}}/>
                <Icon style={{color:'maroon'}} name="delete-forever" type="MaterialIcons" onPress={()=>this.delete(req.id)}/>                  
              </CardItem>
          )
      })
 }
delete(id){
  this.setState({progress:true})
  fetch(this.url+'/location/'+id, {
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
 new (input) {
  this.setState({progress:true})
  fetch(this.url+'/location', {
     method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
      body: JSON.stringify({
        name : input,
      })
    })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({progress:false})
       this.setState({prompt:false})
     });
 }
 edit (input) {
  this.setState({progress:true})
  fetch(this.url+'/location/'+this.state.editid, {
     method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + window.token,
      },
      body: JSON.stringify({
        name : input,
      })
    })
     .then(response => response.json())
     .then(res => {       
       this.fetchData();
       this.setState({progress:false})
       this.setState({prompt:false})
     });
 }
  render() {
    return (
    	<Container>
         <Content>
            <Card>    
              <CardItem>
                <Left><Text style={{fontWeight:'bold'}}>Location</Text></Left>               
                <Right>               
                <Button style={{height:30}} rounded> 
                <Icon name="add" type="MaterialIcons" onPress={()=>{this.setState({editloc:''}),this.setState({prompt:true}),this.setState({title:"New location"})}}/>
                </Button>
                </Right>
              </CardItem>                         
                {this.locations()}
            </Card>
         </Content>
         <AlertInput
           title = {this.state.title}
           placeholder= {this.state.editloc?this.state.editloc:"location"}
           show = {this.state.prompt}
           onSubmit = {(input)=>{this.state.editloc?this.edit(input):this.new(input)}}
           onCancel = {()=>this.setState({prompt:false})}
         />
         <ProgressDialog 
            visible={this.state.progress} 
            title='Processing...'
            message="Please, wait..."
         />
      </Container>
    );
  }
}
