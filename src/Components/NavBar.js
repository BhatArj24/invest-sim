
import React from 'react';
import { Link } from 'react-router-dom';
import circleLogo from '../Images/InvestSim_Full_Logo.png';

const NavBar = () => {
    return(
        <header>
            <nav className="flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3">
            <Link to="/home" className="my-0 me-md-auto"><img src={circleLogo} alt="FindMyXI Logo"  style={{width:"200px"}}/></Link>
                <nav className="my-2 my-md-0 me-md-3" style={{marginLeft:"70%"}}>
                    <Link className="mx-2 btn btn-sm p-3 font-bold rounded-full" style={{backgroundColor:"white",border:"none"}} to="/home">Home</Link>
                    {
                        sessionStorage.getItem("email") ? (

                                <Link className="mx-2 btn btn-sm p-3 font-bold rounded-full" style={{backgroundColor:"white",border:"none"}} to="/dashboard">Dashboard</Link>
                            
                        ) : (
                                <Link className="mx-2 btn btn-sm p-3 font-bold rounded-full" style={{backgroundColor:"white",border:"none"}} to="/login">Log In</Link>        
                        
                        )
                    }          
                    {
                        sessionStorage.getItem("email") ? (
                            <Link className="mx-2 btn btn-sm p-3 font-bold rounded-full" style={{backgroundColor:"white",border:"none"}} to="/profile">My Profile</Link>
                        ) : (
                            <Link className="mx-2 btn btn-sm p-3 font-bold rounded-full" style={{backgroundColor:"white",border:"none"}} to="/register">Register</Link>
                        )
                    }
                        
                </nav>
            </nav>
      </header>
    );
};

export default NavBar;


