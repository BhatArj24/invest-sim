import React, {useState, useEffect} from "react";
import './Register.css';
import SideImage from "../../Images/LoginRegister.png";
import back from "../../Images/back.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "../../firebase-config.js";
import {collection, addDoc, setDoc, doc} from "firebase/firestore";

const Register = () => {

    const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
        confirmPassword: ""
	});
    
	const [error, setError] = useState("");
	const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const userCollectionRef = collection(db,"users");
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = (e) => {
        e.preventDefault();
        if(data.password === data.confirmPassword){
            createUserWithEmailAndPassword(auth, data.email, data.password)
                .then(async (userCredential) => {
                    sessionStorage.setItem("email", data.email);
                    await setDoc(doc(db, "users",data.email), {
                        username: data.username,
                        email: data.email,
                        balance: 500,
                        myStocks: [],
                        operations: [],
                        invested: 0,
                    });
                    navigate("/dashboard");
                })
                .catch((error) => {
                    console.log(error)
            });
        }
	};
    useEffect(() => {
        if (sessionStorage.getItem("email")) {
            navigate("/browse");
        }
    }, []);
    return (
        <section className="gray-bg">
            <div className="gray-bg flex" style={{width:"100%",height:"100%",marginTop:"0%"}}>
                
                <div className="basis-1/3">
                    <img alt="landing illustration" src={SideImage} className="h-full"></img>
                </div>
                <div className="basis-1/2">
                    <h1 className="font-sans font-bold text-5xl mt-3 mx-16 lg:mt-20">
                        Signup
                    </h1>
                    <form className="mx-16 mt-12" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-black text-xl mb-2" for="username">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                onChange={handleChange}
                                value={data.username}
                                required
                                className="shadow appearance-none border rounded w-72 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black text-xl mb-2" for="email">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                required
                                className="shadow appearance-none border rounded w-72 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black text-xl mb-2" for="password">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="***********"
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                required
                                className="shadow appearance-none border rounded w-72 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-black text-xl mb-2" for="email">
                                Confirm Password
                            </label>
                            <input className="shadow appearance-none border rounded w-72 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="confirmPassword" type="password" placeholder="******************" onChange={handleChange} value={data.confirmPassword}></input>
                        </div>
                        <div>
                            <Link to="/login">
                                <button className="block font-bold text-sm text-black hover:text-slate-800 underline mb-4" >
                                    Already have an account?
                                </button>
                            </Link>
                            <Link to="/home">
                                <div className="border-2 rounded-full w-10 mb-4 border-black p-2">
                                    <img alt="back" src={back} className="w-8"></img>
                                </div>
                            
                            </Link>
                            <button className="block bg-black hover:bg-slate-700 text-white font-bold py-3 px-12 focus:outline-none focus:shadow-outline rounded-full" type="submit">
                                Sign Up
                            </button>
                        </div>
                    </form>  
                </div>
            </div>
        </section>
    )
}

export default Register;
