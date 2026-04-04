"use client";

import { useTheme } from "@/lib/theme-context";
import { useState, useEffect } from "react";

function useDateTime() {
  const [val, setVal] = useState("");
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const tz = "America/Chicago";
      const y = now.toLocaleDateString("en-CA", { year: "numeric", timeZone: tz });
      const m = now.toLocaleDateString("en-CA", { month: "2-digit", timeZone: tz });
      const d = now.toLocaleDateString("en-CA", { day: "2-digit", timeZone: tz });
      const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz });
      return `${y}.${m}.${d} ${time}`;
    };
    setVal(fmt());
    const id = setInterval(() => setVal(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return val;
}

function PulseDot() {
  return (
    <span className="footer-pulse">
      <span className="footer-pulse-ring" />
      <span className="footer-pulse-dot" />
    </span>
  );
}

function IconBtn({ label, children, onClick, href }: { label: string; children: React.ReactNode; onClick?: () => void; href?: string }) {
  const btn = (
    <button type="button" aria-label={label} onClick={onClick} className="footer-icon-btn">
      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ lineHeight: 0 }}>{btn}</a>;
  return btn;
}

export function Footer() {
  const dateTime = useDateTime();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-rule" />
        <div className="site-footer-row">
          <div className="site-footer-left">
            <PulseDot />
            <span>{dateTime} in Naperville, IL</span>
          </div>
          <div className="site-footer-right">
            <IconBtn label="GitHub" href="https://github.com/krisyotam">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </IconBtn>
            <IconBtn label="Toggle theme" onClick={toggleTheme}>
              {theme === "dark" ? (
                <>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </IconBtn>
          </div>
        </div>
      </div>
    </footer>
  );
}
