import React from "react";
import './Home.css';
import NavBar from "../NavBar.js";
import landingIllustration from "../../Images/LandingIllustration.png";


const Home = () => {
    return (
        <section className="gray-bg">
            <NavBar />
            
            <div
          className="white-bg"
          style={{ width: "100%", height: "1200px", marginTop: "0%" }}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="basis-1/2">
              <h3 className="font-sans font-bold text-4xl mx-3 mt-3 lg:mx-40 lg:mt-20">
                InvestSim
              </h3>
              <p className="font-sans font-normal text-xl mx-3 mt-1 w-80 lg:mx-40">
              Empowering aspiring investors with the tools to hone their trading skills and 
              grow their financial knowledge through simulated stock trading and 
              portfolio management.
              </p>
            </div>
            <div className="basis-1/2">
              <img
                alt="landing illustration"
                src={landingIllustration}
                className="w-50 h-30 mt-10 ml-16 lg:w-7/12"
              ></img>
            </div>
          </div>
        </div>
        </section>
    )
}

export default Home;
