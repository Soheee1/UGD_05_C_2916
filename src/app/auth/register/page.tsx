'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthFormWrapper from '../../components/AuthFormWrapper';
import SocialAuth from '../../components/SocialAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';

type RegisterFormData = {
  username: string;
  email: string;
  nomorHp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const DEFAULT_CAPTCHA = 'AbCdEf';

const RegisterPage = () => {
  const router = useRouter();
  const {register,handleSubmit,watch,formState: { errors }, reset} = useForm<RegisterFormData>();
  const [captchaInput, setCaptchaInput] = useState('');

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok', { theme: 'dark' });
      return;
    }

    if (data.captcha !== DEFAULT_CAPTCHA) {
      toast.error('Captcha salah', { theme: 'dark' });
      return;
    }

    toast.success('Register Berhasil!', { theme: 'dark', position: 'top-right' });
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
            {...register('username', { required: 'Username wajib diisi' })}
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
            {...register('email', { required: 'Email wajib diisi' })}
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
            {...register('nomorHp', { required: 'Nomor telepon wajib diisi' })}
            onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g,'');
            }}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorHp ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorHp && <p className="text-red-600 text-sm italic">{errors.nomorHp.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor= "password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            id= "password"
            type="password"
            {...register('password', { required: 'Password wajib diisi' })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan password"
          />
          {errors.password && <p className="text-red-600 text-sm italic">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {required: 'Konfirmasi password wajib diisi'})}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan ulang password"
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm italic">{errors.confirmPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">{DEFAULT_CAPTCHA}</span>
          </div>
          <input
            type="text"
            {...register('captcha')}
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            placeholder="Masukkan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic">{errors.captcha.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg">
          Register
        </button>

        <SocialAuth />
      </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '} <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold"></Link>
            Login
        </p>
    </AuthFormWrapper>
  );
};

export default RegisterPage;