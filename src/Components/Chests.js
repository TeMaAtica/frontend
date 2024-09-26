import React, { useState } from "react";
import { ReactComponent as ChestIcon } from "../images/icons/chest.svg";
import { useUser } from "../context/userContext";
import AnimatedText from "./AnimatedText";

const Chests = ({ rewards = [3, 30, 90] }) => {
    const [effect, setEffect] = useState(Array(rewards.length).fill(false));
    const [animations, setAnimations] = useState([]);
    const { setBalance } = useUser();

    const handleClick = (id, e) => {
        const newEffect = [...effect];
        newEffect[id] = true;
        setEffect(newEffect);

        setBalance((prevBalance) => prevBalance + rewards[id]);

        const cursorPosition = {
            x: e.clientX,
            y: e.clientY - 100,
        };

        setAnimations((prevAnimations) => [
            ...prevAnimations,
            { amount: rewards[id], position: cursorPosition },
        ]);
    };

    const handleAnimationEnd = (index) => {
        // Remove the finished animation from the state
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
