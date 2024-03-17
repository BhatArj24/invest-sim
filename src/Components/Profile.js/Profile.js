import React, {useState, useEffect} from "react";
import NavBar from "../NavBar.js";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config.js";
import useStack from "./Stack.js";
import Transaction from "./Transaction.js";
import userPFP from "../../Images/user.png";

const Profile = () => {
    const navigate = useNavigate();
    const userCollectionRef = collection(db,"users");
    const [user, setUser] = useState({email:"",username:"",myStocks:[],balance:0,operations:[],invested:0});
    const {pushToStack, popFromStack, peekStack, isEmpty, clearStack} = useStack();
    const [createStack, setCreateStack] = useState(false);
    const [poppedItems, setPoppedItems] = useState([]);

    const setTransactions = ()=>{
        if(!isEmpty()){
            clearStack();
        }
        const operations = user.operations;
        operations.forEach(operation => {
            pushToStack(operation);
            console.log(peekStack());
        });
        while(!isEmpty()){
            setPoppedItems([...poppedItems,popFromStack()]);
        }
    }

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
        if(user.operations.length > 0 && !createStack){
            setCreateStack(true);
            setTransactions();
        }
    }
    useEffect(() => {
            if (!sessionStorage.getItem("email")) {
                navigate("/login");
            } else {
                getProfile();
            }
    }, []);

    return(
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "1500px", marginTop: "0%" }}>
                <div className="flex justify-center">
                    <img src={userPFP} alt="user" style={{ width: "200px", height: "200px", borderRadius: "50%", marginTop: "50px" }} />
                </div>
                <h1 className="text-3xl font-bold px-24 mt-10">Welcome, {user.username}</h1>
                <div className="flex justify-center">
                    <h1 className="text-2xl font-bold" style={{ marginTop: "50px", paddingRight:"30px" }}>Your Balance:</h1>
                    <div className="flex justify-center items-center" style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "green", marginTop: "20px" }}>
                        <h1 className="text-2xl font-bold" style={{ color: "white" }}>${user.balance.toFixed(2)}</h1>
                    </div>
                </div>



                <h1 className="text-3xl font-bold px-24 mt-10">Your Transactions</h1>
                <div>
                    {
                        user.operations.map((operation, index) => {
                            return (
                                <Transaction key={index} data={operation} className="pt-5" />
                            );
                        })
                    }
                </div>

                <button 
                style={{backgroundColor:"red",border:"none",padding:"10px",cursor:"pointer", color:"white"}}
                className="mt-10 ml-24"
                onClick={() => {
                    signOut(auth).then(() => {
                        sessionStorage.removeItem("email");
                        navigate("/login");
                    }).catch((error) => {
                        console.log(error);
                    });
                }}>Sign Out</button>

            </div>
        </section>


    );
}

export default Profile;