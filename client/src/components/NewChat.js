import React from 'react';
import styled from 'styled-components';
import {PRIMARY, SECONDARY, HIGHLIGHT, API_ENDPOINT } from './Constants'


const SearchResult = styled.div`
  color: black;
  padding: 10px;
  border: solid 1px lightgray;
  cursor: pointer;
  max-width: 300px;
  background: white;
  :hover{
    background: ${HIGHLIGHT}
  }
`

const UserBox = styled.span`
  background: ${PRIMARY};
  color: white;
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
  border: 2px solid ${SECONDARY};
`

const ChatInput = styled.input`
  border-radius: 50px;
  border: 1px solid #999999;
  flex-grow: 1;
  padding: 5px 10px;
  :focus{
    outline: none;
    border: 2px solid ${PRIMARY};
  }
`;

const MyButton = styled.button`
  border: solid 2px ${PRIMARY};
  background: ${SECONDARY};
  color: white;
  outline: none;
  padding: 3px 10px;
  font-size: 20px;
  border-radius: 100px;
  cursor: pointer;
  margin: 0px 10px;
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

function NewChat({getAllChats, setNewChat, setActiveChat}){

  const [usernames, setUsernames] = React.useState([]);
  const [results, setResults] = React.useState([]);

  let searchRef = React.createRef(null);

  const updateResults = (e) => {
    fetch(`${API_ENDPOINT}/chat/getUsername?username=${e.target.value}`,{
      credentials:'include',
    }).then((res)=>res.json()).then((data)=>{
      setResults(data);
    })
  }

  const createChat = () => {
    console.log('creating chat')
    fetch(`${API_ENDPOINT}/chat/create`,{
      credentials:'include',
      method:'post',
      headers: {
      'Content-Type': 'application/json'
      },
      body:JSON.stringify({ids: usernames.map((item)=>item._id)})
    }).then((res)=>res.json()).then((data)=>{
      console.log(data);
      setNewChat(false);
      getAllChats()
      setActiveChat(data)})
  }

  return(
    <div>
      <div style={{marginBottom:"10px"}}>
        {usernames.map((item, idx) => <UserBox key={idx}>{item.user}</UserBox>)}
      </div>
      <Flex>
        <ChatInput ref={(ref) => searchRef = ref} autoFocus onKeyDown={updateResults} placeholder="Search for users..."/>
        <MyButton onClick={()=>createChat()}>Create chat</MyButton>
      </Flex>
      <div>
        {results.map((item, idx) => <SearchResult key={idx} onClick={()=>(setUsernames([...usernames, item]), setResults([]), searchRef.value = "", searchRef.focus())}>{item.user}</SearchResult>)}
      </div>
    </div>
  )

}

export default NewChat;
