import React from "react";
import ref from "../images/ref4.webp";
import boost from "../images/booster2.webp";
import tasks from "../images/tasks2.webp";
import stats from "../images/stats.webp";
import tonwallet from "../images/wallet2.webp";
import coinsmall from "../images/coins-6.webp";
import { NavLink } from "react-router-dom";

import { ReactComponent as HomeIcon } from "../images/icons/home.svg";
import { ReactComponent as ShopIcon } from "../images/icons/shop.svg";
import { ReactComponent as TasksIcon } from "../images/icons/tasks.svg";
import { ReactComponent as FrensIcon } from "../images/icons/frens.svg";

const Footer = () => {
    return (
        <div className='w-full flex items-center justify-center space-x-2'>
            <NavLink
                to='/'
                className={({ isActive }) => {
                    return `
                      w-[25%] h-[50px]  flex flex-col  items-center justify-between ${
                          isActive ? "text-white" : "text-dimWhite"
                      }`;
                }}
            >
                <HomeIcon />
                <span className='font-Inter text-13.5 font-semibold text-left'>
                    Home
                </span>
            </NavLink>
            {/*  */}

            <NavLink
                to='/boost'
                className={({ isActive }) => {
                    return `
                    w-[25%] h-[50px]  flex flex-col  items-center justify-between ${
                        isActive ? "text-white" : "text-dimWhite"
                    }`;
                }}
            >
                <ShopIcon />
                <span className='font-Inter text-13.5 font-semibold text-left'>
                    Shop
                </span>
            </NavLink>

            {/*  */}

            <NavLink
                to='/connect'
                className={({ isActive }) => {
                    return `
                    w-[25%] h-[50px]  flex flex-col  items-center justify-between ${
                        isActive ? "text-white" : "text-dimWhite"
                    }`;
                }}
            >
                <FrensIcon />
                <span className='font-Inter text-13.5 font-semibold text-left'>
                    Frens
                </span>
            </NavLink>

            {/*  */}

            <NavLink
                to='/tasks'
                className={({ isActive }) => {
                    return `
                    w-[25%] h-[50px]  flex flex-col  items-center justify-between ${
                        isActive ? "text-white" : "text-dimWhite"
                    }`;
                }}
            >
                <TasksIcon />
                <span className='font-Inter text-13.5 font-semibold text-left'>
                    Tasks
                </span>
            </NavLink>
        </div>
    );
};

export default Footer;
