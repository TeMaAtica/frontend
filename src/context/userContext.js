import React, {createContext, useContext, useState, useEffect, useRef, useCallback} from 'react';
import {disableReactDevTools} from '@fvilers/disable-react-devtools';
import axios from 'axios';


if (process.env.NODE_ENV === 'production') {
    disableReactDevTools();
}

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [balance, setBalance] = useState(0);
    // const [totalBalance, setTotalBalance] = useState(0);
    const [tapBalance, setTapBalance] = useState(0);
    const [level, setLevel] = useState({
        id: 1,
        name: "Warm",
        imgUrl: '/warm.webp',
        imgTap: '/coin-1.webp',
        imgBoost: '/coins-1.webp'
    }); // Initial level as an object with id and name
    const [tapValue, setTapValue] = useState({level: 1, value: 1});
    const [timeRefill, setTimeRefill] = useState({level: 1, duration: 10, step: 600});
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [energy, setEnergy] = useState(500);
    const [battery, setBattery] = useState({level: 1, energy: 500});
    const [initialized, setInitialized] = useState(false);
    const [refBonus, SetRefBonus] = useState(0);
    const [manualTasks, setManualTasks] = useState([]);
    const [userManualTasks, setUserManualTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]); // State to hold completed tasks
    const [claimedMilestones, setClaimedMilestones] = useState([]);
    const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
    const [referrals, setReferrals] = useState([]); // State to hold referrals
    // const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    const initData = window.Telegram.WebApp.initData;
    const [refiller, setRefiller] = useState(0);
    const {count, setCount} = useState(0);
    const [tapGuru, setTapGuru] = useState(false);
    const [mainTap, setMainTap] = useState(true);
    const [time, setTime] = useState(22);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [freeGuru, setFreeGuru] = useState(3);
    const [fullTank, setFullTank] = useState(3);
    const [timeSta, setTimeSta] = useState(null);
    const [timeStaTank, setTimeStaTank] = useState(null);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    // eslint-disable-next-line
    const [idme, setIdme] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [dividedCount, setDividedCount] = useState(0);
    const [users, setUsers] = useState(0);
    const [dividedUsers, setDividedUsers] = useState(0);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskCompleted2, setTaskCompleted2] = useState(false);

    const refillIntervalRef = useRef(null);
    const accumulatedEnergyRef = useRef(energy);
    const [isRefilling, setIsRefilling] = useState(false);
    const refillDuration = timeRefill.duration * 60 * 1000; // 2 minutes in milliseconds
    const refillSteps = timeRefill.step; // Number of increments
    const incrementValue = refiller / refillSteps; // Amount to increment each step
    const defaultEnergy = refiller; // Default energy value

    axios.interceptors.request.use(
        (config) => {
            if (jwtToken) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    const refillEnergy = () => {
        if (isRefilling) return;

        setIsRefilling(true);
        refillIntervalRef.current = setInterval(() => {
            setEnergy((prevEnergy) => {
                if (isNaN(prevEnergy) || prevEnergy >= refiller) {
                    clearInterval(refillIntervalRef.current);
                    setIsRefilling(false);
                    return refiller;
                }
                const newEnergy = Math.min(prevEnergy + incrementValue, refiller); // Ensure energy doesn't exceed max
                if (!isNaN(newEnergy)) {
                    accumulatedEnergyRef.current = newEnergy;
                    localStorage.setItem('energy', newEnergy); // Save updated energy to local storage
                    localStorage.setItem('lastRefillTime', Date.now()); // Save the current time
                    console.log('Energy saved to local storage:', newEnergy); // Log the energy value saved to local storage
                }

                return newEnergy;
            });
        }, refillDuration / refillSteps); // Increase energy at each step
    };

    useEffect(() => {
        if (energy < refiller && !isRefilling) {
            refillEnergy();
            // console.log('REFILLER IS', refiller)
        }
        // eslint-disable-next-line
    }, [energy, isRefilling]);

    useEffect(() => {
        return () => {
            clearInterval(refillIntervalRef.current);
        };
    }, []);


    useEffect(() => {
        let timerId;
        if (isTimerRunning && time > 0) {
            timerId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setTapGuru(false);
            setMainTap(true);
        }
        return () => clearInterval(timerId);
    }, [isTimerRunning, time]);

    const startTimer = useCallback(() => {
        setTime(22);
        setTapGuru(true);
        setIsTimerRunning(true);
    }, []);


    const authenticateUser = async () => {
        try {
            const response = await axios.post('/api/authenticate', {
                initData: initData,
            });
            setJwtToken(response.data.token);
            console.log('Аутентификация успешна, JWT-токен получен');
        } catch (error) {
            console.error('Ошибка аутентификации:', error);
        }
    };

    const sendUserData = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        let referrerId = queryParams.get('ref');
        if (referrerId) {
            referrerId = referrerId.replace(/\D/g, '');
        }

        const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (telegramUser) {
            const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;

            const finalUsername = username || `${firstName}_${userId}`;

            try {
                const response = await axios.post('/api/user', {
                    userId: userId.toString(),
                    username: finalUsername,
                    firstName,
                    lastName,
                    referrerId: referrerId || null,
                });

                const userData = response.data;
                setBalance(userData.balance);
                setTapBalance(userData.tapBalance);
                setTapValue(userData.tapValue);
                setFreeGuru(userData.freeGuru);
                setFullTank(userData.fullTank);
                setTimeSta(userData.timeSta);
                setTimeStaTank(userData.timeStaTank);
                setClaimedMilestones(userData.claimedMilestones || []);
                setClaimedReferralRewards(userData.claimedReferralRewards || []);
                setBattery(userData.battery);
                setRefiller(userData.battery.energy);
                setTimeRefill(userData.timeRefill);
                setLevel(userData.level);
                setId(userData.userId);
                SetRefBonus(userData.refBonus || 0);
                setInitialized(true);
                setLoading(false);

                await fetchData(userData.userId);
                await updateReferrals();

            } catch (error) {
                console.error('Ошибка при сохранении данных пользователя:', error);
            }
        }
    };


    const updateReferrals = async () => {
        try {
            const response = await axios.get('/api/user/referrals');
            const updatedReferrals = response.data.referrals || [];

            setReferrals(updatedReferrals);

            const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
            const refBonus = Math.floor(totalEarnings * 0.1);
            const totalBalance = balance + refBonus;

            SetRefBonus(refBonus);

            await axios.put('/api/user/updateRefBonus', { refBonus, totalBalance });

            console.log(`Общие заработки: ${totalEarnings}, Реферальный бонус: ${refBonus}`);
        } catch (error) {
            console.error('Ошибка при обновлении рефералов:', error);
        }
    };

    const fetchData = async (userId) => {
        if (!userId) return;
        try {
            const tasksResponse = await axios.get('/api/tasks');
            setTasks(tasksResponse.data);

            const userResponse = await axios.get(`/api/user/${userId}`);
            const userData = userResponse.data;
            setCompletedTasks(userData.tasksCompleted || []);
            setUserManualTasks(userData.manualTasks || []);

            const manualTasksResponse = await axios.get('/api/manualTasks');
            setManualTasks(manualTasksResponse.data);

        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };


    const fetchReferrals = async () => {
        try {
            const response = await axios.get('/api/user/referrals');
            setReferrals(response.data.referrals || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching referrals: ", error);
            setLoading(false);
        }
    };

    const updateUserLevel = async (userId, newTapBalance) => {
        let newLevel = {id: 1, name: "Warm", imgUrl: "/warm.webp", imgTap: "/coin-1.webp", imgBoost: "/coins-1.webp"};

        if (newTapBalance >= 500000 && newTapBalance < 1000000) {
            newLevel = {id: 2, name: "Light", imgUrl: "/light.webp", imgTap: "/coin-2.webp", imgBoost: "/coins-2.webp"};
        } else if (newTapBalance >= 1000000 && newTapBalance < 2000000) {
            newLevel = {id: 3, name: "Blaze", imgUrl: "/blaze.webp", imgTap: "/coin-3.webp", imgBoost: "/coins-3.webp"};
        } else if (newTapBalance >= 2000000 && newTapBalance < 4000000) {
            newLevel = {id: 4, name: "Flame", imgUrl: "/flame.webp", imgTap: "/coin-4.webp", imgBoost: "/coins-4.webp"};
        } else if (newTapBalance >= 4000000 && newTapBalance < 8000000) {
            newLevel = {id: 5, name: "Hot", imgUrl: "/hot.webp", imgTap: "/coin-5.webp", imgBoost: "/coins-5.webp"};
        } else if (newTapBalance >= 8000000 && newTapBalance < 25000000) {
            newLevel = {
                id: 6,
                name: "Burning",
                imgUrl: "/burning.webp",
                imgTap: "/coin-6.webp",
                imgBoost: "/coins-6.webp"
            };
        } else if (newTapBalance >= 25000000 && newTapBalance < 50000000) {
            newLevel = {
                id: 7,
                name: "Burning1",
                imgUrl: "/burning.webp",
                imgTap: "/coin-6.webp",
                imgBoost: "/coins-6.webp"
            };
        } else if (newTapBalance >= 50000000 && newTapBalance < 100000000) {
            newLevel = {
                id: 8,
                name: "Burning2",
                imgUrl: "/burning.webp",
                imgTap: "/coin-6.webp",
                imgBoost: "/coins-6.webp"
            };
        } else if (newTapBalance >= 100000000 && newTapBalance < 1000000000) {
            newLevel = {
                id: 9,
                name: "Burning3",
                imgUrl: "/burning.webp",
                imgTap: "/coin-6.webp",
                imgBoost: "/coins-6.webp"
            };
        } else if (newTapBalance >= 1000000000 && newTapBalance < 10000000000) {
            newLevel = {
                id: 10,
                name: "Burning4",
                imgUrl: "/burning.webp",
                imgTap: "/coin-6.webp",
                imgBoost: "/coins-6.webp"
            };
        } else if (newTapBalance >= 10000000000) {
            newLevel = {
                id: 11,
                name: "Burning5",
                imgUrl: "/burning.webp",
                imgTap: "/coin-6.webp",
                imgBoost: "/coins-6.webp"
            };
        }


        if (newLevel.id !== level.id) {
            setLevel(newLevel);
            try {
                await axios.put(`/api/user/${userId}/level`, { level: newLevel });
                console.log(`Уровень пользователя обновлен до ${newLevel.name}`);
            } catch (error) {
                console.error('Ошибка при обновлении уровня пользователя:', error);
            }
        }
    };


    useEffect(() => {
        const initialize = async () => {
            await authenticateUser();
            await sendUserData();
        };
        initialize();
    }, []);

    useEffect(() => {
        if (id) {
            const storedEnergy = localStorage.getItem('energy');
            const lastRefillTime = localStorage.getItem('lastRefillTime');

            if (storedEnergy && lastRefillTime) {
                const energyValue = Number(storedEnergy);
                const lastTime = Number(lastRefillTime);

                if (!isNaN(energyValue) && energyValue >= 0 && !isNaN(lastTime) && lastTime > 0) {
                    const elapsedTime = Date.now() - lastTime;
                    const elapsedSteps = Math.floor(elapsedTime / (refillDuration / refillSteps));
                    const restoredEnergy = Math.min(energyValue + elapsedSteps * incrementValue, refiller);

                    if (!isNaN(restoredEnergy) && restoredEnergy >= 0) {
                        setEnergy(restoredEnergy);
                        localStorage.setItem('energy', restoredEnergy); // Update the stored energy
                        localStorage.setItem('lastRefillTime', Date.now()); // Update the last refill time

                        if (restoredEnergy < refiller) {
                            setIsRefilling(false);
                            refillEnergy();
                        }
                    }
                } else {
                    // If stored energy or last time is invalid, reset energy to default value
                    setEnergy(defaultEnergy);
                    localStorage.setItem('energy', defaultEnergy);
                    localStorage.setItem('lastRefillTime', Date.now());
                }
            } else if (storedEnergy) {
                const energyValue = Number(storedEnergy);
                if (!isNaN(energyValue) && energyValue >= 0) {
                    setEnergy(energyValue);
                } else {
                    setEnergy(defaultEnergy);
                    localStorage.setItem('energy', defaultEnergy);
                    localStorage.setItem('lastRefillTime', Date.now());
                }
            } else {
                setEnergy(defaultEnergy);
                localStorage.setItem('energy', defaultEnergy);
                localStorage.setItem('lastRefillTime', Date.now());
            }

            fetchData(id);
            console.log('MY REFIILER IS:', refiller)
        }
        // eslint-disable-next-line
    }, [id]);

    const checkAndUpdateFreeGuru = async () => {
        try {
            const response = await axios.get('/api/user/checkFreeGuru');
            const {freeGuru} = response.data;
            setFreeGuru(freeGuru);
        } catch (error) {
            console.error('Error checking and updating FreeGuru:', error);
        }
    };

    const checkAndUpdateFullTank = async () => {
        try {
            const response = await axios.get('/api/user/checkFullTank');
            const {fullTank} = response.data;
            setFullTank(fullTank);
        } catch (error) {
            console.error('Error checking and updating FullTank:', error);
        }
    };


    useEffect(() => {
        const fetchRemainingClicks = async () => {
            if (id) {
                try {
                    const response = await axios.get(`/api/user/${id}/remainingClicks`);
                    const userData = response.data;
                    setFreeGuru(userData.freeGuru || 0);
                    setFullTank(userData.fullTank || 0);
                } catch (error) {
                    console.error('Error fetching remaining clicks:', error);
                }
            }
        };

        fetchRemainingClicks();
    }, [id]);


    useEffect(() => {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
        const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;
        const telegramName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
        const telegramLastName = window.Telegram.WebApp.initDataUnsafe?.user?.last_name;

        if (telegramUsername) {
            setUsername(telegramUsername);
        }
        if (telegramName) {
            setName(`${telegramName} ${telegramLastName || ''}`);
        }
        if (telegramUserid) {
            setIdme(telegramUserid);
        }

        fetchTotalCountFromServer().then((totalCount) => {
            setTotalCount(totalCount);
            const divided = calculateDividedCount(totalCount);
            setDividedCount(divided);
        });

        fetchAllUsers();
    }, []);


    const fetchTotalCountFromServer = async () => {
        try {
            const response = await axios.get('/api/totalBalance');
            const totalCount = response.data.totalBalance;
            return totalCount;
        } catch (e) {
            console.error("Error fetching total balance: ", e);
            return 0;
        }
    };


    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            const allUsers = response.data.users;
            setUsers(allUsers.length);
            setDividedUsers(allUsers.length / 2);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users: ", error);
            setLoading(false);
        }
    };


    const calculateDividedCount = (count) => {
        return count / 4;
    };


    useEffect(() => {
        if (id) {
            checkAndUpdateFreeGuru();
            checkAndUpdateFullTank();
        }
    }, [id]);


    useEffect(() => {
        if (id) {
            updateUserLevel(id, tapBalance);
        }
    }, [tapBalance, id]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 6000);
    }, []);

    useEffect(() => {
        fetchReferrals();
    }, []);

    return (
        <UserContext.Provider value={{
            balance,
            battery,
            freeGuru,
            fullTank,
            taskCompleted,
            setTaskCompleted,
            taskCompleted2,
            setTaskCompleted2,
            setFullTank,
            timeStaTank,
            setTimeStaTank,
            timeSta,
            setFreeGuru,
            time,
            setTime,
            startTimer,
            tapGuru,
            setTapGuru,
            mainTap,
            setMainTap,
            timeRefill,
            setTimeRefill,
            refiller,
            setRefiller,
            count,
            setCount,
            isRefilling,
            setIsRefilling,
            refillIntervalRef,
            setBattery,
            refillEnergy,
            tapValue,
            setTapValue,
            tapBalance,
            setTapBalance,
            level,
            energy,
            setEnergy,
            setBalance,
            setLevel,
            loading,
            setLoading,
            id,
            setId,
            sendUserData,
            initialized,
            setInitialized,
            refBonus,
            SetRefBonus,
            manualTasks,
            setManualTasks,
            userManualTasks,
            setUserManualTasks,
            tasks,
            setTasks,
            completedTasks,
            setCompletedTasks,
            claimedMilestones,
            setClaimedMilestones,
            referrals,
            claimedReferralRewards,
            setClaimedReferralRewards,
            idme,
            setIdme,
            totalCount,
            setTotalCount,
            dividedCount,
            setDividedCount,
            users,
            setUsers,
            dividedUsers,
            setDividedUsers,
            username,
            setUsername,
            name,
            setName
        }}>
            {children}
        </UserContext.Provider>
    );
};