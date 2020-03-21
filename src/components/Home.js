import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import MyChart from "./Chart"

const Container = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  width:100%;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

function Home(){

  let [spyData, setSpyData] = React.useState(null);
  let [watchList, setWatchList] = React.useState([]);

  // React.useEffect(()=>{
  //     fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SPY&interval=5min&apikey=QJGGE8FMLYC8INMS`)
  //     .then(res=>res.json())
  //     .then(function(result){
  //       console.log(result);
  //       if(result["Note"]){
  //         window.alert('couldnt load spy graph');
  //       }
  //       else{
  //         setSpyData(result);
  //       }
  //     }
  //   )
  // });

  return (
    <Container>
      <Header>Welcome. Markets are down today.</Header>
      <Grid>
        <Flex>hi</Flex>
        <Flex>hi</Flex>
        <Flex>hi</Flex>
      </Grid>
    </Container>
  )
}

export default Home;
