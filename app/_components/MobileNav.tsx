"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function DiscordIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

interface MobileNavProps {
  docsUrl: string;
}

export function MobileNav({ docsUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={containerRef}>
      <button
        className="nav-hamburger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Always in DOM — CSS transition handles show/hide */}
      <div className={`nav-drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="nav-drawer-inner">
          <a
            className="nav-link"
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Docs
          </a>
          <Link className="nav-link" href="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link className="btn-nav-login" href="/login" onClick={() => setOpen(false)}>
            <DiscordIcon />
            Login with Discord
          </Link>
        </div>
      </div>

      {open && (
        <div className="nav-drawer-overlay" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
