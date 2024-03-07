import React from "react";
import NavBar from "../NavBar.js";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

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
            </div>
        </section>


    );
}

export default Profile;