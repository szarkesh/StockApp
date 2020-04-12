import React from 'react'
import styled from 'styled-components'
import UserCircle from './UserCircle'
import {Button} from 'react-bootstrap'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 20px;
`

const ProfChangeBtn = styled.div`
    color: #999999;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
    :hover{
        text-decoration: underline;
    }
`

const Flex = styled(Container)`
    flex-direction: row;
    max-width: 700px;
    justify-content: space-between;
`

const logout = () => {
  fetch(`/user/logout`,{method:"post", credentials:"include"}).then((data)=>data.json()).then((res)=>{
    if(res==="success"){
      window.location.href ="/signup"
    }
    else{
      console.log(res);
    }
  })
}

function Profile({user}){
    return(
        <Container>
            <h1>Welcome to your profile, {user.first}</h1>
            <Flex>
                <Container>
                    <UserCircle size="100" usernames={[user.user]}/>
                    <ProfChangeBtn onClick={()=>logout()}>Change your profile picture</ProfChangeBtn>
                </Container>
                <Container>
                    <div style={{padding:"20px"}}>
                        <h3>Your info:</h3>
                        <div>First name: {user.first}</div>
                        <div>Last name: {user.last}</div>
                        <div>Username: {user.user}</div>
                        <div>Email: {user.email}</div>
                    </div>
                    <Button onClick={()=>logout()}>Sign Out</Button>
                </Container>
            </Flex>
        </Container>
    )
}

export default Profile;
