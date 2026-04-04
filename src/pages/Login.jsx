import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex items-center justify-center relative px-6">
            <div className="grain-overlay opacity-30 select-none pointer-events-none"></div>
            <img 
                className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none grayscale mix-blend-screen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq10l1xM04GgoKqR70_pKa4V1FCTsSIzSyZUVLYSJ3PeBc3JzEiQPlRu2VhO5hIgDf4zteZ4mLvzpPnbsiYHAvO3hiiNfNqSqHMb1HfwZbRYM62UQpmrn7qVhxIkfgkotKT0ElRxHAagSGzA3rE-lT3GA2If8HFr3M9-jfGLHi0RFXQ_5dF6Q0onaanmvi-o_42q1fmNXkf4um5_PBvKGWs1C_6mUjoDKBWUfHvN2qrM1b5hTnRH-QqO-P_JGLmdfkvUKJgnNSmHE" 
                alt="Background Abstract Architecture"
            />
            
            <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <span className="material-symbols-outlined text-[48px] text-primary mb-4 drop-shadow-md">auto_stories</span>
                    <h1 className="font-noto-serif text-5xl font-black tracking-tight mb-2">The Archive</h1>
                    <p className="font-manrope text-sm text-outline tracking-wider uppercase font-bold">Digital Reading Tracker</p>
                </div>

                <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl shadow-2xl border border-outline-variant/20 relative overflow-hidden backdrop-blur-xl">
                    <h2 className="font-noto-serif text-3xl font-bold mb-6 text-center">{isLogin ? 'Log In' : 'Create Account'}</h2>
                    
                    {error && (
                        <div className="bg-error/10 text-error px-4 py-3 rounded-lg mb-6 text-sm font-manrope font-bold flex items-center gap-3">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="font-manrope text-[10px] uppercase tracking-widest font-bold text-outline">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/30 py-3 px-4 rounded-xl font-manrope focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="font-manrope text-[10px] uppercase tracking-widest font-bold text-outline">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/30 py-3 px-4 rounded-xl font-manrope focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-4 mt-2 bg-primary text-white font-manrope text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : null}
                            {isLogin ? 'Enter Archive' : 'Register'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-surface-container-lowest font-manrope text-[10px] uppercase tracking-widest font-bold text-outline">Or continue with</span>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        onClick={handleGoogleSignIn}
                        type="button" 
                        className="w-full py-4 bg-surface-container border border-outline-variant/30 font-manrope text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-high disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                        {/* Using a simple custom SVG icon for Google to keep aesthetics tight without external dependencies that might fail */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
                        Google
                    </button>

                    <div className="mt-8 text-center">
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            className="font-manrope text-[11px] uppercase tracking-widest font-bold text-secondary hover:underline transition-all"
                        >
                            {isLogin ? 'Need an account? Register' : 'Already curating? Log In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
