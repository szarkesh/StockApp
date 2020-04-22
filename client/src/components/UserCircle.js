import React from 'react'
import styled from 'styled-components'
import {DEFAULTSHADOW} from './Constants'
import {OverlayTrigger, Popover, Tooltip} from 'react-bootstrap'
//import Circle from './Circle'


const Container = styled.div`
`

const OneByTwo = styled.div`
    display: grid;
    grid-template-rows: 20px 20px;
    grid-template-columns: auto;
    margin-top: -30px;
    grid-row-gap: 1px;
    position: relative;
`

const TwoByTwo = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 30px 30px;
    grid-template-columns: 30px 30px;
    grid-row-gap: 2px;
    grid-column-gap: 2px;
`

const Triangle = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`


const CircleContainer = styled.div`
    border-radius: 50%;
    background: #999999;
    text-transform: uppercase;
    position: relative;
    width: ${props=>props.size*2}px;
    height: ${props=>props.size*2}px;
    ${props=>props.shadow && ("box-shadow: " + DEFAULTSHADOW + ";")}
    span{
        color: #EEEEEE  ;
        font-size: ${props=>props.size}px;
        display: block;
        margin: auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
`


const ImageHolder = styled.div`
    position: relative;
    width: ${props=>props.size*2}px;
    height: ${props=>props.size*2}px;
    cursor: pointer;
    img{
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
`

function UserCircle({usernames, profileMap, size}){


    const Circle = ({name, size, shadow})=>(
        <OverlayTrigger
            placement={'right'}
            delay={{ show: 200, hide: 500 }}
            overlay={
                <Popover id="popover-basic">
                  <Popover.Title as="h3">{name}</Popover.Title>
                  <Popover.Content>
                    Joined April 2020.
                  </Popover.Content>
                </Popover>
                }
          >
            {profileMap && profileMap[name] ?
                 <ImageHolder size={size}><img src={profileMap[name]}/></ImageHolder>
             :
             <CircleContainer size={size} shadow={shadow}><span>{name.substring(0,2)}</span></CircleContainer>
         }
        </OverlayTrigger>
    )

    if(usernames.length===0){
        return <Container></Container>
    }
    if (usernames.length===1) {
        return (
            <Circle size={size || "25"} name={usernames[0]}></Circle>
        )
    }
    else if (usernames.length==2){
        return (
            <OneByTwo>
                <Circle size="22" name={usernames[0]}></Circle>
                <Circle style={{marginLeft:"20px"}} size="22" name={usernames[1]}></Circle>
            </OneByTwo>
        )
    }
    else if (usernames.length===3){
        return (
            <Container>
                <Triangle>
                    {usernames.map((username)=><Circle size="15" name={username}></Circle>)}
                </Triangle>
            </Container>
        )
    }
    else if (usernames.length===4){
        return (
            <Container>
                <TwoByTwo>
                    {usernames.map((username)=><Circle size="15" name={username}></Circle>)}
                </TwoByTwo>
            </Container>
        )
    }
    else{
        return (
            <Container>
                <TwoByTwo>
                    {usernames.slice(0,3).map((username)=><Circle size="15" name={username}></Circle>)}
                    <Circle size="15" name={`+${usernames.length-3}`}></Circle>
                </TwoByTwo>
            </Container>
        )
    }
}

export default UserCircle
