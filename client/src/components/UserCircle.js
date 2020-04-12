import React from 'react'
import styled from 'styled-components'
import {DEFAULTSHADOW} from './Constants'

const Container = styled.div`
`

const Circle = styled.div`
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

function UserCircle({usernames, size}){
    if(usernames.length===0){
        return <Container></Container>
    }
    if (usernames.length===1) {
        return (
            <Circle size={size || "25"}><span>{usernames[0].substring(0,2)}</span></Circle>
        )
    }
    else if (usernames.length==2){
        return (
            <OneByTwo>
                <Circle size="22"><span>{usernames[0].substring(0,2)}</span></Circle>
                <Circle shadow style={{marginLeft:"20px"}} size="22"><span>{usernames[1].substring(0,2)}</span></Circle>
            </OneByTwo>
        )
    }
    else if (usernames.length==3){
        return (
            <Container>
                <Triangle>
                    <Circle size="15"><span>{usernames[0].substring(0,2)}</span></Circle>
                    <Circle size="15"><span>{usernames[1].substring(0,2)}</span></Circle>
                    <Circle size="15"><span>{usernames[2].substring(0,2)}</span></Circle>
                </Triangle>
            </Container>
        )
    }
    else if (usernames.length===4){
        return (
            <Container>
                <TwoByTwo>
                    {usernames.map((username)=><Circle size="15"><span><span>{username.substring(0,2)}</span></span></Circle>)}
                </TwoByTwo>
            </Container>
        )
    }
    else{
        return (
            <Container>
                <TwoByTwo>
                    {usernames.slice(0,3).map((username)=><Circle size="15"><span><span>{username.substring(0,2)}</span></span></Circle>)}
                    <Circle size="15"><span>+{usernames.length-3}</span></Circle>
                </TwoByTwo>
            </Container>
        )
    }
}

export default UserCircle
