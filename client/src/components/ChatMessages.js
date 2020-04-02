import React from 'react'
import styled from 'styled-components'

const ChatViewContainer = styled.div`
  max-height: calc(100vh - 125px);
  overflow-y: scroll;
`

const ChatBubbleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props=>props.sent ? 'flex-end' : 'flex-start'};
`;

function ChatMessages({data}){
    return (<ChatViewContainer>
          <div>
            {data && data.content.map((item, idx) => <ChatBubbleContainer sent={user===item.sender}><ChatBubble sent={user===item.sender} key={idx}>{item.content}</ChatBubble></ChatBubbleContainer>)}
          </div>
        </ChatViewContainer>
    )
}

export default ChatMessages
