
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Mail, Lock, User, LogOut } from "lucide-react";

import { auth } from "./firebase/firebase";
import {
  signupWithEmail,
  loginWithEmail,
  signupWithGoogle,
  loginWithFacebook,
  logoutUser,
} from "./features/auth/authService";

import {
  setUser,
  setLoading,
  setError,
} from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state) => state.auth
  );

  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      if (isSignup) {
        await signupWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      dispatch(setError(err.message));
      dispatch(setLoading(false));
    }
  };

  const handleGoogle = async () => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      await signupWithGoogle();
    } catch (err) {
      dispatch(setError(err.message));
      dispatch(setLoading(false));
    }
  };

  const handleFacebook = async () => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      await loginWithFacebook();
    } catch (err) {
      dispatch(setError(err.message));
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    dispatch(setError(null));

    try {
      await logoutUser();
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse text-lg">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500 text-3xl font-bold">
            {(user.displayName || user.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold">
            Welcome!
          </h1>

          <p className="mt-3 text-slate-300">
            {user.displayName || "User"}
          </p>

          <p className="mt-1 break-all text-sm text-slate-400">
            {user.email}
          </p>

          <p className="mt-5 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">
            Authentication successful!
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>

          {error && (
            <p className="mt-4 break-words text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 text-3xl font-bold shadow-lg shadow-indigo-500/30">
            A
          </div>

          <h1 className="text-3xl font-bold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            {isSignup
              ? "Sign up to get started"
              : "Login to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-12 pr-4 outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
              />
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-12 pr-4 outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />
            <input
              type="password"
              placeholder="Password (at least 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={
                isSignup ? "new-password" : "current-password"
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-12 pr-4 outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
            />
          </div>

          {error && (
            <p className="break-words rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 py-3.5 font-semibold transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-xs text-slate-400">
            OR CONTINUE WITH
          </span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3 font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-60"
          >
            <span className="text-xl font-bold text-blue-600">G</span>
            Signup with Google
          </button>

          <button
            onClick={handleFacebook}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-60"
          >
            <span className="text-xl font-bold">f</span>
            Login with Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-300">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              dispatch(setError(null));
            }}
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
