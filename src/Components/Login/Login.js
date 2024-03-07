import React, {useState, useEffect} from "react";
import './Login.css';
import SideImage from "../../Images/LoginRegister.png";
import back from "../../Images/back.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {auth} from "../../firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const handleChange = ({ currentTarget: input }) => {
      setData({ ...data, [input.name]: input.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                sessionStorage.setItem("email", data.email)
                navigate("/dashboard")
            })
            .catch((error) => {
                window.alert("Invalid email or password");
            });
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
                        Login
                    </h1>
                    <form className="mx-16 mt-12" onSubmit={handleSubmit}>
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
                        <div className="mb-6">
                            <label className="block text-black text-xl mb-2" for="password">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                required
                                className="shadow appearance-none border rounded w-72 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                
                            />
                        </div>
                        <div>
                            <Link to="/forgot-password">
                                <button className="block font-bold text-sm text-black hover:text-slate-800 underline mb-4" >
                                    Forgot Password?
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="block font-bold text-sm text-black hover:text-slate-800 underline mb-4" >
                                    Create an account
                                </button>
                            </Link>
                            <Link to="/home">
                                <div className="border-2 rounded-full w-10 mb-4 border-black p-2">
                                    <img alt="back" src={back} className="w-8"></img>
                                </div>
                            
                            </Link>
                            <button className="block bg-black hover:bg-slate-700 text-white font-bold py-3 px-12 focus:outline-none focus:shadow-outline rounded-full" type="submit">
                                Log In
                            </button>
                        </div>
                    </form>  
                </div>
            </div>
        </section>
    )
}

export default Login;
