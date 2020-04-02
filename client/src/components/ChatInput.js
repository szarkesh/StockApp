import React from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react';
import {PRIMARY} from './Constants'

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

    let inputRef = React.useRef();

    const checkSubmit = (e) => {
      if(e.keyCode === 13){ // if enter
        setEmojis(false);
        sendChat(activeChat, e.target.value);
        e.target.value = "";
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
