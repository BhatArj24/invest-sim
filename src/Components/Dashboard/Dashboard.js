import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import NavBar from "../NavBar.js";
import searchIcon from "../../Images/search.png";
import { db } from "../../firebase-config.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import StockGraph from "../StockPage/StockGraph.js";
import Holding from "./Holding.js";

const Dashboard = () => {
  const [user, setUser] = useState({
    email: "",
    username: "",
    myStocks: [],
    balance: 0,
    operations: [],
    invested: 0,
  });
  const navigate = useNavigate();
  const userCollectionRef = collection(db, "users");
  const [modal, setModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectTime, setSelectTime] = useState("1d");
  const [totalReturn, setTotalReturn] = useState(0);
  const [reloadComponent, setReloadComponent] = useState(false);

  const getProfile = async () => {
    const email = sessionStorage.getItem("email");
    const data = await getDocs(userCollectionRef);
    data.forEach((doc) => {
      if (doc.data().email === email) {
        setUser({
          email: doc.data().email,
          username: doc.data().username,
          myStocks: doc.data().myStocks,
          balance: doc.data().balance,
          operations: doc.data().operations,
          invested: doc.data().invested,
        });
      }
    });
  };

  const calculateTotalReturn = async () => {
    let total = 0;
    for (let i = 0; i < user.myStocks.length; i++) {
      const result = await totalReturnCalculation(
        user.myStocks[i].price,
        user.myStocks[i].shares,
        user.myStocks[i].ticker
      );
      total += result;
    }
    setTotalReturn(total);
    setReloadComponent(true); // Trigger component reload
  };

  useEffect(() => {
    if (!sessionStorage.getItem("email")) {
      window.location.href = "/login";
    } else {
      getProfile();
    }
  }, []);

  useEffect(() => {
    if (user.myStocks.length > 0) {
      calculateTotalReturn();
    }
  }, [user.myStocks]); // Listen for changes in myStocks

  useEffect(() => {
    // Reload component when reloadComponent state changes
    if (reloadComponent) {
      setReloadComponent(false); // Reset reloadComponent state
    }
  }, [reloadComponent]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchValue(query);
    if (query.trim() !== "") {
      searchLookup(query);
      // mockSearch();
    } else {
      setSearchResults([]);
    }
  };

  const searchLookup = async (search) => {
    console.log(search);
    const options = {
      method: "GET",
      url: `https://yahoo-finance127.p.rapidapi.com/search/${search}`,
      headers: {
        "X-RapidAPI-Key": "6cf0a9ba48msh6e1a173c2609062p127452jsn5455a7849ff8",
        "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response);
      setSearchResults(response.data.quotes);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSearchFocus = () => {
    setIsSearchFocused(!isSearchFocused);
  };
  const totalSharesCalculation = (shares) => {
    let totalShares = 0;
    for (let i = 0; i < shares.length; i++) {
      totalShares += shares[i];
    }
    return totalShares;
  };
  const totalReturnCalculation = async (price, shares, ticker) => {
    let totalInvested = 0.0;
    let currentPrice = 0;
    for (let i = 0; i < price.length; i++) {
      totalInvested += price[i] * shares[i];
    }
    const options = {
      method: "GET",
      url: `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`,
      headers: {
        "X-RapidAPI-Key": "6cf0a9ba48msh6e1a173c2609062p127452jsn5455a7849ff8",
        "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);

      currentPrice = response.data.regularMarketPrice.raw;

      let returnOnStock =
        currentPrice * totalSharesCalculation(shares) - totalInvested;
      console.log("Return: ", returnOnStock);
      return returnOnStock;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="gray-bg">
      <NavBar />
      <div
        className="gray-bg"
        style={{ width: "100%", height: "1500px", marginTop: "0%" }}
      >
        <div className="flex m-auto mt-6 relative w-1/3 h-14 rounded-lg border-2 border-black bg-slate-50">
          <div className="flex w-full h-full align-middle">
            <div>
              <img
                src={searchIcon}
                alt="search"
                style={{
                  width: "30px",
                  height: "30px",
                  marginTop: "10px",
                  marginLeft: "10px",
                  padding: "5px",
                }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter a Stock Name..."
                style={{
                  width: "100%",
                  height: "30px",
                  marginTop: "11px",
                  marginLeft: "10px",
                  padding: "5px",
                  background: "none",
                  outline: "none",
                }}
                className="text-black"
                onChange={handleSearchChange}
                onFocus={toggleSearchFocus}
                onBlur={toggleSearchFocus}
              />
            </div>
          </div>
        </div>
        <div className="dropdown mt-24 w-1/3">
          {searchResults.slice(0, 3).map((result) => (
            <Link key={result.symbol} to={`/stock/${result.symbol}`}>
              <div className="dropdown-item border p-2 hover:font-bold bg-white w-full">
                <button>
                  {result.shortname} ({result.symbol})
                </button>
              </div>
            </Link>
          ))}
        </div>

        <h1 className="text-4xl font-bold px-40">Investing</h1>
        {totalReturn < 0 ? (
          <h1
            className="text-4xl font-bold px-40 text-red-600"
            style={{ paddingTop: "20px" }}
          >
            ${(user.invested + totalReturn).toFixed(2)}
          </h1>
        ) : (
          <h1
            className="text-4xl font-bold px-40 text-green-600"
            style={{ paddingTop: "20px" }}
          >
            ${(user.invested + totalReturn).toFixed(2)}
          </h1>
        )}

        {totalReturn < 0 ? (
          <h1 className="text-lg font-bold px-40 text-red-600">
            △ -${Math.abs(totalReturn).toFixed(2)} (
            {(Math.abs(totalReturn) / user.invested).toFixed(3)}%)
          </h1>
        ) : (
          <h1 className="text-lg font-bold px-40 text-green-600">
            △ ${totalReturn.toFixed(2)} (
            {(totalReturn / user.invested).toFixed(3)}%)
          </h1>
        )}

        {user.myStocks.length !== 0 ? (
            <div>
            <StockGraph
                stockData={{
                ticker: user.myStocks[0].ticker,
                change: user.myStocks[0].change,
                range: selectTime,
                }}
            />
            <h1 className="text-2xl font-semibold px-40 pt-5">
                Graph of {user.myStocks[0].ticker}
            </h1>


            </div>


        ) : (
          <div className="w-3/4 m-auto h-96 bg-white">
            <h1 className="text-2xl font-semibold px-40 pt-5">
              No stocks to display
            </h1>
          </div>
        )}

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
            onClick={() => setSelectTime("1mo")}
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
          <div style={{ marginLeft: "800px" }} className="mt-1">
            <Link className="font-semibold" to={"/buying-power"}>
              Buying Power: ${user.balance.toFixed(2)}
            </Link>
          </div>
        </div>
        <h1 className="text-3xl font-bold px-40 mt-10">Your Holdings</h1>

        <div className="px-40 mt-10">
          {user.myStocks.map((stock) => {
            return (
              <Holding
                data={{
                  ticker: stock.ticker,
                  shares: totalSharesCalculation(stock.shares),
                  return: totalReturnCalculation(
                    stock.price,
                    stock.shares,
                    stock.ticker
                  ),
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
