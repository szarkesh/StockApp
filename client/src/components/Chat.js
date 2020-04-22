import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import ChatMessages from './ChatMessages'
import NewChat from './NewChat'
import { PRIMARY, HIGHLIGHT, LIGHTER, DEFAULTSHADOW, API_ENDPOINT } from './Constants'
import {OverlayTrigger, Popover, Button, Tooltip} from 'react-bootstrap';
import Popup from 'reactjs-popup'
import {dot1Key, dot2Key, dot3Key} from './KeyFrames'
import ChatInput from './ChatInput';
import UserCircle from './UserCircle';

const Container = styled.div`
  align-items: center;
  height: 100vh !important;
`;

const Flex = styled.div`
  display: flex;
  width:100%;
  height: 100vh;
`

const LeftHalf = styled.div`
  flex: 0 0 320px;
  position: relative;
  transform: translateX(0);
  border-right: 1px solid #DDDDDD;
  border-left: 1px solid #DDDDDD;
  height: 100vh;
  overflow-y: scroll;
`

const ScrollArea = styled.div`
`;

const RightHalf = styled.div`
  height: 100%;
  padding: 0px 0px 20px 0px;
  position: relative;
  flex-grow: 1;
`

const ChatViewContainer = styled.div`
  max-height: calc(100vh - 60px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
`

const PreviewStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 0px;
  height:80px;
  width: 200px;
  justify-content: start;
  cursor: pointer;
`

const TypingPreview = styled.div`
    background: #D8D7D7;
    height: 25px !important;
    width: 40px !important;
    position: relative;
    border-radius: 20px 20px 20px 3px;
    margin-bottom: 10px;
    position: relative;
    margin-left: 10px;
`

const Dot = styled.div`
    position: absolute;
    width: 6px;
    height: 6px;
    background: #B1B0B0;
    border-radius: 50%;
    left: ${props=>props.left};
    bottom: 9px;
    animation: ${props=>props.kf} 1s ease-in-out 0s infinite;
`

const FloatingButton = styled.button`
  border-radius: 50%;
  background: ${PRIMARY};
  color: white;
  padding: 25px;
  font-size: 25px;
  box-shadow: ${DEFAULTSHADOW};
  position: fixed;
  bottom: 30px;
  left: 230px;
  transition:0.2s;
  :hover{
    background: ${LIGHTER};
  }
  div{
    position:absolute;
    bottom:8px;
    right:16px;
  }
`

const ChatName = styled.div`
    display: block;
    font-weight: ${props=>props.seen===true ? 'normal' : 'bold'};
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
`


const LastMsg = styled.div`
    font-size: 12px;
    color: ${props=>props.seen ? "#BBBBBB" : 'black'};
    font-weight: ${props=>props.seen ? "normal": "bold"};
    overflow: hidden;
    text-overflow: ellipsis;
`

const Heading = styled.div`
    font-weight: bold;
    font-size: 30px;
    padding: 20px 30px;
    border-bottom: 1px solid #DDDDDD;
`

const OneFifthGrid = styled.div`
    display: grid;
    grid-template-columns: 3fr 12fr 2fr;
    border-bottom: 1px solid #DDDDDD;
    :hover{
      background: ${props=>props.active ? "#F0F0F0" : HIGHLIGHT};
    }
    ${props=>props.active && "background:#F0F0F0;"}
`

const Center = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width:80px;
    height:80px;
`

const Cog = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i{
        font-size: 12px;
        color: #CCCCCC;
        transition: 0.1s all;
        :hover{
            color: #999999;
        }
    }
`

const ChatOptions = styled.div`
    div{
        cursor: pointer;
        padding: 0px 5px;
        :hover{
            background: ${HIGHLIGHT};
        }
    }
`

function Chat({user}){

  let [chats, setChats] = React.useState([]);

  let [activeChat, setActiveChat] = React.useState(null);

  let [activeData, setActiveData] = React.useState(null);

  let [newChat, setNewChat] = React.useState(false);

  let [profMap, setProfMap] = React.useState(false);

  let [typers, setTypers] = React.useState([]);

  let inputRef = React.useRef();


  let [scrollTop, setScrollTop] = React.useState(0);

  let [mustScrollDown, setMustScrollDown] = React.useState(false);

  //let currChatRef = React.useRef();

  let getAllChats = () => {
    fetch(`/chat/allChats`, {
      credentials:"include"
    }).then((res)=>res.json()).then((data)=>{
      //console.log(data);
      setChats(data);
    });
  }
  React.useEffect(()=>{
      fetch("/chat/profPics", {
          credentials:"include"
      }).then((res)=>res.json()).then((data)=>{
          setProfMap(data);
      });
      getAllChats();
}, []);

  React.useEffect(()=>{
    const interval = setInterval(() => {
      if(activeChat){
        getChat(activeChat);
      }
      getAllChats();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
})

    // React.useEffect(()=>{
    //     if(scrollTop!=null && currChatRef.current){
    //         currChatRef.current.scrollTop = scrollTop;
    //         setScrollTop(null);
    //     }
    // },[activeData])

  let getChat = (id) => {
    console.log('getting chat ' + id);
    setNewChat(false);
    if(id){
      fetch(`/chat/getChat`, {
        method:'post',
        credentials:'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body:JSON.stringify({_id: id})
      }).then(
        (res)=>res.json()).then((chat)=>{
          setTypers(chat.typers)
          if(id!==activeChat){
              setActiveChat(chat._id)
              setActiveData(chat);
          }
          else if(chat.content.length>0 && (Date.now() - (new Date(chat.content[chat.content.length-1].time))) < 1001){
              // if(currChatRef.current && currChatRef.current.scrollTop!==0){
              //     console.log('setting saving scroll heihgt');
              //     setScrollTop(currChatRef.current.scrollTop);
              // }
              setActiveData(chat);
          }
        });
    }
  }

  let switchChat = (id) => {
      fetch(`/chat/removeTyper`, {
        credentials:"include",
        method:'post',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id: activeChat})
      });
      getChat(id);
  }

  let leaveChat = (id) => {
      console.log('boutta leave chat')
      fetch(`/chat/leaveChat`, {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id: id})
    }).then((res)=>res.json()).then((data)=>{
        if(data==="success"){
            console.log("success");
        }
    })
  }



  let sendChat = (chatId, message) => {
    console.log('sending chat');
    setActiveData({...activeData, content: [...activeData.content, {unsent: true, content: message, sender:user, time: Date.now()}]})
    fetch(`/chat/message`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({_id: chatId, "messageContent": message})
  }).then((res)=>res.json()).then((data)=>{
      setMustScrollDown(true);
      getChat(chatId);
  });
  }

  let createNewChat = () =>{
    setActiveChat(null);
    setNewChat(true);
  }
  let sortedChats = chats.concat().sort((b,a)=>(a["last_message"] && b["last_message"]) ? (new Date(a["last_message"].time) - new Date(b["last_message"].time)) : -1);



  return (
    <Container>
      <Flex>
        <LeftHalf>
            <Heading>Chat</Heading>
            <ScrollArea>
                {sortedChats.map((item, idx) => {
                    if(idx===0 && activeChat===null && newChat===false){
                        setActiveChat(item._id)
                        getChat(item._id)
                    }
                    return (
                        <OneFifthGrid key={item["users"].join(', ')} active={activeChat === item._id}>
                            <Center onClick={()=>switchChat(item["_id"])}>
                                <UserCircle profileMap={profMap} usernames={item["users"]}/>
                            </Center>
                            <PreviewStyle onClick={()=>switchChat(item["_id"])}>
                                <ChatName seen={item.seen}>{item["users"].join(', ')}</ChatName>
                                {item["last_message"] && <LastMsg seen={item.seen}>{item["last_message"].sender === user ? 'You' : item["last_message"].sender}: {item["last_message"].content}</LastMsg>}
                            </PreviewStyle>
                            <Popup style={{height:"20px"}} trigger={<Cog><i className="fas fa-cog"></i></Cog>}
                                position="left"
                                closeOnDocumentClick>
                                <ChatOptions>
                                    <div onClick={()=>leaveChat(item._id)}>Leave Chat</div>
                                </ChatOptions>
                            </Popup>
                        </OneFifthGrid>)

                })}
                <FloatingButton onClick={()=> createNewChat()}><div>+</div></FloatingButton>
            </ScrollArea>
        </LeftHalf>
        <RightHalf>
          <div style={{padding:"10px",height:"100%"}} onClick={()=>(inputRef.current && inputRef.current.focus())}>
              {activeChat &&
                  <>
                    <ChatViewContainer>
                        {typers && typers.map((item) => <TypingPreview>&nbsp;<Dot kf={dot1Key} left="7px"></Dot><Dot kf={dot2Key} left="16px"></Dot><Dot kf={dot3Key} left="25px"></Dot></TypingPreview>)}
                        <ChatMessages user={user} data={activeData}/>
                    </ChatViewContainer>
                    <ChatInput activeChat={activeChat} inputRef={inputRef} sendChat={sendChat}/>
                 </>
            }
              {newChat && <NewChat getChat={getChat} chats={chats} getAllChats={getAllChats} setActiveChat={setActiveChat} setNewChat={setNewChat}/>}
          </div>
        </RightHalf>
      </Flex>
    </Container>
  )
}

export default Chat;
