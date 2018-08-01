import React from "react";
import { Image, TouchableOpacity } from "react-native";
import Drawer from 'react-native-drawer';
import { CheckBox,ListItem,Container,
		 Header, Title, Left, Icon, Right,
		 Button, Body, Content, Text, Card, 
		 CardItem, Badge, Footer, FooterTab } from "native-base";		 
import { ConfirmDialog } from 'react-native-simple-dialogs';

export default class Home extends React.Component {
	url='https://hr.comquas.com/api';	
	static navigationOptions={
		header:null
	};
	constructor(props){
		super(props);
		this.state={
			dialogVisible:false,
			name : '',
			no_of_leave : '',
			sick_leave : '',
			avatar : '',
			birthday:[],
	        nobirthday:0,
	        anniversary:[],
	        noanni:0,
	        notimeoff:0,
	        timeoff:[],
	        showbirthday:false,
      		showanni:false,
      		showtimeoff:false,      		
		}
		this.fetchData();
		this.fetchbirthday();
		this.fetchanniversary();
		this.fetchtimeoff();
	}
	 componentDidMount(){
    this.timer=setInterval(
      ()=>this.tick(),10000
	  )
	  }
	  componentWillUnmount(){
	    clearInterval(this.timer);
	  }  
	  tick(){	  
	  	this.fetchanniversary();
	    this.fetchbirthday();  
	    this.fetchtimeoff();
	  }	
	fetchData(){
		fetch(this.url+'/user/detail',{
			method : 'GET',
			headers : {
				Accept : 'application/json',
				'Content-Type' : 'application/json',
				Authorization : 'Bearer' + window.token,
			},
		}).then(response => response.json())
		.then(res => {
			this.setState({name:res.name});
			this.setState({no_of_leave:res.no_of_leave});
			this.setState({sick_leave:res.sick_leave});
			this.setState({avatar:res.avatar});
		})
	}
	fetchbirthday() {   
		fetch(this.url+'/birthday', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer' + window.token,
			},
		})
		.then(response => response.json())
		.then(res => {            
			this.setState({nobirthday : res.length})
			this.setState({birthday:res})
		});
	}  
	fetchanniversary() {   
		fetch(this.url+'/anniversary', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer' + window.token,
			},
		})
		.then(response => response.json())
		.then(res => {            
			this.setState({noanni : res.length})
			this.setState({anniversary:res})
		});
	}  
	fetchtimeoff() {   
		fetch(this.url+'/time_off', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer' + window.token,
			},
		})
		.then(response => response.json())
		.then(res => {            
			this.setState({notimeoff : res.data.length})
			this.setState({timeoff:res.data})
		});
	}
	
	closeControlPanel = () => {
		this._drawer.close()
	}
	openControlPanel = () => {
		this._drawer.open()
	}
	timeoffrequest () {
		this.props.navigation.navigate('timeoffrequest');
	}
	timeofflist () {
		this.props.navigation.navigate('timeofflist');
	}
	userlist () {
	 	this.props.navigation.navigate('userlist');
	}	
	location () {
		this.props.navigation.navigate('location');
	}
	position () {
		this.props.navigation.navigate('position');
	}
	logout = () => {
	     window.token = '';
	     this.props.navigation.navigate('login');
  	};
  	birthday(){
  		return this.state.birthday.map(req=>{
  			return(
  				<CardItem style={{backgroundColor:'#99C8FA'}}>
        		<Left><Text>{req.name} birthday</Text></Left>
        		</CardItem>
  				)
  		})
  	}
  	anniversary(){
  		return this.state.anniversary.map(req=>{
  			return (
  				<CardItem style={{backgroundColor:'#99C8FA'}}>
        		<Left><Text>{req.name} anniversary</Text></Left>
        		</CardItem>
  				)
  		})
  	}
  	timeoff(){
  		return this.state.timeoff.map(req=>{
  			return (
  				<CardItem style={{backgroundColor:'#99C8FA'}}>
        		<Left><Text>{req.name} timeoff</Text></Left>
        		</CardItem>
  				)
  		})
  	}

  render() {
    return (
    	<Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={
          <Container>
              <Image style={{height:150,width: '100%',backgroundColor:'black'}} source={require('../images/logo.png')} resizeMode="contain"/>
              <Content>
              	  <ListItem onPress={()=>{this.closeControlPanel(),this.userlist()}}>
		              <Left>
		              <Icon name="person"/><Text>   </Text><Text>EMPLOYEE</Text>
		              </Left>
	              </ListItem>
	              <ListItem onPress={()=>{this.closeControlPanel(),this.position()}}>
	              	  <Left>
	              	  <Icon name="professional-hexagon" type="MaterialCommunityIcons"/><Text>   </Text><Text>POSITIONS</Text>
	              	  </Left>
	              </ListItem>
	              <ListItem onPress={()=>{this.closeControlPanel(),this.location()}} dark>              
		              <Left>
		              <Icon name="location-pin" type="Entypo"/><Text>   </Text><Text>OFFICE LOCATIONS</Text>
		              </Left>
	              </ListItem>
	              <ListItem onPress={()=>{this.closeControlPanel(),this.timeoffrequest()}}>
		              <Left>
		              <Icon name="timer-off" type="MaterialIcons"/><Text>   </Text><Text>TIME-OFF Requests</Text>
		              </Left>
	              </ListItem>
	              <ListItem onPress={()=>{this.closeControlPanel(),this.timeofflist()}}>              
		              <Left>
		              <Icon name="timer-off" type="MaterialIcons"/><Text>   </Text><Text>TIME-OFF Lists</Text>
		              </Left>
	              </ListItem>
	              <ListItem onPress={()=>{this.closeControlPanel(),this.setState({dialogVisible:true})}}>
	              	  <Left>
	              	  <Icon name="md-log-out"/><Text>   </Text><Text>LOGOUT</Text>	              	  
	              	  </Left>
	              </ListItem>              
              </Content>
          </Container>
        }
        tapToClose={true}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        >
    		<Container>
	        <Header style={{height:80}}>
	          <Left style={{paddingTop:20}}>
	          	<Button transparent onPress={()=>this.openControlPanel()}>
	          		<Icon name="menu" />
	          	</Button>
	          </Left>
	          <Body style={{paddingTop:16,alignItems:'center'}}>
	            <Title>Home</Title>
	          </Body>
	          <Right style={{paddingTop:20}}>
	            <Button transparent>
	            	
	            </Button>
	          </Right>
	        </Header>
	        <Content padder>
	      		<Card transparent>		     
		            <CardItem>
		              <Image source={this.state.avatar?{uri: this.state.avatar }:require('../images/default.jpg')} style={{height: 180, borderRadius:10, width: null, flex: 1}}/>
		            </CardItem>
		            <CardItem>                
		            <Left><Text>Name</Text></Left><Body><Text>{this.state.name}</Text></Body>                
		            </CardItem>	                
		            <CardItem>                
		            <Left><Text>Annual Leave</Text></Left><Body><Text>{this.state.no_of_leave} day</Text></Body>
		            </CardItem>
		            <CardItem>                
		            <Left><Text>Sick Leave</Text></Left><Body><Text>{this.state.sick_leave} day</Text></Body>                
		            </CardItem>		            
	            </Card>
	        </Content>
	        <ConfirmDialog
		        title="Confirm Logout"
		        message="Are you sure you want to logout?"
		        visible={this.state.dialogVisible}
		        onTouchOutside={() => this.setState({ dialogVisible: false })}
		        positiveButton={{
		        	title: 'YES',
		        	onPress: () => this.logout(),
		        }}
		        negativeButton={{
		        	title: 'NO',
		        	onPress: () => this.setState({ dialogVisible: false }),
		        }}
	        />	  
	        		  {this.state.showbirthday ?  this.birthday() : null}
	                  {this.state.showanni ?  this.anniversary() : null}
	                  {this.state.showtimeoff ?  this.timeoff() : null}     
	        <Footer>
	        	<FooterTab>
	        		{
	        			this.state.nobirthday?
			        	<Button badge vertical onPress={()=>this.state.showbirthday?this.setState({showbirthday:false}):this.setState({showbirthday:true,showanni:false,showtimeoff:false})}>
			        	{this.state.nobirthday?<Badge><Text>{this.state.nobirthday}</Text></Badge>:null}
			        	<Icon name="birthday-cake" type="FontAwesome" />
			        	<Text>birthday</Text>
			        	</Button>:<Button vertical>
			        	<Icon name="birthday-cake" type="FontAwesome" />
			        	<Text>birthday</Text>
			        	</Button>
		            }
		            {
		            	this.state.noanni?
		            	<Button badge vertical onPress={()=>this.state.showanni?this.setState({showanni:false}):this.setState({showanni:true,showbirthday:false,showtimeoff:false})}>
			        	{this.state.noanni?<Badge><Text>{this.state.noanni}</Text></Badge>:null}
			        	<Icon name="like" type="SimpleLineIcons"/>
			        	<Text>anniversary</Text>
			        	</Button>:
			        	<Button vertical>
			        	<Icon name="like" type="SimpleLineIcons"/>
			        	<Text>anniversary</Text>
			        	</Button>
		            }
		        	{
		        		this.state.notimeoff?
		        		<Button badge vertical onPress={()=>this.state.showtimeoff?this.setState({showtimeoff:false}):this.setState({showtimeoff:true,showbirthday:false,showanni:false})}>
			        	{this.state.notimeoff?<Badge><Text>{this.state.notimeoff}</Text></Badge>:null}
			        	<Icon name="timer-off" type="MaterialIcons"/>
			        	<Text>timeoff</Text>
		        		</Button>:
		        		<Button vertical>
		        		<Icon name="timer-off" type="MaterialIcons"/>
			        	<Text>timeoff</Text>
		        		</Button>
		        	}		        	
	        	</FooterTab>
	        </Footer> 
        </Container>
    </Drawer>
    );
  }
}
