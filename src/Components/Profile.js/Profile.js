import React, {useState, useEffect} from "react";
import NavBar from "../NavBar.js";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config.js";
import {useQueueState} from "rooks";

const Profile = () => {
    const navigate = useNavigate();
    const userCollectionRef = collection(db,"users");
    const [user, setUser] = useState({email:"",username:"",myStocks:[],balance:0,operations:[],invested:0});
    const [transactions, {enqueue}] = useQueueState([]);

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
    const setTransactions = () => {
        // reset the queue
        transactions.splice(0,transactions.length);
        const operations = user.operations;
        operations.forEach(operation => {
            enqueue(operation);
            console.log("Operation:",operation);
        });
        console.log(transactions)
      };
    useEffect(() => {
            if (!sessionStorage.getItem("email")) {
                window.location.href = "/login";
            } else {
                getProfile();
                // wait for the user to be set
                if (user.email === "") {
                    console.log("not yet")
                    return;
                }
                else {
                    console.log("set transactions")
                    setTransactions();
                }
            }
    }, []);

    return(
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "1000px", marginTop: "0%" }}>


                <button 
                style={{backgroundColor:"red",border:"none",padding:"10px",cursor:"pointer", color:"white"}}
                onClick={() => {
                    signOut(auth).then(() => {
                        sessionStorage.removeItem("email");
                        navigate("/login");
                    }).catch((error) => {
                        console.log(error);
                    });
                }}>Sign Out</button>

                <div>
                    {/* {transactions.map((operation, index) => {
                        return(
                            <div key={index}>
                                <h1>{operation.date}</h1>
                                <h1>{operation.ticker}</h1>
                                <h1>{operation.price}</h1>
                                <h1>{operation.shares}</h1>
                                <h1>{operation.type}</h1>
                            </div>
                        );
                    }
                    )} */}
                </div>
            </div>
        </section>


    );
}

export default Profile;