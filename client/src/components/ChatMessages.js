import React from 'react'
import styled from 'styled-components'
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import UserCircle from './UserCircle';
import {PRIMARY} from './Constants'

const ChatBubble = styled.div`
  background: ${props=>props.sent ? PRIMARY : "#F1F0F0"};
  max-width: 70%;
  color: ${props=>props.sent ? 'white' : 'black'};
  padding: ${props=>props.sent ? '5px 12px 5px 13px' : '5px 13px 5px 12px'}; ;
  border-radius: ${props=>props.sent ? "30px 30px 8px 30px" : "30px 30px 30px 8px"};
  a{
      color:${props=>props.sent ? 'white' : 'black'};
      text-decoration: underline;
  }
`;

const ChatBubbleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props=>props.sent ? 'flex-end' : 'flex-start'};
  padding-left: 30px;
  padding-right: 20px;
  margin-top: 1px;
  margin-bottom: ${props=>props.timePassed ? '10px' : '1px'};
  position: relative;
  i{
      color: ${PRIMARY};
      font-size: 12px;
      position: absolute;
      right: 7px;
      bottom: 1px;
  }
  .circle{
      position: absolute;
      bottom: 1px;
      left: 0px;
  }
`;


const CenteredText = styled.div`
    width: 100%;
    text-align: center;
    color: #AAAAAA;
    font-size: 13px;
    font-weight: bold;
    margin: 5px;
    margin-bottom: 10px;
`

const EmptyText = styled(CenteredText)`
    padding: 200px;
    font-size: 15px;
`

const ImageContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: ${props=>props.sent ? "flex-end" : "flex-start"};
    position: relative;
    padding: 10px 10px 20px 30px;
    img{
        border-radius: 15px;
        border: 1px solid #CCCCCC;
    }
    .circle{
        position: absolute;
        left: 0px;
        bottom: 20px;
    }
`

let stringify = (str) => {
      if(!str){
          return undefined;
      }
      var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

      // www. sans http:// or https://
      var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

      // Email addresses
      var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
      return str
          .replace(urlPattern, '<a target="_blank" href="$&">$&</a>')
          .replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>')
          .replace(emailAddressPattern, '<a target="_blank" href="mailto:$&">$&</a>');
};

function ChatMessages({data, user, setOpenImage}){
    return (
            <>
                {data && data.content.slice(0).reverse().map((item, idx, arr) =>
                    <>
                        {item.image &&
                            <ImageContainer onClick={()=>setOpenImage(item.image)} sent={user===item.sender}>
                                <img width="500" src={item.image}/>
                                {(item.sender!==user && (idx === 0 || arr[idx-1].sender!==item.sender || (new Date(arr[idx-1].time)) - (new Date(item.time)) > 30000)) &&  <div className="circle"> <UserCircle size="12" usernames={[item.sender]}></UserCircle></div>}
                            </ImageContainer>
                        }
                        {/\S/.test(item.content) &&
                            <ChatBubbleContainer onClick={(e)=>e.stopPropagation()} timePassed={idx === 0 || (new Date(arr[idx-1].time)) - (new Date(item.time)) > 30000} sent={user===item.sender}>
                                <OverlayTrigger
                                placement={user===item.sender ? 'left' : 'right'}
                                delay={1000}
                                overlay={
                                  <Tooltip id={`tooltip`}>
                                    <strong>{(new Date(item.time)).toLocaleString()}</strong>.
                                  </Tooltip>
                                    }
                                >
                                    <ChatBubble
                                        sent={user===item.sender}
                                        key={idx} dangerouslySetInnerHTML={{__html: stringify(item.content)}}></ChatBubble>
                                </OverlayTrigger>
                                {(item.sender!==user && (idx === 0 || arr[idx-1].sender!==item.sender || (new Date(arr[idx-1].time)) - (new Date(item.time)) > 30000)) &&  <div className="circle"> <UserCircle size="12" usernames={[item.sender]}></UserCircle></div>}
                                {(item.sender===user && idx < 5) && (item.unsent ? <i className="far fa-check-circle"></i> : <i className="fas fa-check-circle"></i>)}
                            </ChatBubbleContainer>
                        }
                        {(idx==arr.length-1 || (new Date(item.time)) - (new Date(arr[idx+1].time)) > 300000) &&
                            <CenteredText>{(new Date(arr[idx].time)).toLocaleTimeString([], { hour:'numeric', minute: '2-digit',hour12:true })}</CenteredText>
                        }
                    </>)}
                <>{(!data || data.content.length==0) && <EmptyText>No one's said anything yet...</EmptyText>}</>
            </>
    )
}

export default ChatMessages
