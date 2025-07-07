import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

interface SigninFormData {
    email: string;
    otp?: string;
}

export default function Signin() {
    const [otpSent, setOtpSent] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SigninFormData>();

    const onGetOtp = async () => {
        const email = watch('email');
        if (!email) {
            toast.error('Enter your email');
            return;
        }

        try {
            await authService.signin({ email });
            setOtpSent(true);
            toast.success('OTP sent to your email');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Error sending OTP');
        }
    };

    const onSubmit = async (data: SigninFormData) => {
        try {
            const res = await authService.verifyOtp({
                email: data.email,
                otp: data.otp!,
            });
            localStorage.setItem('jwt_token', res.data.token);
            localStorage.setItem('user_email', res.data.email);
            localStorage.setItem('user_name', res.data.name);
            toast.success('Signed in successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Invalid OTP');
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
                            Sign in
                        </h2>
                        <p className="text-gray-400 mb-6 text-center md:text-left">
                            Please login to continue to your account.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                            {/* OTP - only if sent */}
                            {otpSent && (
                                <>
                                    <div className="relative">
                                        <input
                                            {...register('otp', { required: true })}
                                            type={showOtp ? 'text' : 'password'}
                                            placeholder=" "
                                            id="otp"
                                            className="peer w-full border border-gray-300 px-4 pt-5 pb-2 pr-10 rounded-lg text-sm focus:outline-blue-500"
                                        />
                                        <label
                                            htmlFor="otp"
                                            className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                                        >
                                            Enter OTP
                                        </label>
                                        {/* Show/Hide button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowOtp(!showOtp)}
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                                        >
                                            {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>

                                        {errors.otp && (
                                            <p className="text-sm text-red-500 mt-1">OTP is required</p>
                                        )}
                                    </div>

                                    {/* Resend OTP */}
                                    <p className="text-sm text-left mt-1">
                                        <button
                                            type="button"
                                            onClick={onGetOtp}
                                            className="text-[#367AFF] font-medium hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    </p>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="accent-blue-600"
                                        />
                                        <label className="text-sm text-gray-700">
                                            Keep me logged in
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* Buttons */}
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
                                    Sign in
                                </button>
                            )}

                            {/* Signup Link */}
                            <p className="text-sm text-gray-500 text-center mt-4">
                                Need an account?{' '}
                                <a
                                    href="/signup"
                                    className="text-[#367AFF] font-medium hover:underline"
                                >
                                    Create one
                                </a>
                            </p>
                        </form>
                    </div>

                    {/* Right Image */}
                    <div className="hidden md:block w-1/2">
                        <img
                            src="/signup-image.png"
                            alt="Signin visual"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
