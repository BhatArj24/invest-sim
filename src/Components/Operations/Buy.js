import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar.js";
import {collection, getDocs, updateDoc, doc, arrayUnion} from "firebase/firestore";
import {db} from "../../firebase-config.js";
import axios from "axios";



const Buy = () => {
    const { ticker } = useParams();
    const [stock, setStock] = useState({price:0, name:""});
    const [amount, setAmount] = useState(0);
    const [user, setUser] = useState({email:"",username:"",myStocks:[],balance:0,operations:[],invested:0});
    const userCollectionRef = collection(db,"users");
    const [total, setTotal] = useState(0);
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
    const handleBuy = async () => {
        if (user.balance - total < 0) {
            window.alert("Insufficient funds");
            return;
        }
        let hasStock = false;
        user.myStocks.forEach((stock) => {
            if (stock.ticker === ticker) {
                hasStock = true;
            }
        });

        const newBalance = user.balance - total;
        const newInvested = user.invested + total;
        const newOperation = {date: new Date().toLocaleString(), ticker: ticker, price: stock.price, shares: amount, type: "buy"};
        const newStock = {ticker: ticker, price: [stock.price], shares: [amount]};
        if (!hasStock) {
  
            await updateDoc(doc(db, "users", user.email), {
                balance: newBalance,
                invested: newInvested,
                operations: arrayUnion(newOperation),
                myStocks: arrayUnion(newStock)
            });
        } else{

            user.myStocks.forEach((s) => {
                if (s.ticker === stock.ticker) {

                    s.shares = [...s.shares, amount];
                    s.price = [...s.price, stock.price];
                    console.log(s.shares);
                    console.log(s.price);
                }
            });
            await updateDoc(doc(db, "users", user.email), {
                balance: newBalance,
                invested: newInvested,
                operations: arrayUnion(newOperation),
                myStocks: user.myStocks
            });
        }
        window.location.href = "/dashboard";

    }
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
          setStock({...stock, price: response.data.regularMarketPrice.raw, name: response.data.displayName});
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        if (!sessionStorage.getItem("email")) {
            window.location.href = "/login";
        } else {
            getProfile();
            getStock(ticker);
        }
    }, []);

    return (
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "800px", marginTop: "0%" }}>
            <div className="bg-white border-2 border-black w-1/3 m-auto rounded-lg" style={{height:"325px"}}>
                    <div className="flex">
                        <div>
                            <h1 className="text-4xl font-bold px-10 pt-8">Operation</h1>
                            <h1 className="text-2xl font-medium px-10 pt-1">Buy</h1>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold px-60 pt-8">{stock.name}</h1>
                            <h1 className="text-lg font-medium px-60">{ticker}</h1>
                        </div>
                    </div>

                    <div className="pt-5 mx-10">
                        <div className="flex">
                            <h1 className="text-xl">Price: ${stock.price}</h1>
                        </div>
                        <div className="flex pt-3">
                            <h1 className="text-xl">Amount:</h1>
                            <input 
                                type="number" 
                                className="border-2 border-black w-20 m-auto rounded-lg p-2" 
                                style={{height:"40px"}} 
                                onChange={(e) => {
                                    const inputValue = e.target.value.trim();
                                    const newAmount = inputValue === '' ? 0 : parseFloat(inputValue); 
                                    setAmount(newAmount);
                                    setTotal(newAmount * stock.price); 
                                }} 
                                value={amount} 
                            />


                        </div>
                        <div className="flex">
                            <h1 className={`text-xl ${user.balance - total < 0 ? 'text-red-500' : ''}`}>
                                Buying Power: ${(user.balance - total).toFixed(2)}
                            </h1>
                        </div>
                    </div>

                    <div className="flex pt-10 px-10">
                        <h1 className="text-xl">Total: <span className="text-green-600">${total}</span></h1>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded" style={{marginLeft:"50%"}} onClick={handleBuy}>Buy</button>

                    </div>
                </div>

                

            </div>
        </section>
    )
}

export default Buy;