import React from 'react'
import styled from 'styled-components'
import UserCircle from './UserCircle'
import {Button} from 'react-bootstrap'
import {PRIMARY} from './Constants'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 20px;
`

const Row = styled(Container)`
    flex-direction: row;
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


const ImageHolder = styled.div`
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;
    img{
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        object-fit: cover;
        width: 50px;
        height: 50px;
        ${props=>props.active ? "border: 3px solid" + PRIMARY + ";" : "border: 1px solid" + PRIMARY + ";"}
    }

    img:hover{
        border: 3px solid ${PRIMARY};
        width: 53px;
        height: 53px;
    }
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

const imgList = ["https://tineye.com/images/widgets/mona.jpg","https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/images-in-html/dinosaur_small.jpg"]

function Profile({user}){

    let [changingProfile, setChangingProfile] = React.useState(false);

    let [selectedProfile, setSelectedProfile] = React.useState(false);

    let changeProf = (imageURL) => {
        fetch("/user/setProfPic",{
          credentials:'include',
          method:'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({picURL: imageURL})
      }).then((res)=>res.json()).then((response)=>{
          if(response=="success"){
              setSelectedProfile(imageURL)
              console.log('SELECTED' + imageURL)
          }
          else{
              window.alert("error updating profile picture")
          }
      });
    }

    return(
        <Container>
            <h1>Welcome to your profile, {user.first}</h1>
            <Flex>
                <Container>
                    <UserCircle size="100" usernames={[user.user]} profileMap={{[user.user]:user.profPic}}/>
                    <ProfChangeBtn onClick={()=>setChangingProfile(!changingProfile)}>Change your profile picture</ProfChangeBtn>
                    {changingProfile &&
                        <Row>
                            {imgList.map(imageURL=><ImageHolder active={imageURL==selectedProfile}><img onClick={()=>changeProf(imageURL)} src={imageURL}/></ImageHolder>)}
                        </Row>
                    }
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
