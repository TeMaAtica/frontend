import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as ChestIcon } from "../images/icons/chest.svg";

import { useUser } from "../context/userContext";

const Chests = () => {
    return (
        <section className='w-full flex items-center justify-between h-[100px]  flex-row gap-4 max-w-[700px]'>
            <div className='flex items-center justify-center bg-cards rounded-sm w-[108px] h-[99px] text-white'>
                <ChestIcon />
            </div>
            <div className='flex items-center justify-center bg-cards rounded-sm w-[108px] h-[99px] text-yellow-500'>
                <ChestIcon />
            </div>
            <div className='flex items-center justify-center bg-cards rounded-sm w-[108px] h-[99px] text-red-500'>
                <ChestIcon />
            </div>
        </section>
    );
};

export default Chests;
