import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { profile, setProfile, library, books } = useAppContext();
    const { logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    const [editForm, setEditForm] = useState({
        name: profile?.name || '',
        goal: profile?.goal || 12,
        avatar: profile?.avatar || ''
    });

    const handleSave = () => {
        setProfile({
            ...profile,
            name: editForm.name,
            goal: parseInt(editForm.goal) || 1,
            avatar: editForm.avatar
        });
        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            // User will automatically get redirected by ProtectedRoute if we use a watcher in App, 
            // but since ProtectedRoute evaluates on render, they'll be bumped.
        } catch (err) {
            console.error(err);
        }
    };

    const booksArchived = library.filter(b => b.status === 'read').length;
    const currentReads = library.filter(b => b.status === 'reading').length;
    
    // approximate pages
    const pagesDevoured = library.reduce((acc, curr) => acc + (curr.pagesRead || curr.progress > 0 ? (curr.pagesRead ? curr.pagesRead : 0) : 0), 0) + 
                           library.filter(b => b.status==='read').reduce((acc, curr) => { 
                               const bk = books.find(bx => bx.id === curr.bookId); 
                               return acc + (bk?.pages || 0); 
                           }, 0);

    const goalProgress = Math.min((booksArchived / profile.goal) * 100, 100);

    return (
        <Layout title="Profile">
            <section className="mb-16 flex flex-col md:flex-row items-center md:items-end gap-12 animate-in fade-in duration-500">
                <div className="relative group">
                    <div className="w-32 h-44 rounded-xl overflow-hidden shadow-2xl rotate-[-2deg] transition-transform group-hover:rotate-0 duration-500 bg-surface-container-high">
                        <img className="w-full h-full object-cover" alt="Profile avatar" src={profile.avatar} />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-sm">verified</span>
                    </div>
                </div>
                
                <div className="text-center md:text-left flex-1 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-label text-[0.75rem] uppercase tracking-widest text-secondary font-bold mb-2">Member Curriculum</p>
                            
                            {isEditing ? (
                                <div className="space-y-4 mb-4">
                                    <div>
                                        <label className="block font-manrope text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Name</label>
                                        <input 
                                            value={editForm.name} 
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full bg-surface-container border border-outline-variant/30 py-2 px-4 rounded-lg font-noto-serif text-2xl font-bold focus:outline-none focus:border-primary" 
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block font-manrope text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Reading Goal</label>
                                            <input 
                                                type="number"
                                                value={editForm.goal} 
                                                onChange={(e) => setEditForm({...editForm, goal: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/30 py-2 px-4 rounded-lg font-noto-serif text-2xl font-bold focus:outline-none focus:border-primary" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block font-manrope text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Avatar URL</label>
                                            <input 
                                                value={editForm.avatar} 
                                                onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                                                className="w-full bg-surface-container border border-outline-variant/30 py-2 px-4 rounded-lg font-manrope text-sm focus:outline-none focus:border-primary" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <h2 className="font-headline text-5xl md:text-6xl font-bold leading-tight mb-4">{profile.name}</h2>
                            )}
                        </div>
                        
                        {isEditing ? (
                            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-full font-manrope text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-md">Save</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="bg-surface-container-high border border-outline-variant/30 px-4 py-2 rounded-full font-manrope text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
                                <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                            </button>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-on-surface-variant">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">{booksArchived}</span>
                                <span className="font-label text-xs uppercase tracking-tighter">Books Archived</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">{currentReads}</span>
                                <span className="font-label text-xs uppercase tracking-tighter">Current Reads</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">{pagesDevoured}</span>
                                <span className="font-label text-xs uppercase tracking-tighter">Pages Devoured</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="mb-20 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-baseline justify-between mb-8">
                    <h3 className="font-headline text-2xl font-bold">Reading Achievements</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 bg-surface-container-low rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center transition-all hover:bg-surface-container duration-300">
                        <div className="w-40 h-40 flex-shrink-0 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container shadow-inner">
                            <span className="material-symbols-outlined text-6xl">auto_stories</span>
                        </div>
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Master Badge</span>
                            </div>
                            <h4 className="font-headline text-3xl font-bold mb-2 text-primary">The Centennial Librarian</h4>
                            <p className="text-on-surface-variant leading-relaxed mb-6">Awarded for cataloging and completing {profile.goal} titles within a single calendar year.</p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden flex">
                                    <div className="h-full bg-secondary shadow-[0_0_8px_rgba(68,100,100,0.4)] transition-all duration-1000" style={{ width: `${goalProgress}%` }}></div>
                                </div>
                                <span className="font-label text-[10px] font-black">{booksArchived}/{profile.goal}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-4 bg-surface-container-lowest p-6 rounded-3xl flex flex-col justify-between border border-outline-variant/10 hover:bg-surface-container-low transition-colors group">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                                <span className="material-symbols-outlined">wb_sunny</span>
                            </div>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">verified</span>
                        </div>
                        <div className="mt-8">
                            <h5 className="font-headline text-xl font-bold mb-1">Early Bird Reader</h5>
                            <p className="font-label text-xs text-on-surface-variant uppercase tracking-tighter">Morning sessions logged</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-20 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                <h3 className="font-headline text-2xl font-bold mb-8">Account Settings</h3>
                <div className="space-y-4">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between py-6 px-4 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4 text-left">
                            <span className="material-symbols-outlined text-error">logout</span>
                            <div>
                                <h6 className="font-bold text-error">Secure Logout</h6>
                                <p className="text-xs text-on-surface-variant">Safely exit your session</p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>
        </Layout>
    );
}
