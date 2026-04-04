import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Layout({ children, title = "The Archive", hideSearch = false }) {
    const location = useLocation();
    const { profile } = useAppContext();

    const NAV_ITEMS = [
        { icon: 'dashboard', label: 'Dashboard', href: '/' },
        { icon: 'explore', label: 'Discover', href: '/discover' },
        { icon: 'auto_stories', label: 'Library', href: '/library' },
        { icon: 'person', label: 'Profile', href: '/profile' }
    ];

    return (
        <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
            <div className="grain-overlay"></div>

            <header className="fixed top-0 w-full z-50 bg-[#f9f9f9]/80 dark:bg-[#1a1c1c]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-4">
                    {!hideSearch && <Link to="/discover" className="material-symbols-outlined text-[#443000] dark:text-[#604503] hover:opacity-70 transition-opacity">search</Link>}
                    <span className="font-noto-serif text-2xl font-black text-[#1a1c1c] dark:text-[#f9f9f9]">{title}</span>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex gap-8 items-center">
                        {NAV_ITEMS.map((item, idx) => {
                            const active = location.pathname === item.href;
                            return (
                                <Link 
                                    key={idx} 
                                    className={`font-manrope text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'text-[#443000]' : 'text-[#1a1c1c]/60 hover:text-[#443000]'}`} 
                                    to={item.href}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <Link to="/profile" className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30 hover:ring-2 ring-primary transition-all">
                        <img 
                            className="w-full h-full object-cover" 
                            alt={profile.name}
                            src={profile.avatar}
                        />
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-16">
                {children}
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 bg-[#f9f9f9]/80 dark:bg-[#1a1c1c]/80 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0_-12px_32px_rgba(26,28,28,0.04)] border-t border-[#e2e2e2]/20">
                {NAV_ITEMS.map((item, idx) => {
                    const active = location.pathname === item.href;
                    return (
                        <Link 
                            key={idx} 
                            to={item.href}
                            className={`flex flex-col items-center justify-center px-5 py-1.5 transition-all scale-90 duration-300 ${active ? 'bg-[#443000] text-[#ffffff] rounded-xl' : 'text-[#1a1c1c]/50 dark:text-[#f9f9f9]/50 hover:text-[#443000]'}`}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>{item.icon}</span>
                            <span className="font-manrope text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
