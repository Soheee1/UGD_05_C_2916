    'use client';

    import { useState } from 'react';
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

    const DEFAULT_CAPTCHA = 'AbCdEf';

    const LoginPage = () => {
        const router = useRouter();
        const [formData, setFormData] = useState<LoginFormData>({
            email: '',
            password: '',
            captchaInput: '',
            });
        const [errors, setErrors] = useState<ErrorObject>({});

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: undefined }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const newErrors: ErrorObject = {}
            if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
            if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
            if (!formData.captchaInput.trim()) {
                newErrors.captcha = 'Captcha belum diisi';
            } else if (formData.captchaInput !== DEFAULT_CAPTCHA) {
                newErrors.captcha = 'Captcha salah';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                toast.error('Login Gagal', { theme: 'dark', position: 'top-right' });
                return;
            }

            toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
            router.push('/home');
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
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan password"
                        />
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
                                {DEFAULT_CAPTCHA}
                            </span>
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

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg"
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
                </form>
            </AuthFormWrapper>
        );
    };

    export default LoginPage;