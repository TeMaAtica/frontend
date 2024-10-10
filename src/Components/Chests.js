import React, { useState } from "react";
import { ReactComponent as ChestIcon } from "../images/icons/chest.svg";
import { useUser } from "../context/userContext";
import AnimatedText from "./AnimatedText";
import axios from 'axios';

const Chests = ({ rewards = [3, 30, 90] }) => {
    const [effect, setEffect] = useState(Array(rewards.length).fill(false));
    const [animations, setAnimations] = useState([]);
    const { setBalance, balance, id } = useUser();
    // const updateFirestore = async (newBalance) => {
    //     const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    //     if (telegramUser) {
    //         const { id: userId } = telegramUser;
    //         const userRef = doc(db, "telegramUsers", userId.toString());
    //
    //         try {
    //             await updateDoc(userRef, {
    //                 balance: newBalance,
    //             });
    //         } catch (error) {
    //             console.error("Error updating balance:", error);
    //         }
    //     }
    // };

    const handleClick = async (chestId, e) => {
        const newEffect = [...effect];
        newEffect[chestId] = true;
        setEffect(newEffect);

        const newBalance = balance + rewards[chestId];
        setBalance(newBalance);

        try {
            await axios.put('/api/user/updateBalance', {
                userId: id,
                balance: newBalance,
            });
        } catch (error) {
            console.error("Ошибка при обновлении баланса:", error);
        }

        const cursorPosition = {
            x: e.clientX,
            y: e.clientY - 100,
        };

        setAnimations((prevAnimations) => [
            ...prevAnimations,
            { amount: rewards[chestId], position: cursorPosition },
        ]);
    };

    const handleAnimationEnd = (index) => {
        setAnimations((prevAnimations) =>
            prevAnimations.filter((_, i) => i !== index)
        );
    };

    const chestColors = (value) => {
        if (value <= 10) return "text-white";
        if (value <= 35) return "text-yellow-500";
        if (value <= 80) return "text-red-500";
        return "text-cyan-500";
    };

    return (
        <section className='w-full flex items-center justify-between h-[100px] flex-row gap-4 max-w-[700px]'>
            {[...Array(rewards.length)].map((_, i) => {
                return (
                    <button
                        key={i}
                        className={` ${
                            effect[i] && "animate-wiggle"
                        } flex items-center justify-center bg-cards rounded-sm w-[108px] h-[99px] ${chestColors(
                            rewards[i]
                        )}`}
                        onClick={(e) => handleClick(i, e)}
                        onAnimationEnd={() => {
                            const newEffect = [...effect];
                            newEffect[i] = false;
                            setEffect(newEffect);
                        }}
                    >
                        {rewards[i] > 0 ? <ChestIcon /> : ""}
                    </button>
                );
            })}

            {animations.map((animation, index) => (
                <AnimatedText
                    key={index}
                    amount={animation.amount}
                    position={animation.position}
                    onAnimationEnd={() => handleAnimationEnd(index)}
                />
            ))}
        </section>
    );
};

export default Chests;
