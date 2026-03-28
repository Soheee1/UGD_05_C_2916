    'use client';

    import { useEffect, useState } from 'react';
    import { useRouter } from 'next/navigation';
    import AuthFormWrapper from '../../components/AuthFormWrapper';
    import SocialAuth from '../../components/SocialAuth';
    import Link from 'next/link';
    import { toast } from 'react-toastify';

    interface LoginFormData {
        email: string;
        password: string;
        captchaInput: string;
        rememberMe?: boolean;
    }

    interface ErrorObject {
        email?: string;
        password?: string;
        captcha?: string;
    }

    const VALID_EMAIL = '2916@gmail.com';
    const VALID_PASS = '241712916';
    
    const LoginPage = () => {
        const router = useRouter();
        const [formData, setFormData] = useState<LoginFormData>({
            email: '',
            password: '',
            captchaInput: '',
            });
        const [errors, setErrors] = useState<ErrorObject>({});
        const [attempts, setAttempts] = useState<number>(3);
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|co)$/;

        const [captcha, setCaptcha] = useState(' ');

        const generateCaptcha = () => {
            const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        };  

        useEffect (() => {
            setCaptcha(generateCaptcha());
        }, []);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: undefined }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const newErrors: ErrorObject = {}
            if (!formData.email.trim()) {
                newErrors.email = 'Email tidak boleh kosong';
            } else if (!emailPattern.test(formData.email)) {
                newErrors.email = 'Format email tidak valid (harus xxyxx@gmail.com/.net/.co)';
            } else if (formData.email !== VALID_EMAIL) {
                newErrors.email = 'Email tidak tercatat dalam database mas';
            }

            if (!formData.password.trim()) {
                newErrors.password = 'Password tidak boleh kosong';
            } else if (formData.password !== VALID_PASS) {
                newErrors.password = 'Password salah mas';
            }

            if (!formData.captchaInput.trim()) {
                newErrors.captcha = 'Captcha belum diisi';
            } else if (formData.captchaInput !== captcha) {
                newErrors.captcha = 'Captcha salah';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                
                const remaining = Math.max(attempts -1,0);
                setAttempts(remaining);

                if(remaining === 0) {
                    toast.error('Login gagal! Kesempatan login habis.', { theme: 'dark', position: 'top-right' })
                } else {
                    toast.error(`Login gagal! Sisa kesempatan ${remaining}`, { theme: 'dark', position: 'top-right' })
                }
                return;
            }

            localStorage.setItem('isLogin', 'true');
            toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
            router.push('/home');
        };

        const handleReset = () => {
            setAttempts(3);
        };

        return (
            <AuthFormWrapper title="Login">
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            value={formData.email}  
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan email"
                        />
                        {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Masukkan password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-sharp fa-solid fa-eye-slash"></i>}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe || false}
                                onChange={(e) =>
                                    setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))
                                }
                                className="mr-2 h-4 w-4 rounded border-gray-300"
                            />
                            Ingat Saya
                        </label>
                        <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Captcha:</span>
                            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
                                {captcha}
                            </span>

                            <button
                                type='button'
                                onClick={() => setCaptcha(generateCaptcha())}
                                className='text-blue-600 text-sm'
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                        </div>
                        <input
                            type="text"
                            name="captchaInput"
                            value={formData.captchaInput}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan captcha"
                        />

                        {errors.captcha && <p className="text-red-600 text-sm italic">{errors.captcha}</p>}
                    </div>

                    <div className='space-y-2'>
                        <div className="flex items-center space-x-3">
                            <p className='text-sm font-medium text-gray-700'>Sisa Kesempatan:{' '}
                                <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
                                    {attempts}
                                </span>
                            </p>
                            <button 
                                type='button'
                                onClick={handleReset}
                                disabled={attempts !== 0}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white ${attempts === 0 ? 'bg-green-500 hover:bg-green-600 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>  
                        </div>
                    </div>
                    <div className='flex flex-col items-center space-y-4'>
                        <button
                            type="submit"
                            disabled={attempts === 0}
                            className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white ${attempts === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Sign In
                        </button>

                        <SocialAuth />

                        <p className="mt-6 ext-center text-sm text-gray-600">
                            Tidak punya akun?{' '}
                            <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Daftar
                            </Link>
                        </p>
                    </div>
                    </form>
            </AuthFormWrapper>
        );
    };
    
export default LoginPage;