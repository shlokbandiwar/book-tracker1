import React, { useState } from 'react';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import { useAppContext } from '../context/AppContext';

export default function MyLibrary() {
    const { library, books, openBookModal } = useAppContext();
    const [filter, setFilter] = useState('all');

    // Stats
    const totalCount = library.length;
    const readingCount = library.filter(b => b.status === 'reading').length;
    const readCount = library.filter(b => b.status === 'read').length;

    // Filtered books
    const filteredLibrary = library.filter(b => filter === 'all' || b.status === filter);
    const displayedBooks = filteredLibrary.map(libItem => {
        const book = books.find(b => b.id === libItem.bookId);
        return { ...book, libId: libItem.bookId };
    }).filter(b => b !== undefined);

    // Active focus book
    const activeLib = library.find(b => b.status === 'reading') || library[0];
    const activeBook = activeLib ? books.find(b => b.id === activeLib.bookId) : null;

    const FILTERS = [
        { id: 'all', label: 'Library' },
        { id: 'reading', label: 'Currently Reading' },
        { id: 'wishlist', label: 'Wishlist' },
        { id: 'read', label: 'Archive' },
    ];

    return (
        <Layout title="The Archive">
            <section className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="font-label text-[0.75rem] uppercase tracking-widest text-primary font-bold mb-3 block">Your Curation</span>
                        <h1 className="font-headline text-5xl font-black text-on-surface leading-tight">Personal Library</h1>
                        <p className="mt-4 text-on-surface-variant font-light leading-relaxed text-lg">Managing {totalCount} volumes across collections. Every book is a conversation waiting to happen.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-md font-label text-[0.75rem] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-high transition-all">
                            <span className="material-symbols-outlined text-[18px]">tune</span> Filter
                        </button>
                    </div>
                </div>
            </section>

            <div className="mb-10 flex flex-wrap items-center gap-8 border-b border-outline-variant/10 pb-4">
                {FILTERS.map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`font-label text-sm uppercase tracking-widest pb-4 -mb-[18px] transition-colors ${filter === f.id ? 'font-extrabold text-primary border-b-2 border-primary' : 'font-bold text-on-surface-variant/60 hover:text-on-surface'}`}
                    >
                        {f.label}
                    </button>
                ))}
                
                <div className="ml-auto flex items-center gap-6">
                    <div className="flex items-center gap-2 text-on-surface-variant/70">
                        <span className="material-symbols-outlined text-[20px]">sort</span>
                        <span className="font-label text-[0.7rem] uppercase tracking-wider font-bold hidden sm:inline">Sort by Title</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant/70">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filter === 'all' && activeBook && (
                    <div 
                        onClick={() => openBookModal(activeBook.id)}
                        className="group cursor-pointer bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row gap-10 items-center hover:bg-surface-container transition-colors"
                    >
                        <div className="relative w-56 h-80 shrink-0 transform group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                            <img alt={activeBook.title} className="w-full h-full object-cover rounded-xl" src={activeBook.src} />
                            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"></div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-label text-[0.6rem] font-black uppercase tracking-widest">
                                    {activeLib.status === 'reading' ? 'Active Focus' : 'Recent Focus'}
                                </span>
                                {activeLib.status === 'reading' && (
                                    <span className="text-on-surface-variant/50 font-label text-[0.6rem] font-bold uppercase tracking-widest">{activeLib.progress}% Complete</span>
                                )}
                            </div>
                            <h2 className="font-headline text-4xl font-bold mb-4 group-hover:text-primary transition-colors">{activeBook.title}</h2>
                            <p className="font-label text-sm uppercase tracking-widest font-extrabold text-on-surface-variant mb-6">{activeBook.author}</p>
                            
                            {activeLib.status === 'reading' && (
                                <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-secondary transition-all duration-1000 shadow-[0_0_8px_rgba(68,100,100,0.3)]" style={{ width: `${activeLib.progress}%` }}></div>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <button className="bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 rounded font-label text-[0.65rem] font-bold uppercase tracking-tighter hover:bg-surface-container-hover transition-colors">Manage Status</button>
                            </div>
                        </div>
                    </div>
                )}

                {displayedBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedBooks.map(book => (
                            <BookCard key={book.libId} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center opacity-70">
                        <span className="material-symbols-outlined text-6xl mb-4">auto_stories</span>
                        <h3 className="font-headline text-2xl font-bold mb-2">No artifacts in this collection</h3>
                        <p className="text-on-surface-variant max-w-sm">Discover new books to add to your library.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
