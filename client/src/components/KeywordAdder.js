import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import {PRIMARY, SECONDARY, HIGHLIGHT, API_ENDPOINT } from './Constants'

const chatBubble = ({sender, text}) => (
  <div>text</div>
)

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
  display: inline-flex;
  flex-direction: row;
  align-items: center;
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
  border: solid 2px ${props=> props.disabled ? '#CCCCCC': PRIMARY};
  background: ${props=> props.disabled ? '#DDDDDD': SECONDARY};
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

const Icon = styled.i`
    font-size: 12px;
    margin-left: 10px;
    margin-right: 5px;
    color: #444444;
    cursor: pointer;
`;
function KeywordAdder({sendBack}){

  const [keywords, setKeywords] = React.useState([]);
  const [results, setResults] = React.useState([]);

  let searchRef = React.createRef(null);

  React.useEffect(()=>{
     fetch(`${API_ENDPOINT}/api/topics`,{
         credentials:"include"
     }).then((res)=>res.json()).then((data)=>{
         console.log('data is ' + JSON.stringify(data));
         setKeywords(data['topics'])
     })
 }, []);

  const updateResults = (e) => {
    fetch(`${API_ENDPOINT}/api/searchTopics?topic=${e.target.value}`,{
      credentials:'include',
    }).then((res)=>res.json()).then((data)=>{
        setResults(data.filter(x=>!keywords.includes(x.name)));
    })
  }

  const addKeyword = (item) => {
      setKeywords([...keywords, item])
      setResults([]);
      searchRef.value = "";
      searchRef.focus();
      fetch(`${API_ENDPOINT}/api/topics/add`, {
        method:'post',
        credentials:'include',
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
        body: JSON.stringify({topic:item})
      });
  }

  const removeKeyword = (item) => {
      const index = keywords.indexOf(item.toUpperCase());
      if (index > -1) {
        setKeywords([...keywords.slice(0,index),
            ...keywords.slice(index+1,keywords.length)]);
      }
      fetch(`${API_ENDPOINT}/api/topics/remove`, {
        method:'post',
        credentials:'include',
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
        body: JSON.stringify({topic:item})
      });
  }
  return(
    <div>
        {console.log(results)}
      <div style={{marginBottom:"10px"}}>
        {keywords.map((item, idx) => <UserBox key={idx}>
                                        <div>{item}</div>
                                        <Icon className="fas fa-times" onClick={()=>removeKeyword(item)}></Icon>
                                    </UserBox>)}
      </div>
      <Flex>
        <ChatInput ref={(ref) => searchRef = ref} autoFocus onKeyDown={updateResults} placeholder="Search for topics..."/>
        <MyButton disabled={keywords.length===0} onClick={()=>sendBack(keywords)}>Find news!</MyButton>
      </Flex>
      <div>
        {results.map((item, idx) =>
            <SearchResult key={idx}
                        onClick={()=>addKeyword(item.name)}>
                {item.name}
            </SearchResult>)}
      </div>

    </div>
  )

}

export default KeywordAdder;
