import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import {PRIMARY, SECONDARY, DARKER, HIGHLIGHT, API_ENDPOINT} from './Constants'
import { Carousel } from 'react-bootstrap'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Err = styled.div`
  border-radius: 10px;
  margin: 40px;
  color: #e8746a;
  background: #fbebe9;
  padding:15px 20px;
  border: solid 1px #e8746a;
  i{
    margin-right:10px;
  }
`

const MyForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  label{
    display: block;

  }

  input{
    display: block;
    width: 80%;
    font-size: 20px;
    border-radius: 10px;
    margin: 5px;
    border: 2px solid gray;
    font-weight: bold;
    padding: 10px;
    transition: 0.1s;
  }

  input:focus{
    border: 2px solid ${HIGHLIGHT};
    outline: none;
  }

  button{
    outline: none;
    font-weight: bold;
    padding: 10px 20px;
    margin: 10px;
    border-radius: 10px;
    color: white;
    background: ${PRIMARY};
    border: 2px solid ${DARKER};
    font-size: 15px;
  }

    p{
      text-align: center;
      font-weight: bold;
      font-size: 25px;
    }
`

const FlexRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;

  div{
    width: 30%;
  }

`

const TwoThirdsLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  width:100%;
  text-align: center;
  margin-top: 100px;
  margin-bottom: 100px;
  justify-content: space-evenly;
`

const MyHeader = styled.div`
  font-size: 35px;
  font-weight: bold;
`;

const SubHeading = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #555555;
  margin-bottom: 10px;
`

const SubtleButton = styled.button`
  outline: none;
  border: none;
  font-size: 12px;
  font-weight: light;
  color: #999999;
  :hover{
    text-decoration: underline;
  }
`
function Signup(){

  let [loginError, setloginError] = React.useState(false);
  let [signupError, setSignupError] = React.useState(false);

  let [login, setLogin] = React.useState(false);

  React.useEffect(() => {
    // fetch('${API_ENDPOINT}/user/current').then((data)=>data.json()).then((res)=>{
    //   if(res==="no user found"){
    //     window.location.href="/signup"
    //   }
    // });

    fetch(`${API_ENDPOINT}/user/current`,{
      credentials:"include"
    }).then((data)=>data.json()).then((res)=>{
      if(res!=="no user found"){
        window.location.href="/"
      }
    });

  })

  let handleSignup = (e) => {
    const emailaddress = e.target[0].value;
    const first = e.target[1].value;
    const last = e.target[2].value;
    const user = e.target[3].value;
    const pass = e.target[4].value;
    if(user.length < 1 || pass.length < 1){
      window.alert('username or password too short')
    }
    else{
      fetch(`${API_ENDPOINT}/user/signup`, {
        method:'post',
        credentials:'include',
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
        body: JSON.stringify({username: user, password: pass, email: emailaddress, firstname: first, lastname: last})
      }).then((data)=>data.json()).then((res)=>{
        if(res === "success"){
          window.location.href="/";
        }
        else{
          setSignupError(true);
        }
      });
    }
    e.preventDefault();
  }

  let handleLogin = (e) => {
  //  fetch('${API_ENDPOINT}/user/test');
    const user = e.target[0].value;
    const pass = e.target[1].value;
    if(user.length < 1 || pass.length < 1){
      window.alert('username or password too short')
    }
    else{
      fetch(`${API_ENDPOINT}/user/login`, {
        method:'post',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({username: user, password: pass})
      }).then((data)=>data.json()).then((res)=>{
        if(res!=="failure"){
          window.location.href="/";
        }
        else{
          console.log('user is ' + JSON.stringify(res));
          setloginError(true);
        }
      });
    }
    e.preventDefault();
  }

  let handleKeyPress = (e) => {
    setloginError(false);
    setSignupError(false);
  }

  return (
    <Container>
      <TwoThirdsLeft>
        <div>
          <MyHeader>Welcome to Avana</MyHeader>
          <SubHeading>Avana is a simple tool to analyze the stock market.</SubHeading>
            {login ?
                  <div>
                    <MyForm method="POST" onSubmit={handleLogin}>
                        <p>Log in</p>
                        <input type="text" placeholder="username" name="username" onKeyPress={handleKeyPress}/>
                        <input type="password" placeholder="password" name="password"onKeyPress={handleKeyPress} />
                        <button type="submit" class="btn">Sign in</button>
                        {loginError && <Err><i className="fas fa-exclamation-triangle"></i>Wrong username or password</Err>}
                      </MyForm>
                      <SubtleButton onClick={()=>setLogin(false)}>Sign up instead</SubtleButton>
                  </div>
              : <div>
                <MyForm method="POST" onSubmit={handleSignup}>
                  <p>Sign up</p>
                  <input type="text" placeholder="email" name="email" onKeyPress={handleKeyPress}/>
                  <input type="text" placeholder="first name" name="firstname" onKeyPress={handleKeyPress}/>
                  <input type="text" placeholder="last name" name="lastname" onKeyPress={handleKeyPress}/>
                  <input type="text" placeholder="username" name="username" onKeyPress={handleKeyPress}/>
                  <input type="password" placeholder="password" name="password" onKeyPress={handleKeyPress}/>
                  <button type="submit" class="btn">Sign up</button>
                  {signupError && <Err><i className="fas fa-exclamation-triangle"></i>User already exists</Err>}
                </MyForm>
                <SubtleButton onClick={()=>setLogin(true)}>Log in instead</SubtleButton>
            </div>}
        </div>
        <div style={{maxWidth:"600px"}}>
        <Carousel>
          <Carousel.Item>
            <img
              width="600"
              src={require("../img/stock_img.png")}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              width="600"
              src={require("../img/stock_img.png")}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              width="600"
              src={require("../img/stock_img.png")}
              alt="First slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      </TwoThirdsLeft>
    </Container>
  )
}

export default Signup;
