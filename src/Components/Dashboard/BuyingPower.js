import React, { useEffect, useState } from 'react';
import {collection, getDocs, updateDoc, doc, arrayUnion} from "firebase/firestore";
import {db} from "../../firebase-config.js";
import NavBar from '../NavBar.js';
import {useNavigate } from 'react-router-dom';


const BuyingPower = () => {
    
    const [user, setUser] = useState({email:"",username:"",myStocks:[],balance:0,operations:[],invested:0});
    const userCollectionRef = collection(db,"users");
    const [amount, setAmount] = useState();
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

    const handleIncrease = async () =>{
        await updateDoc(doc(db, "users", user.email), {
            balance: user.balance + amount
        });
        navigate("/dashboard");
    }
    

    useEffect(() => {
        if (!sessionStorage.getItem("email")) {
            navigate("/login");
        } else {
            getProfile();
        }
    }, []);

    return (
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "800px", marginTop: "0%" }}>
            <div className="bg-white border-2 border-black w-1/3 m-auto rounded-lg" style={{height:"325px"}}>
                    <div className="flex">
                        <div>
                            <h1 className="text-4xl font-bold px-10 pt-8">Buying Power</h1>
                            <h1 className="text-2xl font-medium px-10 pt-1">Increase</h1>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold px-60 pt-8"></h1>
                            <h1 className="text-lg font-medium px-60"></h1>
                        </div>
                    </div>

                    <div className="pt-5 mx-10">
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
                                }} 
                                value={amount} 
                            />


                        </div>
                    </div>

                    <div className="flex pt-10 px-10">
                        <h1 className="text-xl">Total Buying Power: ${(user.balance + amount).toFixed(2)}</h1>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded" style={{marginLeft:"50%"}} onClick={handleIncrease}>Confirm</button>

                    </div>
                </div>

                

            </div>
        </section>
    )
}

export default BuyingPower;