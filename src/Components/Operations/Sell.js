import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar.js";
import {collection, getDocs, updateDoc, doc, arrayUnion} from "firebase/firestore";
import {db} from "../../firebase-config.js";
import axios from "axios";
import Operation from "../../Classes/Operation.js";
import { useNavigate } from "react-router-dom";

const Sell = () => {
    const { ticker } = useParams();
    const [stock, setStock] = useState({price:0, name:"",ticker:""});
    const [amount, setAmount] = useState();
    const [user, setUser] = useState({email:"",username:"",myStocks:[],balance:0,operations:[],invested:0});
    const userCollectionRef = collection(db,"users");
    const [total, setTotal] = useState(0);
    const [totalShares, setTotalShares] = useState(0);
    const navigate = useNavigate();
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
          setStock({...stock, price: response.data.regularMarketPrice.raw, name: response.data.displayName, ticker: response.data.symbol});
        } catch (error) {
          console.error(error);
        }
    }
    const totalSharesCalculation = (shares) => {
        let totalShares = 0;
        for (let i = 0; i < shares.length; i++) {
            totalShares += shares[i];
        }
        console.log(totalShares);
        return totalShares;
    }
    const handleSell = async () => {
        if(totalShares - amount < 0){
            alert("You don't have enough shares to sell");
            return;
        }
        let totalReturn = 0;
        user.myStocks.forEach((s) => {
            if (s.ticker === ticker) {
                for(let i=0;i<s.shares.length;i++){
                    if(s.shares[i] >= amount){
                        s.shares[i] -= amount;
                        totalReturn += amount * s.price[i];
                        break;
                    }else{
                        setAmount(amount - s.shares[i]);
                        s.shares[i] = 0;
                        totalReturn += s.shares[i] * s.price[i];
                    }
                }
            }
        });
        const newOperation = new Operation(new Date().toLocaleString(), ticker, stock.price, amount, "sell");
        const newBalance = user.balance + totalReturn;
        const newInvested = user.invested - totalReturn;
        const op = {date: newOperation.date, ticker: newOperation.ticker, price: newOperation.price, shares: newOperation.shares, type: newOperation.type};
        await updateDoc(doc(db, "users", user.email), {
            balance: newBalance,
            invested: newInvested,
            operations: arrayUnion(op),
            myStocks: user.myStocks
        });
        navigate("/dashboard");
    }

    useEffect(() => {
        if (!sessionStorage.getItem("email")) {
            window.location.href = "/login";
        } else {
            getProfile();
            getStock(ticker);
            if(user.email !== ""){
                user.myStocks.forEach((s) => {
                    if (s.ticker === ticker) {
                        console.log("");
                        setTotalShares(totalSharesCalculation(s.shares));
                    }
                });
            }
        }
    }, []);
    return (
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "800px", marginTop: "0%" }}>
            <div className="bg-white border-2 border-black w-1/3 m-auto rounded-lg" style={{height:"350px"}}>
                    <div className="flex">
                        <div>
                            <h1 className="text-4xl font-bold px-10 pt-8">Operation</h1>
                            <h1 className="text-2xl font-medium px-10 pt-1">Sell</h1>
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
                        <div className="flex pt-3">
                            {/* <h1 className="text-xl" >
                                Shares Left: <span className={`text-xl ${totalShares - amount < 0 ? 'text-red-500' : ''}`}>{(totalShares - amount).toFixed(2)}</span>
                            </h1> */}
                            <h1 className="text-xl" >
                                Shares Left: <span className={`text-xl ${totalShares - amount < 0 ? 'text-red-500' : ''}`}>{totalShares}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex pt-8 px-10">
                        <h1 className="text-xl">Total: <span className="text-green-600">${total.toFixed(2)}</span></h1>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded" style={{marginLeft:"50%"}} onClick={handleSell}>Sell</button>

                    </div>
                </div>

                

            </div>
        </section>
    )
}

export default Sell;