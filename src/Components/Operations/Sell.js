import React, {useState} from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar.js";
import {collection, getDocs, updateDoc, doc, arrayUnion} from "firebase/firestore";
import {db} from "../../firebase-config.js";

const Sell = () => {
    const { ticker } = useParams();
    const [stock, setStock] = useState({price:0, name:"",ticker:""});
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

    const handleSell = async () => {
        console.log("sell");
    }
    return (
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "800px", marginTop: "0%" }}>
            <div className="bg-white border-2 border-black w-1/3 m-auto rounded-lg" style={{height:"325px"}}>
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
                        <div className="flex">
                            <h1 className={`text-xl ${user.balance - total < 0 ? 'text-red-500' : ''}`}>
                                Buying Power: ${(user.balance - total).toFixed(2)}
                            </h1>
                        </div>
                    </div>

                    <div className="flex pt-10 px-10">
                        <h1 className="text-xl">Total: <span className="text-green-600">${total}</span></h1>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded" style={{marginLeft:"50%"}} onClick={handleSell}>Buy</button>

                    </div>
                </div>

                

            </div>
        </section>
    )
}

export default Sell;