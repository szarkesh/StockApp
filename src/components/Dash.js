import React from 'react';
import styled from 'styled-components';
import Header from './Header'

const Container = styled.div`
  width:calc(100vw - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;


function Dash(){
  return (
    <Container>
      <Header>Dashboard</Header>
      <div style={{marginRight:"100px", fontSize:"20px"}}>
      </div>
    </Container>
  )
}

export default Dash;
