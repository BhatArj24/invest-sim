import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar.js";

const Sell = () => {
    const { ticker } = useParams();

    return (
        <section className="gray-bg">
            <NavBar />
            <div className="white-bg" style={{ width: "100%", height: "1000px", marginTop: "0%" }}>
                Sell
            </div>
        </section>
    )
}

export default Sell;