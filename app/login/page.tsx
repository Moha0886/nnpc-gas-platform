"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_USERS, getBUDisplayName, getRoleDisplayName } from "@/lib/auth-types";
import { Lock, Loader2, MapPin, Users, Activity, Eye, EyeOff, Building2, Shield, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [showUserSelector, setShowUserSelector] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setIsLoggingIn(true);

    try {
      // In development, try to match email to mock users
      const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (matchedUser) {
        await login(matchedUser.email);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid email address. Please try again.");
      setIsLoggingIn(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setError("");
    setIsLoggingIn(true);
    setShowUserSelector(false);

    try {
      await login(userEmail);
    } catch (err) {
      setError("Login failed. Please try again.");
      setIsLoggingIn(false);
    }
  };

  // Group users by Business Unit
  const usersByBU = {
    NGIC: MOCK_USERS.filter(u => u.businessUnit === "NGIC"),
    NGML: MOCK_USERS.filter(u => u.businessUnit === "NGML"),
    NGPIS: MOCK_USERS.filter(u => u.businessUnit === "NGPIS"),
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1B5E3E] via-[#1B5E3E] to-[#2B5F75] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Image
              src="/nnpc-logo.png"
              alt="NNPC Logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">NNPC Gas Platform</h1>
              <p className="text-sm text-white/80">Performance Command Center</p>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Integrated Gas Operations
              <br />
              <span className="text-[#F9A825]">Management System</span>
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-md">
              Secure operations platform for Nigerian National Petroleum Company Limited gas infrastructure management.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <MapPin className="w-8 h-8 mb-2 text-white/90" />
                <div className="text-3xl font-bold mb-1">4</div>
                <div className="text-sm text-white/80">Corridors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Users className="w-8 h-8 mb-2 text-white/90" />
                <div className="text-3xl font-bold mb-1">3</div>
                <div className="text-sm text-white/80">Business Units</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Activity className="w-8 h-8 mb-2 text-white/90" />
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-white/80">Operations</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-sm text-white/70">
              Nigerian National Petroleum Company Limited
              <br />
              Federal Republic of Nigeria
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image
              src="/nnpc-logo.png"
              alt="NNPC Logo"
              width={40}
              height={40}
            />
            <div>
              <h1 className="text-xl font-bold text-ink">NNPC Gas Platform</h1>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-line p-8">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#1B5E3E]/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#1B5E3E]" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-ink text-center mb-2">Welcome Back</h2>
            <p className="text-ink/60 text-center mb-8">Sign in to access the command center</p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink/80 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nnpc.com"
                  className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-transparent transition-all"
                  disabled={isLoggingIn}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-transparent transition-all"
                    disabled={isLoggingIn}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Development Mode - Quick User Switch */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setShowUserSelector(!showUserSelector)}
                  className="text-sm text-[#2B5F75] hover:text-[#2B5F75]/80 font-medium flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Development: Switch User
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-alert/10 border border-alert/30 rounded-lg">
                  <p className="text-sm text-alert">{error}</p>
                </div>
              )}

              {/* User Selector */}
              {showUserSelector && (
                <div className="border border-line rounded-lg overflow-hidden">
                  <div className="bg-[#1B5E3E]/5 px-4 py-2 border-b border-line">
                    <p className="text-sm font-medium text-ink">Select User Profile</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {Object.entries(usersByBU).map(([bu, users]) => (
                      <div key={bu}>
                        {users.length > 0 && (
                          <>
                            <div className="px-4 py-2 bg-gray-50 border-b border-line">
                              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
                                {getBUDisplayName(bu as any)}
                              </p>
                            </div>
                            {users.map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleQuickLogin(user.email)}
                                disabled={isLoggingIn}
                                className="w-full px-4 py-3 text-left hover:bg-[#1B5E3E]/5 transition-colors border-b border-line last:border-b-0 disabled:opacity-50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B5E3E] to-[#2B5F75] flex items-center justify-center text-white font-bold text-sm">
                                      {user.name.charAt(0)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-ink text-sm truncate">{user.name}</p>
                                    <p className="text-xs text-ink/60 truncate">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="inline-flex items-center gap-1 text-xs bg-[#1B5E3E]/10 text-[#1B5E3E] px-2 py-0.5 rounded">
                                        <Shield className="w-3 h-3" />
                                        {getRoleDisplayName(user.role)}
                                      </span>
                                      {user.department && (
                                        <span className="text-xs text-ink/50">
                                          {user.department}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-ink/30 flex-shrink-0" />
                                </div>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#1B5E3E] text-white font-semibold rounded-lg hover:bg-[#1B5E3E]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer Notice */}
          <p className="text-center text-ink/50 text-xs mt-6">
            Secure Government System • Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
}
