import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminLogin() {
  const { user, ready, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : "Login failed";
    setError(msg.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate("/admin");
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
               style={{ background: "rgba(131,127,251,0.15)", border: "1px solid rgba(131,127,251,0.3)" }}>
            <Lock className="w-6 h-6 text-[#837FFB]" />
          </div>
          <h1 className="text-white text-3xl font-bold">Admin Login</h1>
          <p className="text-white/45 text-sm mt-2">Sign in to manage your website content.</p>
        </div>

        {!ready && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3"
               style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200/90">
              Firebase isn't configured yet. Add your <code className="text-amber-100">VITE_FIREBASE_*</code> keys to
              <code className="text-amber-100"> .env.local</code>, then restart the dev server.
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="rounded-2xl p-7 space-y-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-[#837FFB]/50"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="admin@dgion.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-[#837FFB]/50"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm text-red-300 flex items-start gap-2"
                 style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !ready}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #837FFB, #5B57F5)",
              boxShadow: "0 8px 24px rgba(131,127,251,0.3)",
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/35 text-xs uppercase tracking-[0.2em]">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={submitting || !ready}
            className="w-full py-3 rounded-lg font-semibold text-white/90 transition-all hover:-translate-y-0.5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.4-11.2-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.3 5.3C41.2 36 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-white/30 text-xs text-center mt-6">
          Create an admin user from Firebase Console → Authentication → Add user.
        </p>
      </div>
    </div>
  );
}