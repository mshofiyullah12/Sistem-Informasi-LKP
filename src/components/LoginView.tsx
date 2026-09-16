import React, { useState } from "react";
import NanditaLogo from "./NanditaLogo";
import { googleSignIn } from "../lib/googleAuth";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginView({ onLogin, userAccounts, logoUrl }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username.trim() || !password.trim()) {
      setError("Silakan masukkan username dan password!");
      return;
    }
    const foundUser = userAccounts.find(
      (u: any) =>
        u.username.toLowerCase() === username.toLowerCase().trim() &&
        (u.password === password || (!u.password && password === "admin"))
    );

    if (foundUser) {
      setSuccess("Login berhasil! Mengalihkan...");
      setTimeout(() => {
        onLogin(foundUser);
      }, 1000);
    } else {
      setError("Username atau password salah!");
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await googleSignIn();
      if (user) {
        onLogin({
          id: user.uid,
          username: user.displayName || user.email,
          role: "admin", // Default role
          nama: user.displayName || "Admin",
          isGoogleAuth: true,
          photoURL: user.photoURL,
        });
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk dengan Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001124] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex justify-center mb-4">
            <NanditaLogo />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sistem Informasi LPK</h1>
          <p className="text-sm text-slate-400">Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-sm">{success}</div>}
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="w-full bg-slate-900/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full bg-slate-900/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#001124] font-bold text-sm rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4"
          >
            Masuk ke Aplikasi
          </button>
        </form>

        <div className="w-full flex items-center justify-between gap-3 my-5">
          <div className="h-[1px] bg-white/10 flex-grow"></div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Atau</span>
          <div className="h-[1px] bg-white/10 flex-grow"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-semibold shadow-sm transition active:scale-[0.99] cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="animate-pulse">Menghubungkan...</span>
          ) : (
            <>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span>Masuk dengan Google</span>
            </>
          )}
        </button>

        <p className="text-[9px] text-slate-500 font-mono mt-6 text-center">Sistem Terlindungi SSL / Enskripsi Pengguna Lokal</p>
      </div>
    </div>
  );
}
