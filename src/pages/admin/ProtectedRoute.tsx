import { Link, Navigate, Outlet } from "react-router-dom";
import { ShieldOff, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProtectedRoute() {
  const {
    user,
    loading,
    ready,
    isAdmin,
    checkingAdmin,
    profileError,
    signOut,
  } = useAuth();

  if (!ready) return <Navigate to="/admin/login" replace />;

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08061A]">
        <div className="w-10 h-10 rounded-full border-2 border-[#837FFB] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  // Firestore write/read blocked — almost always security rules. Surface it.
  if (profileError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
      >
        <div
          className="max-w-xl w-full rounded-2xl p-8"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)" }}
        >
          <div className="flex items-start gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Firestore write blocked</h1>
              <p className="text-white/60 text-sm mt-1">
                You're signed in as <span className="text-white">{user.email}</span>,
                but your profile doc couldn't be created in Firestore.
              </p>
            </div>
          </div>

          <div className="rounded-lg p-3 mb-5 text-xs font-mono text-red-200 break-all"
               style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {profileError}
          </div>

          <div className="text-sm text-white/75 space-y-3">
            <p className="font-semibold text-white">Fix — paste these Firestore rules and Publish:</p>
            <pre className="text-xs rounded-lg p-4 overflow-x-auto"
                 style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
            </pre>
            <p className="text-xs text-white/50">
              Firebase Console → Firestore Database → <b>Rules</b> tab → replace with above → <b>Publish</b>.
              Then refresh this page. (You can tighten rules later once everything works.)
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)" }}
            >
              Reload
            </button>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signed in, profile doc exists, but role is not "admin"
  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
      >
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,158,11,0.25)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <ShieldOff className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-white text-2xl font-bold">Access not granted</h1>
          <p className="text-white/55 text-sm mt-3 leading-relaxed">
            Your profile exists as <span className="text-white">{user.email}</span> in
            Firestore <code className="text-white/80 bg-white/10 px-1.5 py-0.5 rounded">users</code>,
            but your role is not <code className="text-[#837FFB]">admin</code> yet.
            Open the doc in Firebase Console and set <code className="text-[#837FFB]">role</code> to <code className="text-[#837FFB]">admin</code>.
          </p>
          <div className="mt-7 flex gap-3 justify-center">
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Sign out
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)" }}
            >
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}