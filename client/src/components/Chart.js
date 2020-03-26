import React from "react";
import styled from "styled-components";
//import { Chart } from "react-charts"
import Chart from "react-apexcharts";
import {PRIMARY} from "./Constants";

const ChartContainer = styled.div`
  width:100%;
  height:400px;
  border: 1px solid gray;
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


function MyChart({chartType, chartData}){
  // console.log(data);
  // return <ChartContainer>{data}</ChartContainer>


    // console.log(chartData);
    //
    // console.log(chartData["Time Series (5min)"]);

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
  <div
    style={{
      position:"relative"
    }}
  >
    {chartType==="line" && <Chart options={options} width={window.innerWidth*0.75} height={window.innerHeight*0.9 - 200} type="line" series={data}/>}
    {chartType==="candlestick" && <Chart options={options} width={window.innerWidth*0.75} height={window.innerHeight*0.9 - 200} type="candlestick" series={data}/>}
  </div>
)
}

export default MyChart;
