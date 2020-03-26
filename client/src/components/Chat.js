import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import NewChat from './NewChat'
import { PRIMARY, HIGHLIGHT, LIGHTER, DEFAULTSHADOW, API_ENDPOINT } from './Constants'

const Container = styled.div`
  align-items: center;
  height: 100vh;
`;

const Flex = styled.div`
  display: flex;
  width:100%;
  grid-template-columns: 400px 400px;
  height: 100vh;
`

const LeftHalf = styled.div`
  flex-basis: 300px;
  position: relative;
  height: calc(100% - 100px);
  overflow-y: scroll;
  border-right: 1px solid #DDDDDD;
`

const RightHalf = styled.div`
  height: calc(100% - 100px);
  margin: 20px;
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

const ChatInput = styled.input`
  border-radius: 100px;
  border: 1px solid #999999;
  padding: 5px 10px;
  :focus{
    outline: none;
    border: 2px solid ${PRIMARY};
  }
  position: absolute;
  bottom: 10px;
  width: 100%;
`;

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
  margin: 3px;
  border-radius: ${props=>props.sent ? "10px 10px 3px 10px" : "10px 10px 10px 3px"};
`;

const ChatBubbleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props=>props.sent ? 'flex-end' : 'flex-start'};
`;

const ChatViewContainer = styled.div`
  height:calc(100% - 100px);
  overflow-y: scroll;
`

const chatBubble = ({sender, text}) => (
  <div>text</div>
)

function Chat({user}){


  const checkSubmit = (e) => {
    if(e.keyCode === 13){ // if enter
      sendChat(activeChat, e.target.value);
    }
  }

  const ChatView = ({data}) => (
    <ChatViewContainer>
      <div>
        {data && data.content.map((item, idx) => <ChatBubbleContainer sent={user===item.sender}><ChatBubble sent={user===item.sender} key={idx}>{item.content}</ChatBubble></ChatBubbleContainer>)}
      </div>
      <ChatInput ref={inputRef} onKeyDown={checkSubmit} autoFocus placeholder="Type away..."/>
    </ChatViewContainer>
  )


  let [chats, setChats] = React.useState([]);

  let [activeChat, setActiveChat] = React.useState(null);

  let [activeData, setActiveData] = React.useState(null);

  let [newChat, setNewChat] = React.useState(false);

  let inputRef = React.useRef(null);

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
  },[])

  let getChat = (id) => {
    fetch(`${API_ENDPOINT}/chat/getChat`, {
      method:'post',
      credentials:'include',
      headers: {
      'Content-Type': 'application/json'
      },
      body:JSON.stringify({_id: id})
    }).then(
      (res)=>res.json()).then((chat)=>{
        console.log(chat);
        setActiveChat(chat._id)
        setActiveData(chat);
      });
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
    }).then((res)=>res.json()).then((data)=>getChat(chatId));
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
            {chats.map((item, idx) => <PreviewStyle key={idx} active={activeChat === item._id} onClick={()=>getChat(item["_id"])}>{item["users"].join(', ')}</PreviewStyle>)}
            <FloatingButton onClick={()=> createNewChat()}><div>+</div></FloatingButton>
        </LeftHalf>
        <RightHalf>
          {activeChat && <ChatView data={activeData}/>}
          {newChat && <NewChat getAllChats={getAllChats} setActiveChat={setActiveChat} setNewChat={setNewChat}/>}
        </RightHalf>
      </Flex>
    </Container>
  )
}

export default Chat;
