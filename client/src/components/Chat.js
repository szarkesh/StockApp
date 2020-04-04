import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import NewChat from './NewChat'
import { PRIMARY, HIGHLIGHT, LIGHTER, DEFAULTSHADOW, API_ENDPOINT } from './Constants'
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import ChatInput from './ChatInput';

const Container = styled.div`
  align-items: center;
  height: 100vh !important;
`;

const Flex = styled.div`
  display: flex;
  width:100%;
  grid-template-columns: 400px 400px;
  height:calc(100vh - 100px);
`

const LeftHalf = styled.div`
  flex-basis: 300px;
  position: relative;
  height: 100%;
  overflow-y: scroll;
  border-right: 1px solid #DDDDDD;
`

const RightHalf = styled.div`
  height: 100%;
  padding: 20px 0px 20px 0px;
  position: relative;
  flex-grow: 1;
`
const PreviewStyle = styled.div`
  border-bottom: 1px solid #DDDDDD;
  height:80px;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 30px;
  cursor: pointer;
  :hover{
    background: ${props=>props.active ? "#F2F2F2" : HIGHLIGHT};
  }
  ${props=>props.active && "background:#F2F2F2;"}
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
  left: 330px;
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

const ChatBubble = styled.div`
  background: ${props=>props.sent ? PRIMARY : "#F1F0F0"};
  max-width: 70%;
  color: ${props=>props.sent ? 'white' : 'black'};
  padding: 5px 10px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 1px;
  margin-bottom: ${props=>props.timePassed ? '10px' : '1px'};
  border-radius: ${props=>props.sent ? "10px 10px 3px 10px" : "10px 10px 10px 3px"};
`;

const ChatBubbleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props=>props.sent ? 'flex-end' : 'flex-start'};
`;

const ChatViewContainer = styled.div`
  max-height: calc(100vh - 180px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
`

const CenteredText = styled.div`
    width: 100%;
    text-align: center;
    color: #AAAAAA;
    font-size: 13px;
    font-weight: bold;
`
function Chat({user}){

  const ChatView = ({data}) => (
    <ChatViewContainer ref={currChatRef}>
        {data && data.content.slice(0).reverse().map((item, idx, arr) =>
            <>
                <ChatBubbleContainer sent={user===item.sender}>
                    <OverlayTrigger
                        placement={user===item.sender ? 'left' : 'right'}
                        overlay={
                          <Tooltip id={`tooltip`}>
                            <strong>{(new Date(item.time)).toLocaleTimeString()}</strong>.
                          </Tooltip>
                            }
                      >
                    <ChatBubble timePassed={idx === 0 || (new Date(arr[idx-1].time)) - (new Date(item.time)) > 30000}
                                sent={user===item.sender}
                                key={idx}>{item.content}</ChatBubble>
                    </OverlayTrigger>
                </ChatBubbleContainer>
                {(idx !== 0 && (idx==arr.length-1 || (new Date(item.time)) - (new Date(arr[idx+1].time)) > 300000)) &&
                    <CenteredText>{(new Date(arr[idx].time)).toLocaleTimeString([], { hour:'numeric', minute: '2-digit',hour12:true })}</CenteredText>
                }
            </>)}
    </ChatViewContainer>
  )


  let [chats, setChats] = React.useState([]);

  let [activeChat, setActiveChat] = React.useState(null);

  let [activeData, setActiveData] = React.useState(null);

  let [newChat, setNewChat] = React.useState(false);


  let [scrollTop, setScrollTop] = React.useState(0);

  let [mustScrollDown, setMustScrollDown] = React.useState(false);

  let currChatRef = React.useRef();

  let getAllChats = () => {
    fetch(`${API_ENDPOINT}/chat/allChats`, {
      credentials:"include"
    }).then((res)=>res.json()).then((data)=>{
      setChats(data);
      console.log(data);
    });
  }
  React.useEffect(()=>{
    getAllChats();
}, []);

  React.useEffect(()=>{
    const interval = setInterval(() => {
      if(activeChat){
        getChat(activeChat);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
})

    React.useEffect(()=>{
        if(scrollTop!=null && currChatRef.current){
            currChatRef.current.scrollTop = scrollTop;
            setScrollTop(null);
        }
    },[activeData])

  let refreshActiveChat = () => {
      console.log('refreshing' + activeChat)
      getChat(activeChat)
  }
  let getChat = (id) => {
    console.log(activeData)
    setNewChat(false);
    if(id){
      fetch(`${API_ENDPOINT}/chat/getChat`, {
        method:'post',
        credentials:'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body:JSON.stringify({_id: id})
      }).then(
        (res)=>res.json()).then((chat)=>{
          if(id!=activeChat){
              setActiveChat(chat._id)
              setActiveData(chat);
          }
          else if(chat.content.length>0 && (Date.now() - (new Date(chat.content[chat.content.length-1].time))) < 1001){
              if(currChatRef.current && currChatRef.current.scrollTop!==0){
                  console.log('setting saving scroll heihgt');
                  setScrollTop(currChatRef.current.scrollTop);
              }
              setActiveData(chat);
          }
        });
    }
  }

  let sendChat = (chatId, message) => {
    console.log('sending chat');
    fetch(`${API_ENDPOINT}/chat/message`, {
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
  return (
    <Container>
      <Header>Chat</Header>
      <Flex>
        <LeftHalf>
            {chats.slice(0).reverse().map((item, idx) => <PreviewStyle key={idx} active={activeChat === item._id} onClick={()=>getChat(item["_id"])}>{item["users"].join(', ')}</PreviewStyle>)}
            <FloatingButton onClick={()=> createNewChat()}><div>+</div></FloatingButton>
        </LeftHalf>
        <RightHalf>
          <div style={{padding:"10px"}}>
              {activeChat && <ChatView data={activeData}/>}
              {activeChat && <ChatInput activeChat={activeChat} sendChat={sendChat}/>}
              {newChat && <NewChat getChat={getChat} chats={chats} getAllChats={getAllChats} setActiveChat={setActiveChat} setNewChat={setNewChat}/>}
          </div>
        </RightHalf>
      </Flex>
    </Container>
  )
}

export default Chat;
