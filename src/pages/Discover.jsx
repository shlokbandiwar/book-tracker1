import React, { useState } from 'react';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import { useAppContext } from '../context/AppContext';
import AddBookModal from '../components/AddBookModal';

const CATEGORIES = [
    { icon: 'history_edu', label: 'Classic Literature' },
    { icon: 'architecture', label: 'Modern Design' },
    { icon: 'psychology', label: 'Philosophical Inquiry' },
    { icon: 'biotech', label: 'Science & Logic' },
    { icon: 'brush', label: 'Art History' }
];

export default function Discover() {
    const { books, openBookModal } = useAppContext();
    const [query, setQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const searchResults = books.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) || 
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.tag.toLowerCase().includes(query.toLowerCase())
    );

    const isSearching = query.trim().length > 0;
    
    // Dynamic lists when not searching
    const trending = books.slice(0, 2);
    const classics = books.filter(b => b.tag === 'Classics').slice(0, 4);
    const editorChoice = books[6];

    return (
        <Layout title="The Archive" hideSearch={true}>
            <section className="relative space-y-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-2xl">
                        <h1 className="font-noto-serif text-5xl md:text-7xl font-black tracking-tighter leading-tight text-on-surface">
                            Discover your next <span className="italic text-primary">literary artifact.</span>
                        </h1>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row items-end md:items-center gap-6 pb-2">
                        <button 
                            onClick={() => setIsAddOpen(true)}
                            className="w-full md:w-auto px-6 py-3 bg-secondary text-white rounded-full font-manrope text-[11px] font-bold uppercase tracking-widest hover:scale-[1.02] hover:shadow-lg transition-transform shadow-md flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Contribute Book
                        </button>
                        <div className="w-full md:w-72 lg:w-96 relative flex items-center">
                            <input 
                                className="w-full bg-transparent border-b border-outline-variant/30 py-3 px-1 font-manrope text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-outline/50" 
                                placeholder="Search by title, author, or genre..." 
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute right-0 text-outline">{isSearching ? 'search' : 'arrow_forward'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {isSearching ? (
                <section className="space-y-8 py-8 animate-in fade-in duration-500">
                    <h2 className="font-noto-serif text-2xl font-bold tracking-tight">Search Results</h2>
                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {searchResults.map(book => <BookCard key={book.id} book={book} />)}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-6xl text-outline/30 mb-4">search_off</span>
                            <h3 className="font-noto-serif text-2xl font-bold mb-2">No artifacts found</h3>
                            <p className="font-manrope text-outline">Try adjusting your search terms.</p>
                        </div>
                    )}
                </section>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-20">
                    <section className="space-y-12">
                        <div className="flex justify-between items-center">
                            <h2 className="font-noto-serif text-2xl font-bold tracking-tight">Trending Now</h2>
                            <button className="font-manrope text-[10px] font-bold uppercase tracking-widest text-secondary hover:underline transition-all">View All Entries</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                            {editorChoice && (
                                <div className="md:col-span-7 group cursor-pointer" onClick={() => openBookModal(editorChoice.id)}>
                                    <div className="relative aspect-[16/10] bg-surface-container-low overflow-visible flex items-center justify-center rounded-2xl">
                                        <img 
                                            className="w-2/3 h-auto shadow-2xl rounded-xl transition-transform duration-500 group-hover:scale-105 z-10" 
                                            alt={editorChoice.title}
                                            src={editorChoice.src}
                                        />
                                        <div className="absolute -bottom-8 -right-4 bg-surface-container-lowest p-8 max-w-xs shadow-lg z-20">
                                            <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Editor's Choice</p>
                                            <h3 className="font-noto-serif text-2xl font-black leading-tight mb-4">{editorChoice.title}</h3>
                                            <p className="font-manrope text-xs text-outline leading-relaxed line-clamp-2">{editorChoice.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-5 space-y-4">
                                {trending.map(book => <BookCard key={book.id} book={book} layout="horizontal" />)}
                            </div>
                        </div>
                    </section>

                    <section className="bg-surface-container-low -mx-6 px-6 py-20 rounded-3xl">
                        <div className="max-w-7xl mx-auto space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="font-noto-serif text-3xl font-bold italic">Curate by Interest</h2>
                                <p className="font-manrope text-sm text-outline max-w-lg mx-auto">Explore our extensive archive through curated taxonomies and historical genres.</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                {CATEGORIES.map((cat, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setQuery(cat.label.split(' ')[0])}
                                        className="px-8 py-4 bg-surface-container-lowest font-manrope text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3 rounded-full cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-12">
                        <div className="flex justify-between items-center">
                            <h2 className="font-noto-serif text-2xl font-bold tracking-tight">Must-Read Classics</h2>
                            <div className="h-[1px] flex-grow mx-8 bg-outline-variant/20 hidden md:block"></div>
                            <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-outline">Volume 04</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {classics.map((classic) => (
                                <BookCard key={classic.id} book={classic} layout="vertical" />
                            ))}

                            <div className="md:col-span-2 bg-secondary text-white rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative">
                                <div className="relative z-10">
                                    <p className="font-manrope text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70">Weekly Collection</p>
                                    <h3 className="font-noto-serif text-4xl font-black mb-6 leading-tight">The Age of Enlightenment</h3>
                                    <p className="font-manrope text-sm leading-relaxed opacity-80 max-w-xs">A comprehensive digital gallery of the works that shaped the modern world.</p>
                                </div>
                                <button className="relative z-10 w-fit mt-8 px-10 py-4 bg-primary text-white font-manrope text-[11px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Explore Collection</button>
                                
                                <img 
                                    className="absolute right-0 bottom-0 w-3/4 h-3/4 object-contain opacity-20 translate-x-1/4 translate-y-1/4 grayscale mix-blend-screen" 
                                    alt="Abstract study"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGzlDPJC1q38i5yUygIiKyOoPKpFzGTe-sbuZOR8-BHbcnxYQ3OR3EiLRbiZMOvG9uc9ZcF06Ve1sWiZUdDdLaPJe4oFP-M7xpPFUpUXivUQYLB_amkZt27BRhYLedHhh2ClluPTJmiMWbpU_VdVz430YAOgOf6M9YvJza8-J_seqdDhJyY8yJy8AoNaaU9ESDuQCCDSgaMYa7PYT4GYhOQBYgM3zb6mBAhCnAKhfVah3lq1e_o6rUCXwS5qbGRG4q-LQblVX-PrM"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            )}
            <AddBookModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </Layout>
    );
}
