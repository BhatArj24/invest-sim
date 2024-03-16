import React, { useEffect } from "react";
import {Link} from "react-router-dom";
import { useState } from "react";


const Transaction = ({ data }) => {
    return (
        <div className="bg-white border-black border-2 w-1/4 mt-5 ml-24">
            <Link to={`/stock/${data.ticker}`}>
                    <div className="flex pl-2 pt-2">
                        <h1 className="font-bold pr-10 mt-1">{data.ticker}, <span className="text-gray font-normal">{data.type.toUpperCase()}</span></h1>  
                    </div>
                    <div className="flex pl-2 pb-2">
                        <h1 className="font-bold pr-10 mt-2.5">Date: <span className="text-gray font-normal">{data.date}</span></h1>  
                        <h1 className="font-bold pr-10 mt-2.5">Price: <span className="text-gray font-normal">{data.price}</span></h1>
                        <h1 className="font-bold pr-10 mt-2.5">Shares: <span className="text-gray font-normal">{data.shares}</span></h1>
                    </div>
            </Link>
        </div>
    );
}

export default Transaction;
