import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from "styled-components";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import Levels from '../Components/Levels';
import flash from "../images/flash.webp";
import coinsmall from "../images/coinsmall.webp";
import useSound from 'use-sound';
import boopSfx from '../get.mp3';
import burnSfx from '../burn.wav';
import axios from 'axios';




const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Plutos = () => {

  const imageRef = useRef(null);
  const [play] = useSound(boopSfx);
  const [play2] = useSound(burnSfx);
  const [clicks, setClicks] = useState([]);
  const { name, balance, tapBalance, energy, battery, tapGuru, mainTap, setIsRefilling, refillIntervalRef, refillEnergy, setEnergy, tapValue, setTapBalance, setBalance, refBonus, level, loading, id } = useUser();

  const [points, setPoints] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [glowBooster, setGlowBooster] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const debounceTimerRef = useRef(null);
  const refillTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const accumulatedBalanceRef = useRef(balance);
  const accumulatedEnergyRef = useRef(energy);
  const accumulatedTapBalanceRef = useRef(tapBalance);
  const refillTimeoutRef = useRef(null);

  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    if (isIOS && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid && 'vibrate' in navigator) {
      // Use the vibration API on Android
      navigator.vibrate(50); // Vibrate for 50ms
    } else {
      console.warn('Haptic feedback not supported on this device.');
    }
  }




  const handleClick = async (e) => {
    play();
    triggerHapticFeedback();

    if (energy <= 0 || isDisabled || isUpdatingRef.current) {
      setGlowBooster(true);
      setTimeout(() => {
        setGlowBooster(false);
      }, 300);
      return;
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
        offsetX < horizontalMidpoint
            ? 'wobble-left'
            : offsetX > horizontalMidpoint
                ? 'wobble-right'
                : offsetY < verticalMidpoint
                    ? 'wobble-top'
                    : 'wobble-bottom';

    imageRef.current.classList.remove(
        'wobble-top',
        'wobble-bottom',
        'wobble-left',
        'wobble-right'
    );

    imageRef.current.classList.add(animationClass);

    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500);

    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - tapValue.value, 0);
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setPoints((prevPoints) => prevPoints + tapValue.value);

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + tapValue.value;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    setTimeout(() => {
      setClicks((prevClicks) =>
          prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000);

    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateUserData, 1000);

    clearInterval(refillIntervalRef.current);
    setIsRefilling(false);
    clearTimeout(refillTimeoutRef.current);
    refillTimeoutRef.current = setTimeout(() => {
      if (energy < battery.energy) {
        refillEnergy();
      }
    }, 1000);
  };

  const updateUserData = async () => {
    try {
      await axios.put(`/api/user/${id}/update`, {
        balance: accumulatedBalanceRef.current,
        energy: accumulatedEnergyRef.current,
        tapBalance: accumulatedTapBalanceRef.current
      });

      accumulatedBalanceRef.current = balance;
      accumulatedEnergyRef.current = energy;
      accumulatedTapBalanceRef.current = tapBalance;
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      isUpdatingRef.current = false;
    }
  };



  const energyPercentage = (energy / battery.energy) * 100;



  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    // } else {
    //   return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    } else {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    }
  };

  return (
<>
      {loading ? (
        <Spinner />
      ) : (
  
        <Animate>
         <div className="w-full flex justify-center flex-col overflow-hidden">
         <h3 className="text-[#fff] text-[18px] font-extrabold text-center mb-2">
            Welcome, {name}
            </h3>
          <div className="flex space-x-[2px] justify-center items-center">
            <div className="w-[50px] h-[50px]">
              <img src={coinsmall} className="w-full" alt="coin" />
            </div>
            <h1 className="text-[#fff] text-[42px] font-extrabold">
            {formatNumber(balance + refBonus)} <br/>
          
            </h1>
          </div>
          <div
          
            className="w-full ml-[6px] flex space-x-1 items-center justify-center"
          >
            <img
              src={level.imgUrl}
              className="w-[25px] relative"
              alt="bronze"
            />
            <h2 onClick={() => setShowLevels(true)}className="text-[#9d99a9] text-[20px] font-medium">
            {level.name}
            </h2>
            <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
          </div>
          <div className="w-full flex justify-center items-center pt-7 pb-24 relative">

          <div className="bg-[#efc26999] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] top-10 -left-40 rounded-full"></div>
          <div class={`${tapGuru ? 'block' : 'hidden'} pyro`}>
  <div class="before"></div>
  <div class="after"></div>
</div>
            <div className="w-[350px] h-[350px] relative flex items-center justify-center">
            <img src='/lihgt.webp'
                alt='err' className={`absolute w-[330px] rotate-45 ${tapGuru ? 'block' : 'hidden'}`}/>

              <div className="image-container">
             {mainTap && (
              <Container>
                  <img
                    onPointerDown={handleClick}
                    ref={imageRef}
                    src='/coinsmall.webp'
                    alt="Wobble"
                    className="wobble-image !w-[250px] select-none"
                  />
                  {clicks.map((click) => (
                    <SlideUpText key={click.id} x={click.x} y={click.y}>
                      +{tapValue.value}
                    </SlideUpText>
                  ))}
                </Container>
             )}   
             {tapGuru && (
              <Container>

                  <img
                    onPointerDown={handleClickGuru}
                    ref={imageRef}
                    src='/coinsmall.webp'
                    alt="Wobble"
                    className="wobble-image !w-[250px] select-none"
                  />
                  {clicks.map((click) => (
                    <SlideUpText key={click.id} x={click.x} y={click.y}>
                      +{tapValue.value * 5}
                    </SlideUpText>
                  ))}
                </Container>
             )}   
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">
            <div className="flex flex-col w-full items-center justify-center">
              <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
                <img alt="flash" src={flash} className="w-[20px]" />
                <div className="">
                  <span className="text-[18px] font-bold">{energy.toFixed(0)}</span>
                  <span className="text-[14px] font-medium">/ {battery.energy}</span>
                </div>
              </div>
              <div className="flex w-full p-[4px] h-[20px] items-center bg-energybar rounded-[12px] border-[1px] border-borders2">
              <div
          className="bg-[#e39725] h-full rounded-full transition-width duration-100"
          style={{ width: `${energyPercentage}%` }}
        ></div>
              </div>
            </div>
          </div>
          <Levels showLevels={showLevels} setShowLevels={setShowLevels} />






          </div>
        </Animate>
      )}
</>
  );
};


export default Plutos;
