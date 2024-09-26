import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "../App.css";
import "../fire.scss";

import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import {UserProvider, useUser} from "../context/userContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const tele = window.Telegram.WebApp;
const Home = () => {
    // const { id, username, referrals, loading } = useUser();

    useEffect(() => {
        const handleContextMenu = (event) => event.preventDefault();
        const handleKeyDown = (event) => {
            if (
                (event.ctrlKey && (event.key === "u" || event.key === "s")) ||
                (event.ctrlKey && event.shiftKey && event.key === "i")
            ) {
                event.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        tele.ready();
        tele.expand();

        window.Telegram.WebApp.setHeaderColor("#191b33"); // Set header color to red

        // Haptic feedback
        if (tele.HapticFeedback) {
            tele.HapticFeedback.impactOccurred("medium");
        }
    }, []);

    return (
        <>
            <div className='w-full flex justify-center flex-col'>
                <Header />
                <div className='w-full flex justify-center'>
                    <div className='flex flex-col pt-8 space-y-3 w-full'>
                        <UserProvider>
                            <AnimatePresence mode='wait'>
                                <Outlet />
                            </AnimatePresence>
                        </UserProvider>

                        <div
                            id='footermain'
                            className={`flex flex-col bg-background space-y-6 fixed bottom-0 py-6 left-0 right-0 justify-center items-center px-5`}
                        >
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
