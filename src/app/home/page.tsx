'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
    const router = useRouter();

    // ✅ Task 7 - Auth states
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // ✅ Whack a Mole states
    const holes = Array.from({ length: 9 });
    const [moleIndex, setMoleIndex] = useState<number | null>(null);
    const [score, setScore] = useState<number>(0);
    const [time, setTime] = useState<number>(30);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [highScore, setHighScore] = useState<number>(0);

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');
        if (!isLogin) {
            router.push('/auth/not-authorized');
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const savedHighScore = localStorage.getItem('whackHighScore');
        if (savedHighScore) {
            setHighScore(Number(savedHighScore));
        }
    }, []);

    useEffect(() => {
        if (!gameActive) return;

        const moleTimer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * holes.length);
            setMoleIndex(randomIndex);
        }, 700);

        return () => clearInterval(moleTimer);
    }, [gameActive]);

    useEffect(() => {
        if (!gameActive) return;

        const countdown = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setGameActive(false);

                    toast.info('Waktu Habis!', { autoClose: 1500 });

                    if (score > highScore) {
                        localStorage.setItem('whackHighScore', score.toString());
                        setHighScore(score);
                        toast.success('New High Score!', { autoClose: 1500 });
                    }

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [gameActive, score, highScore]);

    const hitMole = (index: number) => {
        if (index === moleIndex && gameActive) {
            setScore((prev) => prev + 1);
            setMoleIndex(null);
        }
    };

    const startGame = () => {
        setScore(0);
        setTime(30);
        setGameActive(true);
        toast.info('Waktu dimulai! Kamu punya 30 detik!', { autoClose: 1500 });
    };

    const handleLogout = () => {
        localStorage.removeItem('isLogin'); 
        router.push('/auth/login');
    };

    if (!isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-gray-100">

            <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
                <h1 className="text-xl font-bold">🎮 Game Zone</h1>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 text-sm"
                >
                    Logout
                </button>
            </nav>

            <div className="flex flex-col items-center justify-center py-10 px-4">

                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">🐹 Tap The Mouse</h1>

                    <div className="flex justify-around text-lg font-semibold text-gray-700">
                        <div className="bg-blue-100 px-4 py-2 rounded-lg">
                            Score: <span className="text-blue-600">{score}</span>
                        </div>
                        <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                            Time: <span className="text-yellow-600">{time}s</span>
                        </div>
                    </div>

                    {/* High Score */}
                    <div className="text-sm text-gray-500">
                        🏆 High Score: <span className="font-bold text-green-600">{highScore}</span>
                    </div>

                    {/* Start Button */}
                    {!gameActive && (
                        <button
                            onClick={startGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg"
                        >
                            {time === 0 ? 'Play Again' : 'Start Game'}
                        </button>
                    )}
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {holes.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => hitMole(index)}
                            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl cursor-pointer shadow-inner transition-all duration-150 ${
                                moleIndex === index
                                    ? 'bg-green-400 scale-105'
                                    : 'bg-amber-800'
                            }`}
                        >
                            {moleIndex === index && (
                                <span>🐹</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={1500}
                closeOnClick
                pauseOnHover
                draggable
                closeButton
            />
        </div>
    );
};

export default HomePage;