import React from 'react';
import './App.css';
import styled from 'styled-components';
import Search from './components/Search'
import News from './components/News'
import Home from './components/Home'
import Chat from './components/Chat'
import FadeIn from 'react-fade-in'
import {Button, Popover, OverlayTrigger} from 'react-bootstrap';
import UserCircle from './components/UserCircle'
import Popup from 'reactjs-popup'
import Profile from './components/Profile'
import {PRIMARY, HIGHLIGHT} from './components/Constants'

const LeftBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 70px;
  padding: 10px;
  position: relative;
  padding-top: 100px;
  @media(max-width: 1000px){
      display: none;
  }
`


const LeftBarItem = styled.div`
  padding:8px 8px;
  margin: 12px 0px;
  border-radius: 10px;
  font-size:30px;
  display: flex;
  color: ${props=>props.active ? PRIMARY : "#737373"};
  cursor:pointer;
  transition: 0.2s;
  :hover{
    color: ${PRIMARY}
  }
`

const AccountHolder = styled(LeftBarItem)`
  font-size: 35px;
  position: absolute;
  bottom: 30px;
  margin-left: auto;
  margin-right: auto;
`

const Container = styled.div`
display: flex;
width:100vw;
position:relative;
flex-direction: row;
height:100vh;
background: #FCFCFC;
flex-wrap: nowrap`

const ChatOptions = styled.div`
    div{
        cursor: pointer;
        padding: 0px 5px;
        :hover{
            background: ${HIGHLIGHT};
        }
    }
`

const BottomBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  background: #EEEEEE;
  justify-content: space-evenly;
  @media(min-width: 1001px){
      display: none;
  }
`

const logout = () => {
  fetch(`/user/logout`,{method:"post", credentials:"include"}).then((data)=>data.json()).then((res)=>{
    if(res==="success"){
      window.location.href ="/signup"
    }
    else{
      console.log(res);
    }
  })
}

const paths = ["/search", "/home", "/news",  "/chat", "/profile"]


function LoggedIn(){
  const [tab, setTab] = React.useState(1);
  const [user, setUser] = React.useState("");


  React.useEffect(() => {

    fetch(`/user/current`,{
      credentials:"include"
    }).then((data)=>data.json()).then((res)=>{
      console.log(res);
      if(res==="NO USER FOUND"){
        window.location.href="/signup"
      }
      else{
        setUser(res);
      }
    });

    if(window.location.pathname==="/search"){
        setTab(0);
    }
    else if(window.location.pathname==="/chat"){
        setTab(3);
    }
    else if(window.location.pathname==="/news"){
        setTab(2);
    }
    else if(window.location.pathname==="/profile"){
        setTab(4);
    }
},[])

React.useEffect(()=>{
    window.history.pushState('Avana', 'Avana', paths[tab]);
},[tab])

  return (
    <div>{user &&
        <Container>
            <LeftBarContainer>
              <LeftBarItem active={tab===0} onClick={()=>setTab(0)}><i className="fas fa-search"></i></LeftBarItem>
              <LeftBarItem active={tab===1} onClick={()=>setTab(1)}><i className="fas fa-home"></i></LeftBarItem>
              <LeftBarItem active={tab===2} onClick={()=>setTab(2)}><i className="fas fa-newspaper"></i></LeftBarItem>
              <LeftBarItem active={tab===3} onClick={()=>setTab(3)}><i className="fas fa-comment"></i></LeftBarItem>

              <AccountHolder onClick={()=>setTab(4)}>
                  <UserCircle size="20" usernames={[user.user]}/>
              </AccountHolder>
            </LeftBarContainer>
            <BottomBarContainer>
              <LeftBarItem active={tab===0} onClick={()=>setTab(0)}><i className="fas fa-search"></i></LeftBarItem>
              <LeftBarItem active={tab===1} onClick={()=>setTab(1)}><i className="fas fa-home"></i></LeftBarItem>
              <LeftBarItem active={tab===2} onClick={()=>setTab(2)}><i className="fas fa-newspaper"></i></LeftBarItem>
              <LeftBarItem active={tab===3} onClick={()=>setTab(3)}><i className="fas fa-comments"></i></LeftBarItem>
            </BottomBarContainer>
          <div style={{flexGrow: "1", height:"100vh", overflowY:"scroll"}}>
            {tab===0 && <FadeIn><Search user={user}/></FadeIn>}
            {tab===1 && <FadeIn><Home user={user}/></FadeIn>}
            {tab===2 && <FadeIn><News/></FadeIn>}
            {tab===3 && <FadeIn><Chat user={user ? user.user : null}/></FadeIn>}
            {tab===4 && <FadeIn><Profile user={user}/></FadeIn>}
          </div>
      </Container>
    }</div>
  );
}

export default LoggedIn;
