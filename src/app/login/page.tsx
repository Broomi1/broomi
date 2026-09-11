"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Lock, Heart, EyeOff, Eye } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        loginType: "customer",
      });

      if (res?.error) {
        setError("Invalid username or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Sign up
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          await signIn("credentials", {
            redirect: false,
            username,
            password,
            loginType: "customer",
          });
          router.push("/dashboard");
        } else {
          setError(data.error || "Failed to create account");
          setLoading(false);
        }
      } catch (err) {
        setError("An error occurred");
        setLoading(false);
      }
    }
  };

  if (status === "loading") return null;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-[360px] bg-[#FAF3EF] shadow-2xl overflow-hidden rounded-t-[140px] rounded-b-[40px] border-4 border-white/40 backdrop-blur-sm relative">
        
        {/* Top Decorative Image / Polaroid */}
        <div className="pt-10 flex justify-center relative">
          <div className="relative rotate-[2deg] hover:rotate-0 transition-transform cursor-pointer">
            
            {/* The Little Red Heart Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-rose-400 drop-shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Back Polaroid (tilted right) */}
            <div className="absolute top-1 left-2 w-32 h-36 bg-white p-2 pb-6 rounded-sm shadow-md border border-stone-100 rotate-[8deg] z-0">
               <div className="w-full h-full bg-stone-100/50 rounded-sm"></div>
            </div>

            {/* Front Polaroid (tilted left) */}
            <div className="bg-white p-2 pb-8 rounded-sm shadow-lg border border-stone-100 relative z-10 rotate-[-4deg]">
              <div className="w-28 h-24 overflow-hidden rounded-sm relative">
                 <img 
                   src="/couple-polaroid.jpg" 
                   alt="Couple watching sunset" 
                   className="w-full h-full object-cover object-top"
                 />
              </div>
            </div>

            {/* Sketch marks around */}
            <div className="absolute -left-10 top-16 text-[#6D544F] font-[family-name:--font-caveat] text-3xl rotate-[-15deg] opacity-80">♡</div>
            <div className="absolute -right-12 top-14 text-[#6D544F] font-[family-name:--font-caveat] text-3xl rotate-[15deg] opacity-80">♡</div>
            
            {/* Little sketch lines */}
            <div className="absolute -left-6 top-10 w-2 h-[2px] bg-[#6D544F] rotate-45 opacity-60 rounded-full"></div>
            <div className="absolute -left-4 top-24 w-2 h-[2px] bg-[#6D544F] -rotate-12 opacity-60 rounded-full"></div>
            
            <div className="absolute -right-6 top-6 w-2 h-[2px] bg-[#6D544F] -rotate-45 opacity-60 rounded-full"></div>
            <div className="absolute -right-8 top-10 w-2 h-[2px] bg-[#6D544F] rotate-[20deg] opacity-60 rounded-full"></div>
          </div>
        </div>

        <div className="px-8 pt-6 pb-10">
          
          <div className="text-center mb-6">
            <h1 className="text-5xl text-[#4A2F2B] font-[family-name:--font-caveat] mb-2 leading-none flex items-center justify-center gap-2">
              MemoryTap
            </h1>
            <div className="text-[#8D6B63] text-sm mb-4">— ♡ —</div>
            <p className="text-[#6D544F] text-xs font-medium leading-relaxed tracking-wide">
              You've received a digital memory box.<br/>
              Sign in or create an account to curate<br/>
              your special moments.<br/>
              <span className="inline-block mt-2 font-[family-name:--font-caveat] text-lg">♡</span>
            </p>
          </div>

          <div className="bg-[#EFDDD7] rounded-full p-1.5 flex mb-8 relative shadow-inner">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#B67575] rounded-full transition-all duration-300 ease-out shadow-sm`}
              style={{ left: isLogin ? '6px' : 'calc(50%)' }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 z-10 transition-colors ${
                isLogin ? 'text-white' : 'text-[#6D544F] hover:text-[#4A2F2B]'
              }`}
            >
              <Heart size={14} className={isLogin ? "fill-current" : ""} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 z-10 transition-colors ${
                !isLogin ? 'text-white' : 'text-[#6D544F] hover:text-[#4A2F2B]'
              }`}
            >
              <User size={14} /> Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-xs rounded-xl text-center border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-[#4A2F2B] uppercase tracking-widest mb-1.5">
                <Heart size={10} className="fill-current" /> Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6B63]">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F5E6E0] border border-transparent focus:border-[#B67575] rounded-full py-3.5 pl-11 pr-4 text-sm text-[#4A2F2B] placeholder:text-[#A88880] focus:outline-none transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-[#4A2F2B] uppercase tracking-widest mb-1.5">
                <Heart size={10} className="fill-current" /> Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6B63]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5E6E0] border border-transparent focus:border-[#B67575] rounded-full py-3.5 pl-11 pr-11 text-sm text-[#4A2F2B] placeholder:text-[#A88880] focus:outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6B63] hover:text-[#4A2F2B] transition-colors"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A2F2B] hover:bg-[#3A221F] text-white rounded-full py-4 text-sm font-semibold mt-4 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
              {!loading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 font-[family-name:--font-caveat] text-2xl text-[#E6C6C1] rotate-[-10deg]">
                  ♡
                </div>
              )}
            </button>

            <div className="pt-6 text-center">
              <div className="flex items-center justify-center gap-4 text-xs text-[#8D6B63]">
                <div className="h-px bg-[#8D6B63]/20 flex-1"></div>
                <button type="button" className="hover:text-[#4A2F2B] transition-colors">
                  How does this work?
                </button>
                <div className="h-px bg-[#8D6B63]/20 flex-1"></div>
              </div>
              <div className="mt-2 text-[#8D6B63] font-[family-name:--font-caveat] text-lg">♡</div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
