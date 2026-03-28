'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NotAuthorizedPage = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState<number>(30);

    // ✅ Countdown timer that updates every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push('/auth/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-400 px-4">
            {/* ✅ Landscape container - side by side */}
            <div className="bg-white rounded-2xl shadow-xl flex flex-row overflow-hidden w-full max-w-2xl">

                {/* Left side - Picture */}
                <div className="w-1/2 bg-blue-100 flex items-center justify-center">
                    <img
                        src="/images/ketika Bpk prabowo sadar telah dicurangi 2 periode oleh ijazah palsu.jpg"
                        alt="Not Authorized"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>

                <div className="w-1/2 p-8 flex flex-col items-center justify-center space-y-4 text-center">
                    <p className="text-5xl">❌</p>
                    <h1 className="text-xl font-bold text-gray-800">Anda belum login WOK</h1>
                    <p className="text-sm text-gray-500">Silakan login terlebih dahulu Wok.</p>

                    <p className="text-xs text-gray-400">
                        Otomatis kembali dalam{' '}
                        <span className="font-bold text-blue-600">{countdown}</span>
                        {' '}detik...
                    </p>

                    <button
                        onClick={() => router.push('/auth/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg w-full"
                    >
                        ← Kembali
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotAuthorizedPage;
