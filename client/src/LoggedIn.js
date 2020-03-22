import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Search from './components/Search'
import News from './components/News'
import Home from './components/Home'
import Dash from './components/Dash'
import Chat from './components/Chat'
import FadeIn from 'react-fade-in'

const LeftBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px !important;
  padding: 10px;
  height:100%;
  padding-top: 100px;
  background: #EEEEEE;
`

const LeftSpace = styled(LeftBarContainer)`
  position: relative
`

const LeftBarItem = styled.div`
  padding:20px 0px;
  font-size:30px;
  display: flex;
  color: ${props=>props.active ? "#333333" : "#888888"};
  cursor:pointer;
  transition: 0.2s;
  :hover{
    color: #555555;
  }
`

const Container = styled.div`
display: flex;
width:100vw;
position:relative;
flex-direction: row;
height:100vh;
flex-wrap: nowrap`

const SearchIconStyle = styled.i`
`;

const BottomBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  background: #EEEEEE;
  justify-content: space-evenly;
`


function App() {
  const [tab, setTab] = React.useState(1);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  })

  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
  })

  const leftBar =
  (<LeftBarContainer>
    <LeftBarItem active={tab==0} onClick={()=>setTab(0)}><i class="fas fa-search"></i></LeftBarItem>
    <LeftBarItem active={tab==1} onClick={()=>setTab(1)}><i class="fas fa-home"></i></LeftBarItem>
    <LeftBarItem active={tab==2} onClick={()=>setTab(2)}><i class="fas fa-chart-bar"></i></LeftBarItem>
    <LeftBarItem active={tab==3} onClick={()=>setTab(3)}><i class="fas fa-newspaper"></i></LeftBarItem>
    <LeftBarItem active={tab==4} onClick={()=>setTab(4)}><i class="fas fa-comments"></i></LeftBarItem>
  </LeftBarContainer>);

  const bottomBar =
  (<BottomBarContainer>
    <LeftBarItem active={tab==0} onClick={()=>setTab(0)}><i class="fas fa-search"></i></LeftBarItem>
    <LeftBarItem active={tab==1} onClick={()=>setTab(1)}><i class="fas fa-home"></i></LeftBarItem>
    <LeftBarItem active={tab==2} onClick={()=>setTab(2)}><i class="fas fa-chart-bar"></i></LeftBarItem>
    <LeftBarItem active={tab==3} onClick={()=>setTab(3)}><i class="fas fa-newspaper"></i></LeftBarItem>
    <LeftBarItem active={tab==4} onClick={()=>setTab(4)}><i class="fas fa-comments"></i></LeftBarItem>
  </BottomBarContainer>);

  let renderSwitch = (a) => {
    switch(a){
      case 0:
        return <FadeIn><Search/></FadeIn>
      case 1:
        return <FadeIn><Home/></FadeIn>
      default:
        return null;
    }
  }
  return (
    <Container>
      {window.innerWidth > 800 ? leftBar : bottomBar}
      <div style={{flexGrow: "1"}}>
        {tab===0 && <FadeIn><Search/></FadeIn>}
        {tab===1 && <FadeIn><Home/></FadeIn>}
        {tab===2 && <FadeIn><Dash/></FadeIn>}
        {tab===3 && <FadeIn><News/></FadeIn>}
        {tab===4 && <FadeIn><Chat/></FadeIn>}
      </div>
    </Container>
  );
}

export default App;
