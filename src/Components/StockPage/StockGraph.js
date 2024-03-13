import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const StockGraph = ({ stockData }) => {
    const [stockXValues, setStockXValues] = useState([]);
    const [stockYValues, setStockYValues] = useState([]);


    const fetchStock = async () => {
        let stockRange = stockData.range;
        console.log(stockRange);
        let stockInterval = "2m";
        if(stockRange === "1d"){
            stockInterval = "2m";
        } else if(stockRange === "1wk"){
            stockInterval = "15m";
        } else if(stockRange === "1mo"){
            stockInterval = "1h";
        } else if(stockRange === "3mo"){
            stockInterval = "1d";
        } else if(stockRange === "1yr"){
            stockInterval = "5d";
        } else if(stockRange === "5yr"){
            stockInterval = "5d";
        }

        const options = {
            method: 'GET',
            url: `https://yahoo-finance127.p.rapidapi.com/historic/${stockData.ticker}/${stockInterval}/${stockRange}`,
            headers: {
              'X-RapidAPI-Key': '6cf0a9ba48msh6e1a173c2609062p127452jsn5455a7849ff8',
              'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
            }
          };
          
          try {
            const response = await axios.request(options);
            setStockYValues(response.data.indicators.quote[0].close);
            let xValues = [];
            if(stockRange === "1d"){
                for (let i = 0; i < 390; i++) {
                    xValues.push(i);
                }
            } else if(stockRange === "1wk"){
                for (let i = 0; i < 672; i++) {
                    xValues.push(i);
                }
            } else if(stockRange === "1mo"){
                for (let i = 0; i < 672; i++) {
                    xValues.push(i);
                }
            } else if(stockRange === "3mo"){
                for (let i = 0; i < 91; i++) {
                    xValues.push(i);
                }
            } else if(stockRange === "1yr"){
                for (let i = 0; i < 73; i++) {
                    xValues.push(i);
                }
            } else if(stockRange === "5yr"){
                for (let i = 0; i < 365; i++) {
                    xValues.push(i);
                }
            }
            setStockXValues(xValues);

          } catch (error) {
            console.error(error);
          }
    }

    useEffect(() => {
        fetchStock();
    },[stockData]);

    return (
        <div className='ml-96'>
            <Plot
                data={[
                {
                    x: stockXValues,
                    y: stockYValues,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: stockData.change > 0 ? 'green' : 'red'},
                },
                ]}
                layout={ {width: 720, height: 440} }
            />

        </div>
    );
}

export default StockGraph;