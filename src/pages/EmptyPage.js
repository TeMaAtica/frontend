import React from "react";
import { Outlet } from "react-router-dom";
import "../App.css";
import Animate from '../Components/Animate';
import emptyCat from '../images/empty.png';

const EmptyPage = () => {
    return (
        <Animate>
            <div className="flex flex-col items-center justify-start h-screen bg-[#000000] p-4"> {/* Изменил justify-center на justify-start */}
                <img
                    src={emptyCat}
                    className="w-[240px] h-[240px] mb-2"
                />
                <h1 className="text-white text-[32px] font-semibold">Empty Page</h1>
                <p className="text-[#9a96a6] text-[16px] mt-2">
                    This is an empty page. You can add content here.
                </p>
                <div className="mt-6">
                    {}
                </div>
            </div>
            <Outlet />
        </Animate>
    );
};

export default EmptyPage;