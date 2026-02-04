import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff} from 'lucide-react'
import { login, register } from '../services/service'
import type { AxiosError } from 'axios'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const navigate=useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing
    if (authError) {
      setAuthError('')
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setAuthError('')
    
    // Check password length
    if (formData.password.length < 8) {
      return // Don't submit if password is too short
    }
    
    // Check if passwords match in signup mode
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return // Don't submit if passwords don't match
    }
    
    // Handle authentication logic here
    try{

        if(isLogin){
          
            const res=await login(formData.email,formData.password);
            localStorage.setItem("accessToken",res.accessToken);
            console.log("Login successful:", res);
            navigate("/landing");
        } else {
            await register(formData.name, formData.email, formData.password);
            console.log("Registration successful");
            setIsLogin(true);
        }
    }catch(error){
        // Set error message
        const axiosError = error as AxiosError<{ message: string }>;

        if (isLogin) {
          setAuthError(axiosError.response?.data?.message || "Invalid credentials");
        } else {
          setAuthError(axiosError.response?.data?.message || "Registration failed");
        }
        console.error("Authentication error:", error);
    }
    console.log('Form submitted:', formData)
  }

  // Check if passwords match
  const passwordsMatch = isLogin || formData.password === formData.confirmPassword
  const showPasswordError = !isLogin && formData.confirmPassword && !passwordsMatch
  
  // Check password length
  const passwordTooShort = formData.password.length > 0 && formData.password.length < 8
  const hasErrors = showPasswordError || passwordTooShort

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-400">
            {isLogin 
              ? 'Sign in to continue your learning journey' 
              : 'Start exchanging skills today'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-black rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true)
                setAuthError('')
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isLogin 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setAuthError('')
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                !isLogin 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-500 text-sm font-medium">{authError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-black border rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none transition-all ${
                    passwordTooShort
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                  }`}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordTooShort && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full bg-black border rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all ${
                      showPasswordError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                    }`}
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
                {showPasswordError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password (only for login) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-700 bg-black text-yellow-400 focus:ring-yellow-400 focus:ring-offset-black"
                  />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={hasErrors}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                hasErrors
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/50'
              }`}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to SkillSwap's{' '}
          <Link to="/terms" className="text-yellow-400 hover:text-yellow-500 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-yellow-400 hover:text-yellow-500 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Auth
