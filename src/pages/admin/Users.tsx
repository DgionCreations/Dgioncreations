import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  ArrowLeft, Shield, Clock, Check, ExternalLink,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

interface UserDoc {
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role?: "admin" | "pending" | string;
  createdAt?: { seconds: number };
  lastLoginAt?: { seconds: number };
}

function fmtDate(ts?: { seconds: number }) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setUsers(snap.docs.map((d) => ({ ...(d.data() as UserDoc), email: d.id })));
        setLoading(false);
      },
      (err) => {
        console.warn("[users] subscription failed:", err);
        setLoading(false);
        setError(err.message);
      }
    );
    return unsub;
  }, []);

  const admins = users.filter((u) => u.role === "admin");
  const pending = users.filter((u) => u.role !== "admin");

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
    >
      <header className="border-b border-white/5 backdrop-blur-md bg-[#08061A]/70">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Dashboard</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white text-sm font-semibold">Users</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-[#837FFB]" />
              <h1 className="text-2xl md:text-3xl font-bold">Users</h1>
            </div>
            <p className="text-white/50 text-sm max-w-2xl">
              Every sign-in is auto-logged here. To grant someone admin access,
              open their doc in Firebase Console and set <code className="text-white/80 bg-white/10 px-1.5 py-0.5 rounded">role</code> to <code className="text-[#837FFB] bg-[#837FFB]/10 px-1.5 py-0.5 rounded">admin</code>.
            </p>
          </div>
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Open Firebase <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {error && (
          <div
            className="mb-5 p-3 rounded-lg text-sm text-red-300"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            {error}
          </div>
        )}

        {/* Admins */}
        <Section title="Admins" count={admins.length}>
          {loading ? (
            <EmptyRow>Loading…</EmptyRow>
          ) : admins.length === 0 ? (
            <EmptyRow>No admins yet — set a user's role to "admin" in Firebase Console.</EmptyRow>
          ) : (
            admins.map((u) => <UserRow key={u.email} u={u} selfEmail={user?.email ?? undefined} />)
          )}
        </Section>

        {/* Pending / signed-in but not promoted */}
        <Section title="Pending / non-admin" count={pending.length} className="mt-8">
          {loading ? (
            <EmptyRow>Loading…</EmptyRow>
          ) : pending.length === 0 ? (
            <EmptyRow>Nobody waiting for access.</EmptyRow>
          ) : (
            pending.map((u) => <UserRow key={u.email} u={u} selfEmail={user?.email ?? undefined} />)
          )}
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  count,
  children,
  className = "",
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{title}</span>
        <span className="text-xs text-white/40">{count}</span>
      </div>
      <ul className="divide-y divide-white/5">{children}</ul>
    </div>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return <li className="px-5 py-8 text-center text-white/40 text-sm">{children}</li>;
}

function UserRow({ u, selfEmail }: { u: UserDoc; selfEmail?: string }) {
  const isYou = selfEmail?.toLowerCase() === u.email;
  const isAdmin = u.role === "admin";
  const initials = (u.displayName ?? u.email).split(/[@ ]/)[0].slice(0, 2).toUpperCase();

  return (
    <li className="px-5 py-3.5 flex items-center gap-4">
      {u.photoURL ? (
        <img
          src={u.photoURL}
          alt=""
          className="w-9 h-9 rounded-full shrink-0 object-cover"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        />
      ) : (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)", color: "#fff" }}
        >
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white text-sm font-medium truncate">
            {u.displayName || u.email}
          </span>
          {isYou && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#837FFB]/15 text-[#837FFB] border border-[#837FFB]/30">
              you
            </span>
          )}
          {isAdmin ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> admin
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {u.role || "pending"}
            </span>
          )}
        </div>
        <p className="text-white/35 text-xs mt-0.5 truncate">
          {u.displayName && `${u.email} · `}
          last seen {fmtDate(u.lastLoginAt)}
        </p>
      </div>
    </li>
  );
}