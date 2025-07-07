import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

interface SignupFormData {
    name: string;
    dateOfBirth: string;
    email: string;
    otp?: string;
}

export default function Signup() {
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
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
            await authService.signup({ name, email, dateOfBirth });
            setOtpSent(true);
            toast.success('OTP sent to your email.');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to send OTP');
        }
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            const res = await authService.verifyOtp({ email: data.email, otp: data.otp! });
            localStorage.setItem('jwt_token', res.data.token);
            localStorage.setItem('user_email', res.data.email);
            localStorage.setItem('user_name', res.data.email);
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
            toast.success('Logged in with Google!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Google login failed');
        }
    };
        return (
        <div className="min-h-screen bg-white">
            {/* Top HD Header */}
            <div className="p-6 flex justify-center md:justify-start items-center">
                <img src="/icon.png" alt="HD Logo" className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold tracking-wide">HD</span>
            </div>

            {/* Centered Signup Card */}
            <div className="flex justify-center items-center px-4">
                <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl shadow overflow-hidden">
                    {/* Left: Form */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-1 text-center md:text-left">Sign up</h2>
                        <p className="text-gray-400 mb-6 text-center md:text-left">Sign up to enjoy the feature of HD</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input
                                {...register('name', { required: true })}
                                placeholder="Your Name"
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-blue-500"
                            />
                            {errors.name && <p className="text-sm text-red-500">Name is required</p>}

                            <input
                                {...register('dateOfBirth', { required: true })}
                                type="date"
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-blue-500"
                            />
                            {errors.dateOfBirth && <p className="text-sm text-red-500">Date of Birth is required</p>}

                            <input
                                {...register('email', {
                                    required: true,
                                    pattern: /^\S+@\S+\.\S+$/,
                                })}
                                placeholder="Email"
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-blue-500"
                            />
                            {errors.email && <p className="text-sm text-red-500">Valid email required</p>}

                            {otpSent && (
                                <>
                                    <input
                                        {...register('otp', { required: true })}
                                        placeholder="Enter OTP"
                                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-blue-500"
                                    />
                                    {errors.otp && <p className="text-sm text-red-500">OTP is required</p>}
                                </>
                            )}

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
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-semibold"
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
                                <a href="/signin" className="text-blue-600 font-medium hover:underline">Sign in</a>
                            </p>
                        </form>
                    </div>

                    {/* Right: Image */}
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
