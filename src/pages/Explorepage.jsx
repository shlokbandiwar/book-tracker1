import React, { useState } from 'react';
import Layout from '../components/Layout';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function Explorepage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingIds, setAddingIds] = useState(new Set());
    const [addedIds, setAddedIds] = useState(new Set());
    const { currentUser } = useAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.items) {
                setResults(data.items);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToArchive = async (book) => {
        if (!currentUser) return;
        
        setAddingIds(prev => new Set(prev).add(book.id));
        try {
            const newBookData = {
                userId: currentUser.uid,
                title: book.volumeInfo.title || 'Unknown Title',
                author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
                description: book.volumeInfo.description || '',
                src: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
                tag: book.volumeInfo.categories?.[0] || 'Uncategorized',
                pages: book.volumeInfo.pageCount || 0,
                apiId: book.id,
                dateAdded: new Date().toISOString()
            };
            
            await addDoc(collection(db, 'books'), newBookData);
            setAddedIds(prev => new Set(prev).add(book.id));
        } catch (error) {
            console.error("Error adding to archive:", error);
        } finally {
            setAddingIds(prev => {
                const next = new Set(prev);
                next.delete(book.id);
                return next;
            });
        }
    };

    return (
        <Layout title="Explore">
            <div className="space-y-10 animate-in fade-in duration-700">
                
                {/* Search Bar Section */}
                <section className="bg-inverse-surface/90 text-inverse-on-surface p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden border border-outline-variant/10">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="font-noto-serif text-4xl md:text-5xl font-black mb-4">
                            Global Subnet Search
                        </h1>
                        <p className="font-manrope text-sm opacity-80 mb-8 max-w-xl">
                            Query the central repository for any literary artifact to add to your personal archive.
                        </p>
                        
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative">
                            <div className="relative flex-grow">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-50">search</span>
                                <input 
                                    className="w-full bg-[#1a1c1c]/50 border border-outline-variant/30 text-white rounded-xl py-4 pl-12 pr-4 font-manrope focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary backdrop-blur-md transition-all placeholder:text-white/40"
                                    placeholder="Enter book title, author, or ISBN..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading || !query.trim()}
                                className="bg-primary text-white px-8 py-4 rounded-xl font-manrope text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {loading ? (
                                     <span className="material-symbols-outlined animate-spin text-[18px]">rotate_right</span>
                                ) : (
                                    <>
                                        <span>Initiate</span>
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    
                    {/* Cyber-industrial ambient artifact */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 border border-outline-variant/10 rounded-full opacity-20 pointer-events-none"></div>
                    <div className="absolute right-10 bottom-10 w-32 h-32 border border-primary/20 rounded-full opacity-40 pointer-events-none"></div>
                </section>

                {/* Results Grid */}
                {results.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="font-noto-serif text-2xl font-bold">Search Results</h2>
                            <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-outline">
                                {results.length} Artifacts Found
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {results.map(book => {
                                const isAdding = addingIds.has(book.id);
                                const isAdded = addedIds.has(book.id);
                                const thumbnail = book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:');

                                return (
                                    <div key={book.id} className="group relative bg-[#1a1c1c]/90 text-[#f9f9f9] border border-outline-variant/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-xl flex flex-col h-full hover:-translate-y-1">
                                        <div className="relative aspect-[3/4] bg-[#2f3131] w-full overflow-hidden">
                                            {thumbnail ? (
                                                <img 
                                                    src={thumbnail}
                                                    alt={book.volumeInfo.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-outline/50">
                                                    <span className="material-symbols-outlined text-4xl">broken_image</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-[#1a1c1c]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-outline-variant/20">
                                                <span className="font-manrope text-[9px] font-bold uppercase tracking-widest text-primary-fixed">
                                                    {book.volumeInfo.categories?.[0] || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="font-noto-serif text-lg font-black leading-tight mb-2 line-clamp-2">
                                                {book.volumeInfo.title}
                                            </h3>
                                            <p className="font-manrope text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim/80 mb-4 line-clamp-1">
                                                {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                                            </p>
                                            
                                            <p className="font-manrope text-xs text-outline leading-relaxed line-clamp-3 mb-6 flex-grow">
                                                {book.volumeInfo.description || 'No description available for this artifact.'}
                                            </p>
                                            
                                            <button 
                                                onClick={() => handleAddToArchive(book)}
                                                disabled={isAdding || isAdded}
                                                className={`w-full py-3 rounded-xl font-manrope text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                                    isAdded 
                                                    ? 'bg-secondary text-white border border-secondary shadow-inner' 
                                                    : 'bg-transparent border border-primary/50 text-primary-fixed hover:bg-primary/20 hover:border-primary'
                                                }`}
                                            >
                                                {isAdding ? (
                                                    <span className="material-symbols-outlined animate-spin text-[16px]">rotate_right</span>
                                                ) : isAdded ? (
                                                    <>
                                                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                        Archived
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                                        Add to My Archive
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}
