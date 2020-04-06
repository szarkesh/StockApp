import React from 'react';
import styled from 'styled-components';
import MyChart from "./Chart"
import TradingViewWidget from 'react-tradingview-widget';

import {PRIMARY, DEFAULTSHADOW, API_ENDPOINT} from "./Constants"

const Container = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FCFCFC
`;

const Indicator = styled.span`
    color: ${props=>props.value==="up" ? PRIMARY : "#FF5C5C"};
    white-space: pre-wrap;
    font-weight: 700;
`

const Header = styled.h2`
    padding-top:30px;
    padding-bottom: 20px;
    font-weight: 300;
`

const LeftRight = styled.div`
    display: flex;
    flex-direction: row;
    padding:0px 10px;
    justify-content: space-between;
    align-items: center;
    i{
        display: none;
    }
    .movement{
        display: inline-block;
    }
    :hover{
        color: ${PRIMARY};
        i{
            display: inline;
            padding-right: 5px;
        }
    }
`

const Grid = styled.div`
  display: grid;
  width:100%;
  height:calc(100vh - 100px);
  grid-template-columns: 17% 61% 22%;
  padding:10px 2%;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Left = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const WatchList = styled.div`
  border-radius: 15px;
  box-shadow: ${DEFAULTSHADOW};
  max-width: 300px;
  width:100%;
  position: relative;
  padding-bottom: 10px;
  margin: 20px 10px;
  max-height: 60%;
  ol{
      list-style-type: none;
  }
`;

const WatchListItem = styled.div`
  font-weight: bold;
  position: relative;
  cursor: pointer;
  i{
      position: absolute;
      right: 0;
      opacity: 0;
  }
`;

const GreenBackground = styled.div`
  width:100%;
  border-radius: 15px 15px 0px 0px;
  padding: 20px;
  background: ${PRIMARY};
  color: white;
  font-weight: Watchlist;
`

const StockMovement = styled.div`
    border-radius: 7px;
    padding: 3px;
    width:60px;
    font-weight: 500;
    margin:3px 0px;
    text-align: center;
    background: ${props=> props.value>=0 ? PRIMARY : "#FF5C5C"};
    color: white;
`

const Padded = styled.div`
  margin: 10px;
  width:300px;
`
function Home(){

  let [symbol, setSymbol] = React.useState("SPY");
  React.useEffect(() => {
    setMostTraded(['AAPL','FB', 'GOOG', 'BERK'])
    fetch(`${API_ENDPOINT}/api/watchlist`,{
      credentials:'include'
    }).then((data)=>data.json()).then((res)=>setWatchlist(res.watchlist));

    if (document.getElementById("tickers")) {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [{
        "proName": "OANDA:SPX500USD",
        "title": "S&P 500"
      }, {
        "proName": "OANDA:NAS100USD",
        "title": "Nasdaq 100"
      }, {
        "proName": "FX_IDC:EURUSD",
        "title": "EUR/USD"
      }, {
        "proName": "BITSTAMP:BTCUSD",
        "title": "BTC/USD"
      }, {
        "proName": "BITSTAMP:ETHUSD",
        "title": "ETH/USD"
      }],
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "adaptive",
      "width":"300px",
    });
    document.getElementById("tickers").appendChild(script);
}

    if(document.getElementById("calendar")) {
      const script2 = document.createElement('script');
      script2.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
      script2.async = true;
      script2.innerHTML = JSON.stringify({
        "colorTheme":"light",
        "height": 535,
        "width":300
      });
      document.getElementById("calendar").appendChild(script2);
    }


  }, []);

  let [spyData, setSpyData] = React.useState(null);
  let [watchlist, setWatchlist] = React.useState([]);
  let [mostTraded, setMostTraded] = React.useState([]);

  let listItem = (item) => {
      let curr = movement(item);
      return (
      <LeftRight onClick={()=>setSymbol(item)}>
          <WatchListItem>
              {item}
          </WatchListItem>
          <div>
              <i className="fas fa-chart-line"></i>
              <StockMovement className="movement" value={curr}>{curr}%</StockMovement>
          </div>
      </LeftRight>
  )}




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

  let movement = (ticker) => {
      return (Math.random()-0.5).toFixed(2);
  }

  let hrOfDay = new Date().getHours();
  let greeting = hrOfDay < 12 ? 'Good morning' : (hrOfDay < 18 ? 'Good afternoon' : 'Good evening');
  return (
    <Container>
      <Header>{greeting}, Shaya. The S&P 500 is <Indicator value="up"> up 1.39% </Indicator> today.</Header>
      <Grid>
        <Left>
          <WatchList>
            <GreenBackground><div>Your watchlist</div></GreenBackground>
            <div style={{padding:"10px"}}>
              {watchlist.map((item)=>
                                    listItem(item))}
            </div>
            {watchlist.length === 0 && <div style={{padding:"15px", paddingTop:"0px"}}>Nothing added to your watchlist. Search for stocks to add them!</div>}
          </WatchList>
          <WatchList>
            <GreenBackground><div>Most traded today</div></GreenBackground>
            <div style={{margin:"10px"}}>
              {mostTraded.map((item)=>listItem(item))}
          </div>
            {watchlist.length === 0 && <div style={{padding:"15px", paddingTop:"0px"}}>Nothing added to your watchlist. Search for stocks to add them!</div>}
          </WatchList>
        </Left>
        <Flex id="middle"><TradingViewWidget interval='5' width={parseInt((window.innerWidth - 50) * 0.5)} style="2" symbol={symbol}/></Flex>
        <Flex>
            <Padded id="tickers"></Padded>
            <div style={{height:"300px !important"}} id="calendar"></div>
        </Flex>
      </Grid>
    </Container>
  )
}

export default Home;
