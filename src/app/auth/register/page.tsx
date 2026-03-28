'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthFormWrapper from '../../components/AuthFormWrapper';
import SocialAuth from '../../components/SocialAuth';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

type RegisterFormData = {
    username: string;
    email: string;
    nomorHp: string;
    password: string;
    confirmPassword: string;
    captcha: string;
};


const RegisterPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterFormData>();

    const generateCaptcha = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    };

    const [captcha, setCaptcha] = useState<string>(() => generateCaptcha());

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [strength, setStrength] = useState<number>(0);

    const password = watch('password', '');
    const confirmPassword = watch('confirmPassword', '');

    useEffect(() => {
      let score = 0;

      if (!password) {
        setStrength(0);
        return;
      }

      if (password.length >= 8) score += 25;
      if (/[A-Z]/.test(password)) score += 25;
      if (/[0-9]/.test(password)) score += 25;
      if (/[^A-Za-z0-9]/.test(password)) score += 25;

      setStrength(score);
    }, [password]);
    
    const getStrengthLabel = () => {
      if (strength <= 25) return 'Weak';
      if (strength <= 50) return 'Fair';
      if (strength <= 75) return 'Good';
      return 'Strong';
    };

    const onSubmit = (data: RegisterFormData) => {
        toast.success('Register Berhasil Le!', { theme: 'dark', position: 'top-right' });
        router.push('/auth/login');
    };

    return (
        <AuthFormWrapper title="Register">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username <span className="text-gray-500 text-xs">(max 8 karakter)</span>
                    </label>
                    <input
                        id="username"
                        {...register('username', {
                            required: 'Username wajib diisi',
                            minLength: { value: 3, message: 'Username minimal memiliki 3 karakter le' },
                            maxLength: { value: 8, message: 'Username maksimal memiliki 8 karakter le' },
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan username"
                    />
                    {errors.username && <p className="text-red-600 text-sm italic">{errors.username.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', {
                            required: 'Email wajib diisi',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.(com|net|co)$/,
                                message: 'Email tidak valid mase (harus ada @ dan .com/.net/.co)',
                            },
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="nomorHp" className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        id="nomorHp"
                        type="tel"
                        {...register('nomorHp', {
                            required: 'Nomor telepon ngga boleh kosong',
                            minLength: { value: 10, message: 'Nomor telepon minimal punya 10 karakter' },
                            pattern: {
                                value: /^\d+$/,
                                message: 'Nomor telepon hanya boleh angka',
                            },
                        })}
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorHp ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan nomor telepon"
                    />
                    {errors.nomorHp && <p className="text-red-600 text-sm italic">{errors.nomorHp.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Password wajib diisi',
                                minLength: { value: 8, message: 'Password minimal memiliki 8 karakter le' },
                            })}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-8 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-sharp fa-solid fa-eye-slash"></i>}
                        </button>

                        <div className="mt-2">
                          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-yellow-500' : strength <= 75 ? 'bg-blue-500': 'bg-green-500'}`}
                              style={{ width: `${strength}%` }}
                            />
                          </div>

                          <p className="text-sm mt-1 text-gray-600">
                            Strength: {strength}% ({getStrengthLabel()})
                          </p>
                        </div>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm italic">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword', {
                                required: 'Konfirmasi password wajib diisi',
                                validate: (value) =>
                                    value === watch('password') || 'Konfirmasi password tidak cocok',
                            })}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan ulang password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-sharp fa-solid fa-eye-slash"></i>}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-sm italic">{errors.confirmPassword.message}</p>}
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
                        {...register('captcha', {
                            required: 'Captcha belum diisi le',
                            validate: (value) => value === captcha || 'Captcha Salah',
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan captcha"
                    />
                    {errors.captcha && <p className="text-red-600 text-sm italic">{errors.captcha.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg"
                >
                    Register
                </button>

                <SocialAuth />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Login
                    </Link>
                </p>
            </form>
        </AuthFormWrapper>
    );
};

export default RegisterPage;