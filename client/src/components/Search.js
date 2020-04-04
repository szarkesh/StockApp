import React from 'react';
import styled from 'styled-components';
import BounceLoader from "react-spinners/BounceLoader";
import MyChart from "./Chart"
import Chart2 from "./Chart2"
import FadeIn from 'react-fade-in';
import ReactTooltip from 'react-tooltip';
import { csv } from 'd3';
import data from '../companylist.csv';
import {PRIMARY, SECONDARY, HIGHLIGHT, API_ENDPOINT} from './Constants'
import TradingViewWidget from 'react-tradingview-widget';

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
  border: 3px solid ${PRIMARY};
  transition:0.2s;
  :focus{
    outline:none;
    box-shadow: 0px 15px 30px #26474B20;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 80px;
  max-height: 300px;
  overflow-y: scroll;
  z-index: 1000;
`

const Center = styled.div`
  display: flex;
  flex-direction: row;
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

const AddWatchlistBtn = styled.span`

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
  font-size: 30px;
  color: white;
  width:50px;
  height:50px;
  border-radius: 50%;
  cursor: pointer;
  border: solid 2px ${PRIMARY};
  background: ${SECONDARY};
`

const SearchWatchlistBtn = styled.button`
  border: solid 2px ${PRIMARY};
  background: ${SECONDARY};
  color: white;
  outline: none;
  padding: 10px;
  font-size: 20px;
  border-radius: 100px;
  cursor: pointer;
  margin: 0px 5px;
`

const SearchResult = styled.div`
  color: black;
  padding: 10px;
  border: solid 1px lightgray;
  cursor: pointer;
  background: white;
  :hover{
    background: ${HIGHLIGHT}
  }
`


function Search({user}){

  function useOutsideAlerter(ref) {
    React.useEffect(() => {

      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setResults([]);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }


  React.useEffect(() => {
    csv(data).then(data=>{
      console.log(data);
      setCompanies(data);
    })
    console.log(document.cookie);
    fetch(`${API_ENDPOINT}/api/watchlist`,{
      credentials:'include'
    }).then((data)=>data.json()).then((res)=>setWatchlist(res.watchlist));
  }, []);

  let [chartType, setChartType] = React.useState('line');
  let [chartInterval, setChartInterval] = React.useState(4); // 0 for 1D, 1 for 1W, 2 for 1M, 3 for 1YR, 4 for 5YR
  let intervalFunctions = ["TIME_SERIES_INTRADAY", "TIME_SERIES_DAILY_ADJUSTED", "TIME_SERIES_WEEKLY_ADJUSTED", "TIME_SERIES_WEEKLY_ADJUSTED", "TIME_SERIES_MONTHLY_ADJUSTED"]

  let searchRef = React.useRef();

  let [loading, setLoading] = React.useState(false);

  let [chartData, setChartData] = React.useState(null);
  let [error, setError] = React.useState(null);

  let [ticker, setTicker] = React.useState("");

  let [watchlist, setWatchlist] = React.useState([]);

  let [results, setResults] = React.useState([]);

  let [companies, setCompanies] = React.useState([]);

  let wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);


  let handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      //setLoading(true);
      setChartData(null);
      setError(false);
      setTicker(searchRef.current.value.toUpperCase());
      //fetchData();
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
    //setLoading(true);
    setTicker(str);
    setChartData(null);
    setError(false);
    //fetchData();
  }

  let addToWatchlist = (elem) => {
    let ans = elem.toUpperCase();
    setWatchlist([...watchlist, ans]);
    fetch(`${API_ENDPOINT}/api/watchlist/add`, {
      method:'post',
      credentials:'include',
      headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
      body: JSON.stringify({ticker:elem})
    });
    console.log("added " + elem + "to watch list");
  }

  let removeFromWatchlist = (elem) => {
    const index = watchlist.indexOf(elem.toUpperCase());
    if (index > -1) {
      setWatchlist([...watchlist.slice(0,index),
          ...watchlist.slice(index+1,watchlist.length)]);
    }
    fetch(`${API_ENDPOINT}/api/watchlist/remove`, {
      method:'post',
      credentials:'include',
      headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
      body: JSON.stringify({ticker:elem})
    });
  }

  return (
    <Container>
      <Flexbox>
          <Center ref={wrapperRef}>
            {ticker && <AddWatchlistBtn>
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
            </AddWatchlistBtn>}
            <SearchBarStyle autoFocus ref={searchRef} placeholder="Search for any stock..." onClick={(e)=>updateSearchResults(e)} onChange={(e)=>updateSearchResults(e)} onKeyDown={handleKeyDown}/>
            <SearchContainer>
            {results.map((item => <SearchResult onClick={()=>searchFor(item[0])}>
                                      <div>{item[1]}</div>
                                      <div>{item[0]}</div>
                                  </SearchResult>))}
            </SearchContainer>
          </Center>
        {watchlist.map((item) => <SearchWatchlistBtn onClick={()=>searchFor(item)}>{item}</SearchWatchlistBtn>)}
      </Flexbox>
      {loading && <LoaderContainer><BounceLoader color={PRIMARY}/></LoaderContainer>}
      {/*chartData && <FadeIn>
                        <div style={{position:"relative"}}>
                        <Chart2 style={{width:"80%"}} chartData={chartData}/>
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

                    </FadeIn>*/}
      {ticker && <TradingViewWidget style="2" symbol={ticker} />}
      {error && <Err><i className="fas fa-exclamation-triangle"></i>Stock not found</Err>}
    </Container>
  );
}

export default Search;
