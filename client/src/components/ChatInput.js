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

const UploadBtn = styled(EmojiButton)`
    right: 30px;
`

function ChatInput({activeChat, sendChat, inputRef}){

    let [emojis, setEmojis] = React.useState(false);

    let [isTyping, setIsTyping] = React.useState(true);

    let filePicker = React.useRef();

    let [timeoutHandle, setTimeoutHandle] = React.useState(0);

    React.useEffect(()=>{
        fetch(`/chat/${isTyping ? 'add' : 'remove'}Typer`, {
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
        sendChat(activeChat, inputRef.current.value);
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

    const uploadChatPic = (file) => {
        if(file){
            const formData = new FormData();
            formData.append('element1','Example text')
            formData.append('element2',file)
            fetch('/api/upload', {
                method:'post',
                body:formData
            }).then((res)=>res.json()).then((res)=>{
                sendChat(activeChat, inputRef.current.value, `/api/getFile?filename=${res}`);
            })
        }
    }

    return (
        <ChatInputContainer>
                          <ChatInputStyle key={activeChat} ref={inputRef} onKeyDown={checkSubmit} autoFocus placeholder="Type away..."/>
                          <UploadBtn onClick={()=>filePicker.current.click()}><i className="fas fa-file-upload"></i></UploadBtn>
                          <EmojiButton onClick={()=>setEmojis(!emojis)}><i className="far fa-smile-beam"></i></EmojiButton>
                          <input ref={filePicker} style={{ display: "none" }} type="file" name="file" onChange={(event)=>uploadChatPic(event.target.files[0])}/>
                          {emojis && <Picker style={{marginBottom:"20px"}} onEmojiClick={onEmojiClick}/>}
      </ChatInputContainer>)
}

export default ChatInput;
