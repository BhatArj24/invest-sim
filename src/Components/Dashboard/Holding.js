import React, { useEffect } from "react";
import {Link} from "react-router-dom";
import { useState } from "react";


const Holding = ({ data }) => {
    const [isNegativeReturn, setIsNegativeReturn] = useState(null);

    const [totalReturn, setTotalReturn] = useState(0);
    useEffect(() => {
        data.return.then(result =>{
            setTotalReturn(result);
            setIsNegativeReturn(result < 0);
        }) .catch(err => {
            console.log(err);
        }
        ); 
    }, [data.return]);

    const formattedReturn = isNegativeReturn ? `-$${Math.abs(totalReturn).toFixed(2)}` : `$${(totalReturn.toFixed(2))}`;
    

    const borderColor = isNegativeReturn ? "#D10000" : "#209E00";
    const textColor = isNegativeReturn ? "#D10000" : "#209E00";

    return (
        <Link to={`/stock/${data.ticker}`}>
            <div className="flex">
                <h1 className="font-bold pr-10 mt-2.5">{data.ticker}</h1>
                <div className="rounded-full w-20 h-10 border-2" style={{ borderColor }}>
                    <p className="px-2.5 py-1.5 font-semibold" style={{ color: textColor }}>{formattedReturn}</p>
                </div>
            </div>
            <div>
                <p className="text-slate-600 text-sm">{data.shares} Shares</p>
            </div>
            <div className="text-slate-500 mb-4">
                ______________________
            </div>
        </Link>
    );
}

export default Holding;
