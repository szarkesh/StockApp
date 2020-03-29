import React from 'react';
import './App.css';
import styled from 'styled-components';
import Search from './components/Search'
import News from './components/News'
import Home from './components/Home'
import Chat from './components/Chat'
import FadeIn from 'react-fade-in'
import {Button, Popover, OverlayTrigger} from 'react-bootstrap';
import {API_ENDPOINT} from './components/Constants'

const LeftBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px !important;
  padding: 10px;
  position: relative;
  padding-top: 100px;
  background: #EEEEEE;
`


const LeftBarItem = styled.div`
  padding:20px 0px;
  font-size:30px;
  display: flex;
  color: ${props=>props.active ? "#333333" : "#888888"};
  cursor:pointer;
  transition: 0.2s;
  :hover{
    color: #555555;
  }
`

const AccountButton = styled(LeftBarItem)`
  font-size: 50px;
  position: absolute;
  bottom: 50px;
  margin-left: auto;
  margin-right: auto;
`

const Container = styled.div`
display: flex;
width:100vw;
position:relative;
flex-direction: row;
height:100vh;
flex-wrap: nowrap`

const BottomBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  background: #EEEEEE;
  justify-content: space-evenly;
`

const logout = () => {
  fetch(`${API_ENDPOINT}/user/logout`,{method:"post", credentials:"include"}).then((data)=>data.json()).then((res)=>{
    if(res==="success"){
      window.location.href ="/signup"
    }
    else{
      console.log(res);
    }
  })
}


function LoggedIn() {
  const [tab, setTab] = React.useState(1);
  const [user, setUser] = React.useState("");
  const popover =  (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Logged in as <b>{user}</b></Popover.Title>
      <Popover.Content>
        <Button onClick={()=>logout()}>Sign out</Button>
      </Popover.Content>
    </Popover>
  );


  React.useEffect(() => {

    fetch(`${API_ENDPOINT}/user/current`,{
      credentials:"include"
    }).then((data)=>data.json()).then((res)=>{
      if(res==="no user found"){
        window.location.href="/signup"
      }
      else{
        console.log('user is' + res);
        setUser(res);
      }
    });
  })

  const leftBar =
  (<LeftBarContainer>
    <LeftBarItem active={tab===0} onClick={()=>setTab(0)}><i class="fas fa-search"></i></LeftBarItem>
    <LeftBarItem active={tab===1} onClick={()=>setTab(1)}><i class="fas fa-home"></i></LeftBarItem>
    <LeftBarItem active={tab===2} onClick={()=>setTab(2)}><i class="fas fa-newspaper"></i></LeftBarItem>
    <LeftBarItem active={tab===3} onClick={()=>setTab(3)}><i class="fas fa-comments"></i></LeftBarItem>

    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
      <AccountButton><i class="fas fa-user-circle"></i></AccountButton>
    </OverlayTrigger>
  </LeftBarContainer>);

  const bottomBar =
  (<BottomBarContainer>
    <LeftBarItem active={tab===0} onClick={()=>setTab(0)}><i class="fas fa-search"></i></LeftBarItem>
    <LeftBarItem active={tab===1} onClick={()=>setTab(1)}><i class="fas fa-home"></i></LeftBarItem>
    <LeftBarItem active={tab===2} onClick={()=>setTab(2)}><i class="fas fa-newspaper"></i></LeftBarItem>
    <LeftBarItem active={tab===3} onClick={()=>setTab(3)}><i class="fas fa-comments"></i></LeftBarItem>
  </BottomBarContainer>);


  return (
    <Container>
      {window.innerWidth > 800 ? leftBar : bottomBar}
      <div style={{flexGrow: "1", height:"100vh", overflowY:"scroll"}}>
        {tab===0 && <FadeIn><Search user={user}/></FadeIn>}
        {tab===1 && <FadeIn><Home/></FadeIn>}
        {tab===2 && <FadeIn><News/></FadeIn>}
        {tab===3 && <FadeIn><Chat user={user}/></FadeIn>}
      </div>
    </Container>
  );
}

export default LoggedIn;
