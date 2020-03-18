import React from 'react';
import styled from 'styled-components';
import BounceLoader from "react-spinners/BounceLoader";
import MyChart from "./Chart"
import FadeIn from 'react-fade-in';

const Container = styled.div`
  width:calc(100vw - 100px);
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
  width:80vw;
  box-shadow:none;
  border: 3px solid #8623C0;
  transition:0.2s;
  :focus{
    outline:none;
    box-shadow: 0px 15px 30px #26474B20;
  }
`;

const LineCandleBtns = styled.div`
  position: absolute;
  top: 0px;
  left: 100px;
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

const MyButton = styled.button`
  outline: none;
  border: none;
  font-size: 20px;
  background: none;
  cursor: pointer;
  color: ${props => props.active ? "#018FFB" : "#999999"};
`


function Search(){
  let [chartType, setChartType] = React.useState('line');

  let searchRef = React.useRef();

  let [loading, setLoading] = React.useState(false);

  let [chartData, setChartData] = React.useState(null);
  let [error, setError] = React.useState(null);

  let handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      setChartData(null);
      setError(false);
      console.log("searching for " + searchRef.current.value);
      fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${searchRef.current.value}&interval=5min&apikey=QJGGE8FMLYC8INMS`)
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
  }
  return (
    <Container>
      <SearchBarStyle autoFocus ref={searchRef} placeholder="Search for any stock..." onKeyDown={handleKeyDown}/>
      {loading && <LoaderContainer><BounceLoader color={"#8D28BE"}/></LoaderContainer>}
      {chartData && <FadeIn>
                        <div style={{position:"relative"}}>
                        <MyChart ref={searchRef} chartData={chartData} chartType={chartType}/>
                        <LineCandleBtns>
                          <MyButton active={chartType==='candlestick'} onClick={()=>setChartType('candlestick')}><i className="fas fa-chart-bar"></i></MyButton>
                          <MyButton active={chartType==='line'} onClick={()=>setChartType('line')}><i className="fas fa-chart-line"></i></MyButton>
                        </LineCandleBtns>
                        </div>
                    </FadeIn>}
      {error && <Err><i className="fas fa-exclamation-triangle"></i>Stock not found</Err>}
    </Container>
  );
}

export default Search;
