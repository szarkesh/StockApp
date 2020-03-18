import React from 'react';
import styled from 'styled-components';
import Header from './Header'

const Container = styled.div`
  width:calc(100vw - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;


function News(){
  return (
    <Container>
      <Header>News</Header>
      <div style={{marginRight:"100px", fontSize:"20px"}}>
        <p>1.Top Stories</p>
      </div>
    </Container>
  )
}

export default News;
