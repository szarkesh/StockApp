import React from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react';
import {PRIMARY, API_ENDPOINT} from './Constants'

const ChatInputContainer = styled.div`
    position: absolute;
    bottom: 10px;
    left: auto;
    right: auto;
    width:98%;
`

const ChatInputStyle = styled.input`
  border-radius: 100px;
  border: 1px solid #999999;
  padding: 5px 10px;
  :focus{
    outline: none;
    border: 2px solid ${PRIMARY};
  }
  width:100%;
`;

const EmojiButton = styled.button`
    outline: none;
    border: none;
    color: #888888;
    position: absolute;
    right: 10px;
    font-size: 20px;
    top: 5px;
    background: none;
    :focus{
        outline: none;
    }
`

function ChatInput({activeChat, sendChat}){

    let [emojis, setEmojis] = React.useState(false);

    let [isTyping, setIsTyping] = React.useState(true);

    let [timeoutHandle, setTimeoutHandle] = React.useState(0);

    let inputRef = React.useRef();

    React.useEffect(()=>{
        fetch(`${API_ENDPOINT}/chat/${isTyping ? 'add' : 'remove'}Typer`, {
          credentials:"include",
          method:'post',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({_id: activeChat})
      });
    },[isTyping]);

    const checkSubmit = (e) => {
      if(e.keyCode === 13 && e.target.value.length > 0){ // if enter
        window.clearTimeout(timeoutHandle);
        setIsTyping(false);
        setEmojis(false);
        sendChat(activeChat, e.target.value);
        e.target.value = "";
      }
      else{
          setIsTyping(true);
          window.clearTimeout(timeoutHandle);
          setTimeoutHandle(setInterval(function(){
              setIsTyping(false)
          },2000));
      }
    }

    const onEmojiClick = (e, emojiObject) => {
        inputRef.current.value = inputRef.current.value + emojiObject.emoji;
        inputRef.current.focus();
    }

    return (
        <ChatInputContainer>
                          <ChatInputStyle key={activeChat} ref={inputRef} onKeyDown={checkSubmit} autoFocus placeholder="Type away..."/>
                          <EmojiButton onClick={()=>setEmojis(!emojis)}><i className="far fa-smile-beam"></i></EmojiButton>
                          {emojis && <Picker onEmojiClick={onEmojiClick}/>}
      </ChatInputContainer>)
}

export default ChatInput;
