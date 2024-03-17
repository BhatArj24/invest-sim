import React from "react";
import "./Stock.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {db} from "../../firebase-config.js";
import {collection, getDocs, updateDoc, doc, arrayUnion} from "firebase/firestore";
import NavBar from "../NavBar.js";
import graph from "../../Images/graph.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Stock from "../../Classes/Stock.js";
import StockGraph from "./StockGraph.js";

const StockPage = () => {
  const { ticker } = useParams();
  const [user, setUser] = useState({email:"",username:"",myStocks:[],balance:0,operations:[],invested:0});
  const userCollectionRef = collection(db,"users");

  const [stock, setStock] = useState(new Stock("", "", 0.0, 0.0, 0.0));
  const [selectTime, setSelectTime] = useState("1d");
  const getProfile = async () =>{
    const email = sessionStorage.getItem("email");
    const data = await getDocs(userCollectionRef);
    data.forEach((doc) => {
        if(doc.data().email === email){
            setUser({
                email:doc.data().email,
                username:doc.data().username,
                myStocks:doc.data().myStocks,
                balance:doc.data().balance,
                operations:doc.data().operations,
                invested:doc.data().invested
            });
        }
    });
}

  useEffect(() => {
    if (!sessionStorage.getItem("email")) {
        window.location.href = "/login";
    } else {
        getProfile();
        getStock(ticker);
    }
}, []);

  const getStock = async (ticker) => {
    const options = {
      method: 'GET',
      url: `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`,
      headers: {
        'X-RapidAPI-Key': '6cf0a9ba48msh6e1a173c2609062p127452jsn5455a7849ff8',
        'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      setStock(prevStock => ({
        ...prevStock,
        ticker: ticker,
        name: response.data.displayName,
        price: response.data.regularMarketPrice.raw,
        change: response.data.regularMarketChange.raw,
        changePercent: response.data.regularMarketChangePercent.raw
      }));
    } catch (error) {
      console.error(error);
    }
  }

  const totalSharesCalculation = (stocks, index = 0) => {
    if (!stocks || stocks.length === 0 || index >= stocks.length) {
        return 0; 
    }
    
    if (stocks[index].ticker === stock.ticker) {
        let totalShares = 0;
        for (let j = 0; j < stocks[index].shares.length; j++) {
            totalShares += stocks[index].shares[j];
        }
        return totalShares;
    }
    

    return totalSharesCalculation(stocks, index + 1);
  } 

  const portfolioDiversity = (stocks) => {
    if (!stocks || stocks.length === 0) {
      return 0; 
    }
    let thisShares = totalSharesCalculation(user.myStocks);
    let totalShares = 0;
    for (let i = 0; i < stocks.length; i++) {
      for (let j = 0; j < stocks[i].shares.length; j++) {
        totalShares += stocks[i].shares[j];
      }
    }
    return ((thisShares/totalShares)*100).toFixed(2);
  }
  return (
    <div className="gray-bg">
        <NavBar />
      <div
        className="gray-bg"
        style={{ width: "100%", height: "1200px", marginTop: "0%" }}
      >

        <h1 className="text-4xl font-bold px-40 mt-10">{stock.name}</h1>
        <h1 className="text-lg font-medium px-40">{stock.ticker}</h1>
        <h1
          className={`text-4xl font-bold px-40 ${
            stock.changePercent < 0 ? "text-red-600" : "text-green-600"
          }`}
          style={{ paddingTop: "10px" }}
        >
          ${stock.price.toFixed(2)}
        </h1>
        {
          stock.change < 0 ?
          <h1 className="text-lg font-bold px-40 text-red-600">△ -${Math.abs(stock.change).toFixed(2)} ({(stock.changePercent).toFixed(3)}%)</h1>
          :
          <h1 className="text-lg font-bold px-40 text-green-600">△ ${stock.change.toFixed(2)} ({(stock.changePercent).toFixed(3)}%)</h1>
        }

        {/* <img src={graph} className="w-3/4 m-auto"></img> */}
        {
          user.email !== "" ? 
          <StockGraph stockData={{ticker:stock.ticker, change: stock.change, range:selectTime }}/>
          :
          <div className="w-3/4 m-auto h-96 bg-white"></div>

          
        }


        <div className="flex m-auto gap-6 w-3/4 mt-6">
          <button
            className={`rounded-lg ${
              selectTime === "1d"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("1d")}
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "1d" ? "text-white " : "text-black "
              }`}
            >
              1D
            </p>
          </button>
          <button
            className={`rounded-lg ${
              selectTime === "1wk"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("1wk")}
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "1wk" ? "text-white " : "text-black "
              }`}
            >
              1W
            </p>
          </button>
          <button
            className={`rounded-lg ${
              selectTime === "1mo"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("1mo")
          }
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "1mo" ? "text-white " : "text-black "
              }`}
            >
              1M
            </p>
          </button>
          <button
            className={`rounded-lg ${
              selectTime === "3mo"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("3mo")}
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "3mo" ? "text-white " : "text-black "
              }`}
            >
              3M
            </p>
          </button>
          <button
            className={`rounded-lg ${
              selectTime === "1yr"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("1yr")}
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "1yr" ? "text-white " : "text-black "
              }`}
            >
              1Y
            </p>
          </button>
          <button
            className={`rounded-lg ${
              selectTime === "5yr"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("5yr")}
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "5yr" ? "text-white " : "text-black "
              }`}
            >
              5Y
            </p>
          </button>
          {/* <button
            className={`rounded-lg ${
              selectTime === "All"
                ? "bg-white border-2 border-black"
                : "bg-black"
            }`}
            onClick={() => setSelectTime("All")}
          >
            <p
              className={`font-semibold p-1.5 ${
                selectTime !== "All" ? "text-white " : "text-black "
              }`}
            >
              All
            </p>
          </button> */}
        </div>

        <h1 className="text-3xl font-bold px-40 mt-10">Your Position</h1>
          
          <div className="flex px-40 mt-3">
              <div>
                <div className="flex gap-24">
                  <div>
                    <h1 className="text-md text-slate-600">Shares</h1>
                    <h1 className="text-md font-bold">{totalSharesCalculation(user.myStocks).toFixed(2)}</h1>
                  </div>
                  <div>
                    <h1 className="text-md text-slate-600">Market Value</h1>
                    <h1 className="text-md font-bold">${(totalSharesCalculation(user.myStocks).toFixed(2)*stock.price).toFixed(2)}</h1>
                  </div>
                </div>
                <div className="flex py-4">
                  <div>
                    <h1 className="text-md text-slate-600">Portfolio Diversity</h1>
                    <h1 className="text-md font-bold">{portfolioDiversity(user.myStocks)}%</h1>
                  </div>
                </div>
              </div>
              <div>

              </div>
          </div>
        <div className="flex gap-16 ml-40 mt-10">
            <Link to={`/buy/${stock.ticker}`}>
                <button
                    className="block bg-black hover:bg-slate-700 text-white font-bold py-3 px-12 focus:outline-none focus:shadow-outline rounded-full"
                >
                    Buy
                </button>
            </Link>
            <Link to={`/sell/${stock.ticker}`}>
                <button
                    className="block bg-black hover:bg-slate-700 text-white font-bold py-3 px-12 focus:outline-none focus:shadow-outline rounded-full"
                >
                    Sell
                </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
