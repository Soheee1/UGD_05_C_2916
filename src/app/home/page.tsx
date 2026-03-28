'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type GameView = 'menu' | 'whackamole' | 'catchpet';
type Difficulty = 'easy' | 'medium' | 'hard';


const WHACK_CONFIG = {
    easy:   { moleSpeed: 1200, timeLimit: 45, label: '🟢 Easy' },
    medium: { moleSpeed: 700,  timeLimit: 30, label: '🟡 Medium' },
    hard:   { moleSpeed: 400,  timeLimit: 20, label: '🔴 Hard' },
};

const CATCH_CONFIG = {
    easy:   { catSpeed: 2000, timeLimit: 45, label: '🟢 Easy' },
    medium: { catSpeed: 1200, timeLimit: 30, label: '🟡 Medium' },
    hard:   { catSpeed: 600,  timeLimit: 20, label: '🔴 Hard' },
};


const DifficultySelector = ({
    difficulty,
    onChange,
}: {
    difficulty: Difficulty;
    onChange: (d: Difficulty) => void;
}) => {
    const options: { value: Difficulty; label: string; color: string }[] = [
        { value: 'easy',   label: '🟢 Easy',   color: 'border-green-400 bg-green-50 text-green-700' },
        { value: 'medium', label: '🟡 Medium', color: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
        { value: 'hard',   label: '🔴 Hard',   color: 'border-red-400 bg-red-50 text-red-700' },
    ];

    return (
        <div className="flex gap-3 justify-center flex-wrap">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`px-5 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                        difficulty === opt.value
                            ? `${opt.color} scale-105 shadow-md`
                            : 'border-gray-200 bg-white text-gray-500 hover:scale-105'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};


const WhackAMole = ({ onBack }: { onBack: () => void }) => {
    const holes = Array.from({ length: 9 });
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [moleIndex, setMoleIndex] = useState<number | null>(null);
    const [score, setScore] = useState<number>(0);
    const [time, setTime] = useState<number>(WHACK_CONFIG.medium.timeLimit);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
        easy: 0, medium: 0, hard: 0,
    });

    useEffect(() => {
        setHighScores({
            easy:   Number(localStorage.getItem('whackHighScore_easy')   || 0),
            medium: Number(localStorage.getItem('whackHighScore_medium') || 0),
            hard:   Number(localStorage.getItem('whackHighScore_hard')   || 0),
        });
    }, []);

    useEffect(() => {
        if (!gameActive) {
            setTime(WHACK_CONFIG[difficulty].timeLimit);
        }
    }, [difficulty, gameActive]);

    useEffect(() => {
        if (!gameActive) return;
        const moleTimer = setInterval(() => {
            setMoleIndex(Math.floor(Math.random() * holes.length));
        }, WHACK_CONFIG[difficulty].moleSpeed);
        return () => clearInterval(moleTimer);
    }, [gameActive, difficulty]);

    useEffect(() => {
        if (!gameActive) return;
        const countdown = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setGameActive(false);
                    setTimeout(() => {
                        toast.info('Waktu Habis!', { autoClose: 1500 });
                        setHighScores((prevHS) => {
                            if (score > prevHS[difficulty]) {
                                localStorage.setItem(`whackHighScore_${difficulty}`, score.toString());
                                toast.success('🏆 New High Score!', { autoClose: 1500 });
                                return { ...prevHS, [difficulty]: score };
                            }
                            return prevHS;
                        });
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(countdown);
    }, [gameActive, score, difficulty]);

    const hitMole = (index: number) => {
        if (index === moleIndex && gameActive) {
            setScore((prev) => prev + 1);
            setMoleIndex(null);
        }
    };

    const startGame = () => {
        setScore(0);
        setTime(WHACK_CONFIG[difficulty].timeLimit);
        setGameActive(true);
        setTimeout(() => {
            toast.info(`${WHACK_CONFIG[difficulty].label} - Game dimulai!`, { autoClose: 1500 });
        }, 0);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-between w-full max-w-2xl">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                    ← Back to Menu
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🐹 Whack a Mole</h1>
                <div className="w-24" />
            </div>

            {!gameActive && (
                <div className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-2xl space-y-3">
                    <p className="text-center text-sm font-semibold text-gray-600">Select Difficulty</p>
                    <DifficultySelector difficulty={difficulty} onChange={(d) => {
                        setDifficulty(d);
                    }} />

                    <div className="flex justify-around text-xs text-gray-400 pt-1">
                        <span>⚡ Mole Speed: {WHACK_CONFIG[difficulty].moleSpeed}ms</span>
                        <span>⏱ Time: {WHACK_CONFIG[difficulty].timeLimit}s</span>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
                <div className="flex flex-wrap justify-around gap-4 text-center">
                    <div className="bg-blue-50 px-6 py-3 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Score</p>
                        <p className="text-2xl font-bold text-blue-600">{score}</p>
                    </div>
                    <div className="bg-yellow-50 px-6 py-3 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Time</p>
                        <p className="text-2xl font-bold text-yellow-600">{time}s</p>
                    </div>
                    <div className="bg-green-50 px-6 py-3 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Best ({difficulty})</p>
                        <p className="text-2xl font-bold text-green-600">{highScores[difficulty]}</p>
                    </div>
                </div>

                {!gameActive && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={startGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl text-lg transition-all"
                        >
                            {time === 0 ? '🔄 Play Again' : '▶ Start Game'}
                        </button>
                    </div>
                )}

                {gameActive && (
                    <div className="mt-3 text-center">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {WHACK_CONFIG[difficulty].label}
                        </span>
                    </div>
                )}
            </div>

            {!gameActive && (
                <div className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-2xl">
                    <p className="text-center text-sm font-semibold text-gray-600 mb-3">🏆 Best Scores</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-green-50 rounded-xl p-3">
                            <p className="text-xs text-green-600 font-medium">Easy</p>
                            <p className="text-xl font-bold text-green-700">{highScores.easy}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-3">
                            <p className="text-xs text-yellow-600 font-medium">Medium</p>
                            <p className="text-xl font-bold text-yellow-700">{highScores.medium}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-3">
                            <p className="text-xs text-red-600 font-medium">Hard</p>
                            <p className="text-xl font-bold text-red-700">{highScores.hard}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 md:gap-5 w-full max-w-2xl">
                {holes.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => hitMole(index)}
                        className={`aspect-square rounded-full flex items-center justify-center text-3xl md:text-5xl cursor-pointer shadow-inner transition-all duration-150 select-none ${
                            moleIndex === index
                                ? 'bg-green-400 scale-105 shadow-lg'
                                : 'bg-amber-800 hover:bg-amber-700'
                        }`}
                    >
                        {moleIndex === index && <span>🐹</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};


const GRID_SIZE = 15;
const CELL_SIZE = 36;
type Position = { x: number; y: number };

const CatchYourPet = ({ onBack }: { onBack: () => void }) => {
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [playerPos, setPlayerPos] = useState<Position>({ x: 2, y: 2 });
    const [catPos, setCatPos] = useState<Position>({ x: 10, y: 10 });
    const [score, setScore] = useState<number>(0);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [time, setTime] = useState<number>(CATCH_CONFIG.medium.timeLimit);
    const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
        easy: 0, medium: 0, hard: 0,
    });

    useEffect(() => {
        setHighScores({
            easy:   Number(localStorage.getItem('catchPetHighScore_easy')   || 0),
            medium: Number(localStorage.getItem('catchPetHighScore_medium') || 0),
            hard:   Number(localStorage.getItem('catchPetHighScore_hard')   || 0),
        });
    }, []);

    useEffect(() => {
        if (!gameActive) {
            setTime(CATCH_CONFIG[difficulty].timeLimit);
        }
    }, [difficulty, gameActive]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!gameActive) return;
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) e.preventDefault();
        setPlayerPos((prev) => {
            const next = { ...prev };
            if (e.key === 'w' || e.key === 'W') next.y = Math.max(0, prev.y - 1);
            if (e.key === 's' || e.key === 'S') next.y = Math.min(GRID_SIZE - 1, prev.y + 1);
            if (e.key === 'a' || e.key === 'A') next.x = Math.max(0, prev.x - 1);
            if (e.key === 'd' || e.key === 'D') next.x = Math.min(GRID_SIZE - 1, prev.x + 1);
            return next;
        });
    }, [gameActive]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (!gameActive) return;
        if (playerPos.x === catPos.x && playerPos.y === catPos.y) {
            setScore((prev) => prev + 1);
            setCatPos({
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            });
            setTimeout(() => {
                toast.success('🎉 Got it!', { autoClose: 800 });
            }, 0);
        }
    }, [playerPos, gameActive]);

    useEffect(() => {
        if (!gameActive) return;
        const catTimer = setInterval(() => {
            setCatPos({
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            });
        }, CATCH_CONFIG[difficulty].catSpeed);
        return () => clearInterval(catTimer);
    }, [gameActive, difficulty]);

    useEffect(() => {
        if (!gameActive) return;
        const countdown = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setGameActive(false);
                    setTimeout(() => {
                        toast.info('Waktu Habis!', { autoClose: 1500 });
                        setHighScores((prevHS) => {
                            if (score > prevHS[difficulty]) {
                                localStorage.setItem(`catchPetHighScore_${difficulty}`, score.toString());
                                toast.success('🏆 New High Score!', { autoClose: 1500 });
                                return { ...prevHS, [difficulty]: score };
                            }
                            return prevHS;
                        });
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(countdown);
    }, [gameActive, score, difficulty]);

    const startGame = () => {
        setScore(0);
        setTime(CATCH_CONFIG[difficulty].timeLimit);
        setPlayerPos({ x: 2, y: 2 });
        setCatPos({ x: 10, y: 10 });
        setGameActive(true);
        setTimeout(() => {
            toast.info(`${CATCH_CONFIG[difficulty].label} - Kejar kucingnya! Gunakan WASD!`, { autoClose: 1500 });
        }, 0);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-between w-full max-w-2xl">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                    ← Back to Menu
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🐱 Catch Your Pet</h1>
                <div className="w-24" />
            </div>

            {!gameActive && (
                <div className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-2xl space-y-3">
                    <p className="text-center text-sm font-semibold text-gray-600">Select Difficulty</p>
                    <DifficultySelector difficulty={difficulty} onChange={(d) => {
                        setDifficulty(d);
                    }} />

                    <div className="flex justify-around text-xs text-gray-400 pt-1">
                        <span>🐱 Cat Speed: {CATCH_CONFIG[difficulty].catSpeed}ms</span>
                        <span>⏱ Time: {CATCH_CONFIG[difficulty].timeLimit}s</span>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
                <div className="flex flex-wrap justify-around gap-4 text-center">
                    <div className="bg-purple-50 px-6 py-3 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Caught</p>
                        <p className="text-2xl font-bold text-purple-600">{score}</p>
                    </div>
                    <div className="bg-yellow-50 px-6 py-3 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Time</p>
                        <p className="text-2xl font-bold text-yellow-600">{time}s</p>
                    </div>
                    <div className="bg-green-50 px-6 py-3 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Best ({difficulty})</p>
                        <p className="text-2xl font-bold text-green-600">{highScores[difficulty]}</p>
                    </div>
                </div>

                {/* WASD hint */}
                {gameActive && (
                    <div className="mt-4 flex justify-center gap-2 text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-1 rounded font-mono">W</span>
                        <span className="bg-gray-100 px-2 py-1 rounded font-mono">A</span>
                        <span className="bg-gray-100 px-2 py-1 rounded font-mono">S</span>
                        <span className="bg-gray-100 px-2 py-1 rounded font-mono">D</span>
                        <span className="ml-1">to move your character</span>
                    </div>
                )}

                {gameActive && (
                    <div className="mt-3 text-center">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {CATCH_CONFIG[difficulty].label}
                        </span>
                    </div>
                )}

                {!gameActive && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={startGame}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-10 py-3 rounded-xl text-lg transition-all"
                        >
                            {time === 0 ? '🔄 Play Again' : '▶ Start Game'}
                        </button>
                    </div>
                )}
            </div>

            {!gameActive && (
                <div className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-2xl">
                    <p className="text-center text-sm font-semibold text-gray-600 mb-3">🏆 Best Scores</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-green-50 rounded-xl p-3">
                            <p className="text-xs text-green-600 font-medium">Easy</p>
                            <p className="text-xl font-bold text-green-700">{highScores.easy}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-3">
                            <p className="text-xs text-yellow-600 font-medium">Medium</p>
                            <p className="text-xl font-bold text-yellow-700">{highScores.medium}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-3">
                            <p className="text-xs text-red-600 font-medium">Hard</p>
                            <p className="text-xl font-bold text-red-700">{highScores.hard}</p>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="bg-green-100 border-4 border-green-300 rounded-xl overflow-hidden shadow-lg"
                style={{
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE,
                    position: 'relative',
                    maxWidth: '100%',
                }}
            >
                <div
                    className="absolute flex items-center justify-center text-2xl transition-all duration-100"
                    style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        left: playerPos.x * CELL_SIZE,
                        top: playerPos.y * CELL_SIZE,
                    }}
                >
                    🧍
                </div>

                <div
                    className="absolute flex items-center justify-center text-2xl transition-all duration-300"
                    style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        left: catPos.x * CELL_SIZE,
                        top: catPos.y * CELL_SIZE,
                    }}
                >
                    🐱
                </div>
            </div>

            <p className="text-xs text-gray-400">
                You: 🧍 &nbsp;|&nbsp; Cat: 🐱 &nbsp;|&nbsp; Move with{' '}
                <span className="font-mono font-bold">WASD</span>
            </p>
        </div>
    );
};


const HomePage = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentGame, setCurrentGame] = useState<GameView>('menu');

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');
        if (!isLogin) {
            router.push('/auth/not-authorized');
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLogin');
        router.push('/auth/login');
    };

    if (!isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">🎮 Game Zone</span>
                    {currentGame !== 'menu' && (
                        <span className="text-blue-200 text-sm hidden md:inline">
                            / {currentGame === 'whackamole' ? 'Whack a Mole' : 'Catch Your Pet'}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 text-sm"
                >
                    Logout
                </button>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-10">

                {currentGame === 'menu' && (
                    <div className="flex flex-col items-center gap-8">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Choose Your Game
                            </h1>
                            <p className="text-gray-500 mt-2">Pick one to start playing!</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <button
                                onClick={() => setCurrentGame('whackamole')}
                                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-blue-400 cursor-pointer"
                            >
                                <div className="text-6xl mb-4">🐹</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Whack a Mole</h2>
                                <p className="text-gray-500 text-sm mb-3">
                                    Tap the mole as fast as you can before time runs out!
                                </p>
                                <div className="flex justify-center gap-2 text-xs mb-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">🟢 Easy</span>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🟡 Medium</span>
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">🔴 Hard</span>
                                </div>
                                <div className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl inline-block">
                                    Play Now →
                                </div>
                            </button>

                            <button
                                onClick={() => setCurrentGame('catchpet')}
                                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-purple-400 cursor-pointer"
                            >
                                <div className="text-6xl mb-4">🐱</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Catch Your Pet</h2>
                                <p className="text-gray-500 text-sm mb-3">
                                    Chase your cat around the field using WASD keys!
                                </p>
                                <div className="flex justify-center gap-2 text-xs mb-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">🟢 Easy</span>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🟡 Medium</span>
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">🔴 Hard</span>
                                </div>
                                <div className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-xl inline-block">
                                    Play Now →
                                </div>
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
                            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">🏆 Your Best Scores</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-600 text-center">🐹 Whack a Mole</p>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                            <div key={d} className={`rounded-xl p-2 ${
                                                d === 'easy' ? 'bg-green-50' :
                                                d === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
                                            }`}>
                                                <p className={`text-xs font-medium capitalize ${
                                                    d === 'easy' ? 'text-green-600' :
                                                    d === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                                }`}>{d}</p>
                                                <p className={`text-lg font-bold ${
                                                    d === 'easy' ? 'text-green-700' :
                                                    d === 'medium' ? 'text-yellow-700' : 'text-red-700'
                                                }`}>
                                                    {localStorage.getItem(`whackHighScore_${d}`) || '0'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-600 text-center">🐱 Catch Your Pet</p>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                            <div key={d} className={`rounded-xl p-2 ${
                                                d === 'easy' ? 'bg-green-50' :
                                                d === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
                                            }`}>
                                                <p className={`text-xs font-medium capitalize ${
                                                    d === 'easy' ? 'text-green-600' :
                                                    d === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                                }`}>{d}</p>
                                                <p className={`text-lg font-bold ${
                                                    d === 'easy' ? 'text-green-700' :
                                                    d === 'medium' ? 'text-yellow-700' : 'text-red-700'
                                                }`}>
                                                    {localStorage.getItem(`catchPetHighScore_${d}`) || '0'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentGame === 'whackamole' && (
                    <WhackAMole onBack={() => setCurrentGame('menu')} />
                )}

                {currentGame === 'catchpet' && (
                    <CatchYourPet onBack={() => setCurrentGame('menu')} />
                )}
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