"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: "approval" | "join_request" | "submission" | "invite";
  message: string;
  href: string;
  createdAt: string;
  read: boolean;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
      }
    } catch {
      // Silently fail — bell stays empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (n: Notification) => {
    setOpen(false);
    router.push(n.href);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label={`Notifications — ${unreadCount} unread`}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 min-w-[14px] h-[14px] flex items-center justify-center bg-indigo-500 text-white text-[9px] font-bold rounded-full px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] text-indigo-400 font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-6 text-center text-sm text-white/25">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-white/10" />
                  <p className="text-sm text-white/25">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-white/3 transition-colors border-b border-white/5 last:border-0 ${
                      !n.read ? "bg-indigo-500/5" : ""
                    }`}
                  >
                    <p className="text-sm text-white/80 leading-snug">{n.message}</p>
                    <p className="text-[10px] text-white/25 mt-1">{n.createdAt}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}