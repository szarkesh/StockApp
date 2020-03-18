import React from 'react';
import styled from 'styled-components';
import Header from './Header'

const Container = styled.div`
  width:calc(100vw - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;


function Home(){
  return (
    <Container>
      <Header>Welcome to Stockapp</Header>
      <div style={{marginRight:"100px", fontSize:"20px"}}>
        <p>1. Search for stocks</p>
        <p>2. Analyze stocks</p>
        <p>3. Browse news related to stocks</p>
      </div>
    </Container>
  )
}

export default Home;
