import React from "react";
import styled from "styled-components";
//import { Chart } from "react-charts"
import { createChart } from "lightweight-charts";
import {PRIMARY} from "./Constants";
import ReactTooltip from 'react-tooltip';

const ChartContainer = styled.div`
  width:100%;
  height:400px;
  border: 1px solid gray;
`

const MyButton = styled.button`
  outline: none;
  border: none;
  font-size: 20px;
  background: none;
  cursor: pointer;
  color: ${props => props.active ? PRIMARY : "#999999"};
`

const LineCandleBtns = styled.div`
  margin-left: 50px;
`

const options = {
  chart:{id:"Graph"},
  yaxis: {
    show:false,
    formatter: function (val) {
          return val.toFixed(0)
        }
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: [PRIMARY],
    width: 2,
    dashArray: 0,
  },
  colors: [PRIMARY]
}


function Chart2({chartType, chartData}){
  // console.log(data);
  // return <ChartContainer>{data}</ChartContainer>
  const chartRef = React.useRef(null);

  const [type, setType] = React.useState('line');

  const [currChart, setCurrChart] = React.useState(null);


    // console.log(chartData);
    //
    // console.log(chartData["Time Series (5min)"]);
  React.useEffect(()=> {
    if(chartRef.current){
      const chart = currChart || createChart(chartRef.current, {
        width: window.innerWidth*0.7,
        height: window.innerHeight*0.8,
        crosshair: {
          mode: "normal"
        }
      });

      setCurrChart(chart);

      console.log('data updated, setting data');


      const unformattedData = chartData[Object.keys(chartData)[1]]
      if(type==='candlestick'){
        const candleSeries = chart.addCandlestickSeries();
        let formattedData = Object.keys(unformattedData).map((key)=>{
          return {time: key, open: unformattedData[key]["1. open"], high: unformattedData[key]["2. high"], low: unformattedData[key]["3. low"], close: unformattedData[key]["4. close"]}
        })
        console.log(formattedData);
        candleSeries.setData(formattedData);
      }
      else{
        const lineSeries = chart.addLineSeries();
        let formattedLineData = Object.keys(unformattedData).map((key)=>{
          return {time: key, value: unformattedData[key]["4. close"]}
        })
        lineSeries.setData(formattedLineData);
        console.log(chart)
      }
    }
  }, [type, chartData])

  let graphPoints = Object.entries(chartData[Object.keys(chartData)[1]]).map((e, index) =>
  {
    // console.log(e);
    let rObj = {}
    rObj["x"] = e[0];
    rObj["y"] = [parseFloat(Object.values(e[1])[0]), parseFloat(Object.values(e[1])[1]), parseFloat(Object.values(e[1])[2]),parseFloat(Object.values(e[1])[3])];
    return rObj;
  });

  // console.log("graph points is ");
  // console.log(graphPoints);

  const data = [{
    name:"Stock Price",
    data:graphPoints
  }]



const axes = React.useMemo(
  () => [
    { primary: true, type: 'linear', position: 'bottom' },
    { type: 'linear', position: 'left' }
  ],
  []
)
// <Chart type={line} data={data} axes={axes} />
return (
  <div style={{width:"100%"}}>
      <LineCandleBtns>
        <>
          <MyButton active={type==='candlestick'} onClick={()=>setType('candlestick')}><i className="fas fa-chart-bar"></i></MyButton>
          <ReactTooltip id="line" place="bottom" type="dark" effect="solid">Candlestick view</ReactTooltip>
        </>
        <>
          <MyButton active={type==='line'} onClick={()=>setType('line')}><i className="fas fa-chart-line"></i></MyButton>
          <ReactTooltip id="candle" place="bottom" type="dark" effect="solid">Candlestick view</ReactTooltip>
        </>
      </LineCandleBtns>
      <div style={{width:"100%"}} ref={chartRef}></div>
  </div>

)
}

export default Chart2;
