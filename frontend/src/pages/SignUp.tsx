import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Eye, EyeOff } from 'lucide-react';

interface SignupFormData {
    name: string;
    dateOfBirth: Date;
    email: string;
    otp?: string;
}

export default function Signup() {
    const [otpSent, setOtpSent] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<SignupFormData>();

    const onGetOtp = async () => {
        const email = watch('email');
        const name = watch('name');
        const dateOfBirth = watch('dateOfBirth');

        if (!email || !name || !dateOfBirth) {
            toast.error('Please fill all fields before requesting OTP.');
            return;
        }

        try {
            await authService.signup({
                name,
                email,
                dateOfBirth: dateOfBirth.toISOString().split('T')[0],
            });
            setOtpSent(true);
            toast.success('OTP sent to your email.');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to send OTP');
        }
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            const res = await authService.verifyOtp({
                email: data.email,
                otp: data.otp!,
            });
            localStorage.setItem('jwt_token', res.data.token);
            localStorage.setItem('user_email', res.data.email);
            localStorage.setItem('user_name', res.data.name);
            toast.success('Signup successful!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'OTP verification failed');
        }
    };

    const handleGoogleLogin = async (credential: string) => {
        try {
            const res = await authService.googleLogin({ token: credential });
            localStorage.setItem('jwt_token', res.data.token);
            localStorage.setItem('user_email', res.data.email);
            localStorage.setItem('user_name', res.data.name);
            toast.success('Logged in with Google!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Google login failed');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="p-6 flex justify-center md:justify-start items-center">
                <img src="/icon.png" alt="HD Logo" className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold tracking-wide">HD</span>
            </div>

            <div className="flex justify-center items-center px-4">
                <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl shadow overflow-hidden">
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-1 text-center md:text-left">
                            Sign up
                        </h2>
                        <p className="text-gray-400 mb-6 text-center md:text-left">
                            Sign up to enjoy the feature of HD
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name */}
                            <div className="relative">
                                <input
                                    {...register('name', { required: true })}
                                    type="text"
                                    placeholder=" "
                                    id="name"
                                    className="peer w-full border border-gray-300 px-4 pt-5 pb-2 rounded-lg text-sm focus:outline-blue-500"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                    Your Name
                                </label>
                                {errors.name && (
                                    <p className="text-sm text-red-500">Name is required</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="relative">
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <>
                                            <DatePicker
                                                selected={value}
                                                onChange={(date: Date | null) => onChange(date)}
                                                placeholderText=" "
                                                className="peer w-full h-[48px] px-4 pt-5 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-blue-500"
                                                dateFormat="yyyy-MM-dd"
                                                maxDate={new Date()}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                ref={ref}
                                            />
                                            <label
                                                htmlFor="dateOfBirth"
                                                className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-40 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                                            >
                                                Date of Birth
                                            </label>
                                        </>
                                    )}
                                />
                                {errors.dateOfBirth && (
                                    <p className="text-sm text-red-500">Date of Birth is required</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    {...register('email', {
                                        required: true,
                                        pattern: /^\S+@\S+\.\S+$/,
                                    })}
                                    type="email"
                                    placeholder=" "
                                    id="email"
                                    className="peer w-full border border-gray-300 px-4 pt-5 pb-2 rounded-lg text-sm focus:outline-blue-500"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-2 text-gray-400 text-xs transition-all  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                    Email
                                </label>
                                {errors.email && (
                                    <p className="text-sm text-red-500">Valid email required</p>
                                )}
                            </div>

                            {/* OTP */}
                            {otpSent && (
                                <div className="relative">
                                    <input
                                        {...register('otp', { required: true })}
                                        type={showOtp ? 'text' : 'password'}
                                        placeholder=" "
                                        id="otp"
                                        className="peer w-full border border-gray-300 px-4 pt-5 pb-2 rounded-lg text-sm focus:outline-blue-500"
                                    />
                                    <label
                                        htmlFor="otp"
                                        className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                                    >
                                        Enter OTP
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowOtp(!showOtp)}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                                    >
                                        {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    {errors.otp && (
                                        <p className="text-sm text-red-500">OTP is required</p>
                                    )}
                                </div>
                            )}

                            {/* OTP / Submit Button */}
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={onGetOtp}
                                    className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold"
                                >
                                    Get OTP
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold"
                                >
                                    Sign Up
                                </button>
                            )}

                            {/* Google Login */}
                            <div className="flex items-center justify-center mt-4">
                                <GoogleLogin
                                    onSuccess={(res) => handleGoogleLogin(res.credential!)}
                                    onError={() => toast.error('Google Login Failed')}
                                    shape="pill"
                                    text="signup_with"
                                    size="large"
                                    width="100%"
                                />
                            </div>

                            <p className="text-sm text-gray-500 text-center mt-4">
                                Already have an account?{' '}
                                <a
                                    href="/signin"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>
                    </div>

                    {/* Right-side Image */}
                    <div className="hidden md:block w-1/2">
                        <img
                            src="/signup-image.png"
                            alt="Signup visual"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
