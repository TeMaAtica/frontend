import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as UserIcon } from "../images/icons/user.svg";
import LevelIcon from "../images/icons/LvlIcon";

const Header = () => {
    return (
        <section className='w-full flex items-center justify-between align-middle h-[80px] bg-cards flex-row gap-8 px-5 py-2'>
            <NavLink to='/'>
                <div className='flex items-center justify-between align-middle text-white py-1 px-2 rounded-md bg-background2 gap-2 pr-8 relative h-[36px] shadow-[0px_4px_4px_0px_#00000040]'>
                    <UserIcon />
                    <span className='font-Inter text-18.5 font-semibold text-left'>
                        sch1z0o
                    </span>
                    <span className=' text-primary bg-background2 rounded-full absolute right-[-27px] top-[-10px] shadow-[0px_4px_4px_0px_#00000040]'>
                        <LevelIcon level={5} className='text-primary' />
                    </span>
                </div>
            </NavLink>
            <NavLink to='/connect'>
                <div className='flex items-center justify-between align-middle text-white py-1 px-2 rounded-md bg-background2 gap-2 h-[36px] shadow-[0px_4px_4px_0px_#00000040]'>
                    <span className='font-Inter text-18.5 font-semibold text-left'>
                        Claim
                    </span>
                    <UserIcon />
                </div>
            </NavLink>
        </section>
    );
};

export default Header;
