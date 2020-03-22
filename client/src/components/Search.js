import React from 'react';
import styled from 'styled-components';
import BounceLoader from "react-spinners/BounceLoader";
import MyChart from "./Chart"
import FadeIn from 'react-fade-in';
import ReactTooltip from 'react-tooltip';
import { csv } from 'd3';
import data from '../companylist2.csv';

const Container = styled.div`
  display:flex;
  align-items:center;
  flex-direction:column;
`;
const SearchBarStyle = styled.input`
  font-size: 20px;
  padding:10px;
  margin:20px;
  border-radius:30px;
  padding-left:20px;
  flex-grow: 1;
  box-shadow:none;
  border: 3px solid #8623C0;
  transition:0.2s;
  :focus{
    outline:none;
    box-shadow: 0px 15px 30px #26474B20;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 20;
  max-height: 300px;
  overflow-y: scroll;
  z-index: 1000;
`

const Center = styled.div`
  dispaly: flex;
  flex-direction: column;
  align-items: center;
`;
const LineCandleBtns = styled.div`
  position: absolute;
  top: 0px;
  left: 100px;
`


const TimeIntervalBtns = styled.div`
  position: absolute;
  top: 0px;
  left: 300px;
`

const AddWatchlistBtn = styled.div`
  position: absolute;
  top: 0px;
  left: 20px;
`


const LoaderContainer = styled.div`
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

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

const Flexbox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const MyButton = styled.button`
  outline: none;
  border: none;
  font-size: 20px;
  background: none;
  cursor: pointer;
  color: ${props => props.active ? "#018FFB" : "#999999"};
`

const SearchWatchlistBtn = styled.button`
  border: solid 2px #8623C0;
  background: #AA35D5;
  color: white;
  outline: none;
  padding: 10px;
  font-size: 20px;
  border-radius: 100px;
  cursor: pointer;
  margin: 0px 10px;
`

const SearchResult = styled.div`
  color: black;
  padding: 10px;
  border: solid 1px lightgray;
  cursor: pointer;
  background: white;
`


function Search(){

  React.useEffect(() => {
    csv(data).then(data=>{
      console.log(data);
      setCompanies(data);
    })
  }, []);

  let [chartType, setChartType] = React.useState('line');
  let [chartInterval, setChartInterval] = React.useState(4); // 0 for 1D, 1 for 1W, 2 for 1M, 3 for 1YR, 4 for 5YR
  let intervalFunctions = ["TIME_SERIES_INTRADAY", "TIME_SERIES_DAILY_ADJUSTED", "TIME_SERIES_WEEKLY_ADJUSTED", "TIME_SERIES_WEEKLY_ADJUSTED", "TIME_SERIES_MONTHLY_ADJUSTED"]

  let searchRef = React.useRef();

  let [loading, setLoading] = React.useState(false);

  let [chartData, setChartData] = React.useState(null);
  let [error, setError] = React.useState(null);

  let [ticker, setTicker] = React.useState(null);

  let [watchlist, setWatchlist] = React.useState([]);

  let [results, setResults] = React.useState([]);

  let [companies, setCompanies] = React.useState([]);


  let handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      setChartData(null);
      setError(false);
      setTicker(searchRef.current.value.toUpperCase());
      fetchData();
    }
    else{
      console.log('search is aboutta be');
      console.log(e.target.value);
      updateSearchResults(e.target.value);
    }
    console.log('value is ' + e.target.value);
  }

  let updateSearchResults = (search) =>  {
    var i = 0;
    let arr = [];
    var ct = 0;
    //console.log(search);
    for (i = 0; i < companies.length; i++){
      if(companies[i]["Symbol"].toLowerCase().includes(search) || companies[i]["Name"].toLowerCase().includes(searchRef.current.value)){
        arr.push([companies[i]["Symbol"], companies[i]["Name"]]);
        // /console.log('found name' + companies[i]["Symbol"] + companies[i]["Name"]);
        ct++;
      }
      if(ct > 10){
        break;
      }
    }
    setResults(arr);
  }

  let updateChartInterval = (i) => {
    setChartInterval(i);
    fetchData();
  }

  let fetchData = () => {
    fetch(`https://www.alphavantage.co/query?function=${intervalFunctions[chartInterval]}&symbol=${searchRef.current.value}&interval=5min&apikey=QJGGE8FMLYC8INMS`)
    .then(res=>res.json())
    .then(function(result){
      console.log(result);
      if(result["Error Message"]){
        setError(true);
        setChartData(null);
      }
      else{
        setError(false);
        setChartData(result);
      }
      setLoading(false);
    })
  }

  let searchFor = (str) => {
    searchRef.current.value = str;
    setResults([]);
    setLoading(true);
    setChartData(null);
    setError(false);
    fetchData();
  }

  let addToWatchlist = (elem) => {
    setWatchlist([...watchlist, elem.toUpperCase()]);
    console.log("added " + elem + "to watch list");
  }

  let removeFromWatchlist = (elem) => {
    const index = watchlist.indexOf(elem.toUpperCase());
    if (index > -1) {
      setWatchlist([...watchlist.slice(0,index),
          ...watchlist.slice(index+1,watchlist.length)]);
    }
  }

  return (
    <Container>
      <Flexbox>
          <Center>
            <SearchBarStyle autoFocus ref={searchRef} placeholder="Search for any stock..." onChange={(e)=>updateSearchResults(e)} onKeyDown={handleKeyDown}/>
            <SearchContainer>
            {results.map((item => <SearchResult onClick={()=>searchFor(item[0])}>
                                      <div>{item[1]}</div>
                                      <div>{item[0]}</div>
                                  </SearchResult>))}
            </SearchContainer>
          </Center>
        {watchlist.map((item) => <SearchWatchlistBtn onClick={()=>searchFor(item)}>{item}</SearchWatchlistBtn>)}
      </Flexbox>
      {loading && <LoaderContainer><BounceLoader color={"#8D28BE"}/></LoaderContainer>}
      {chartData && <FadeIn>
                        <div style={{position:"relative"}}>
                        <MyChart chartData={chartData} chartType={chartType}/>
                        <LineCandleBtns>
                          <>
                            <MyButton active={chartType==='candlestick'} onClick={()=>setChartType('candlestick')}><i className="fas fa-chart-bar"></i></MyButton>
                            <ReactTooltip id="line" place="bottom" type="dark" effect="solid">Candlestick view</ReactTooltip>
                          </>
                          <>
                            <MyButton active={chartType==='line'} onClick={()=>setChartType('line')}><i className="fas fa-chart-line"></i></MyButton>
                            <ReactTooltip id="candle" place="bottom" type="dark" effect="solid">Candlestick view</ReactTooltip>
                          </>
                        </LineCandleBtns>
                        <TimeIntervalBtns>
                          <MyButton active={chartInterval===0} onClick={()=>updateChartInterval(0)}>1D</MyButton>
                          <MyButton active={chartInterval===1} onClick={()=>updateChartInterval(1)}>1W</MyButton>
                          <MyButton active={chartInterval===2} onClick={()=>updateChartInterval(2)}>1M</MyButton>
                          <MyButton active={chartInterval===3} onClick={()=>updateChartInterval(3)}>1Y</MyButton>
                          <MyButton active={chartInterval===4} onClick={()=>updateChartInterval(4)}>5Y</MyButton>
                        </TimeIntervalBtns>
                        <AddWatchlistBtn>
                          {!(watchlist.indexOf(ticker) > -1) ?
                                <>
                                  <MyButton data-tip="React-tooltip" onClick={()=>addToWatchlist(ticker)}>+</MyButton>
                                  <ReactTooltip place="bottom" type="dark" effect="solid">Add to watchlist</ReactTooltip>
                                </> :
                              <>
                                <MyButton onClick={()=>removeFromWatchlist(ticker)}>-</MyButton>
                                <ReactTooltip place="bottom" type="dark" effect="solid">Remove from watchlist</ReactTooltip>
                              </>
                          }
                        </AddWatchlistBtn>
                        </div>
                        {console.log(watchlist)}
                        {console.log(ticker)}
                        {console.log(watchlist.indexOf(ticker))}

                    </FadeIn>}
      {error && <Err><i className="fas fa-exclamation-triangle"></i>Stock not found</Err>}
    </Container>
  );
}

export default Search;
