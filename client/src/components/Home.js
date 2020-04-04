import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import MyChart from "./Chart"
import TradingViewWidget from 'react-tradingview-widget';

import {PRIMARY, DEFAULTSHADOW, API_ENDPOINT} from "./Constants"

const Container = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  width:100%;
  height:calc(100vh - 100px);
  grid-template-columns: 15% 65% 20%;
  padding:10px 5%;
`

const Flex = styled.div`
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
  padding-bottom: 20px;
`;

const WatchListItem = styled.li`
  font-weight: bold;
  position: relative;
  cursor: pointer;
  i{
      position: absolute;
      right: 0;
      opacity: 0;
  }
  :hover{
      color: ${PRIMARY};
      i{
          opacity: 1;
      }
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

const Padded = styled.div`
  margin: 10px;
`
function Home(){

  let [symbol, setSymbol] = React.useState("SPY");
  React.useEffect(() => {
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
      "width":500,
    });
    document.getElementById("tickers").appendChild(script);
}

    if(document.getElementById("calendar")) {
      const script2 = document.createElement('script');
      script2.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
      script2.async = true;
      script2.innerHTML = JSON.stringify({
        "colorTheme":"light",
        "height": 400,
        "width":400
      });
      document.getElementById("calendar").appendChild(script2);
    }


  }, []);

  let [spyData, setSpyData] = React.useState(null);
  let [watchlist, setWatchlist] = React.useState([]);





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
        <div style={{marginTop:"50px"}}>
          <WatchList>
            <GreenBackground><div>Here's your watchlist</div></GreenBackground>
            <ol style={{margin:"10px"}}>
              {watchlist.map((item)=><WatchListItem onClick={()=>setSymbol(item)}>
                                        {item}
                                        <i className="fas fa-chart-line"></i>
                                    </WatchListItem>)}
            </ol>
            {watchlist.length === 0 && <div style={{padding:"15px", paddingTop:"0px"}}>Nothing added to your watchlist. Search for stocks to add them!</div>}
          </WatchList>
        </div>
        <Flex id="middle"><TradingViewWidget interval='5' width={parseInt((window.innerWidth - 50) * 0.5)} style="2"symbol={symbol}/></Flex>
        <Flex><Padded id="tickers"></Padded> <div style={{height:"300px !important"}} id="calendar"></div></Flex>
      </Grid>
    </Container>
  )
}

export default Home;
