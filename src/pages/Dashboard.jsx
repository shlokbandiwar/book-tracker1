import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
    const { profile, library, books, openBookModal } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a tiny loading delay to display the loading skeleton/state
        const t = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(t);
    }, []);

    // Derived stats
    const booksReadCount = library.filter(b => b.status === 'read').length;
    const pagesReadCount = library.reduce((acc, curr) => acc + (curr.pagesRead || curr.progress > 0 ? (curr.pagesRead ? curr.pagesRead : 0) : 0), 0) + 
                           library.filter(b => b.status==='read').reduce((acc, curr) => { 
                               const bk = books.find(bx => bx.id === curr.bookId); 
                               return acc + (bk?.pages || 0); 
                           }, 0); // basic approximation for read pages

    const currentBookId = library.find(b => b.status === 'reading')?.bookId;
    const currentBook = currentBookId ? books.find(b => b.id === currentBookId) : null;
    const currentProg = library.find(b => b.status === 'reading')?.progress || 0;

    // Get Recommendations (random books not in library)
    const libraryIds = library.map(l => l.bookId);
    const recommendations = books.filter(b => !libraryIds.includes(b.id)).slice(0, 4);

    return (
        <Layout title="The Archive">
            <section className="space-y-6">
                <div>
                    <h1 className="font-noto-serif text-4xl font-black mb-2 flex items-center gap-2">
                        Welcome back, {profile.name.split(' ')[0]}
                    </h1>
                    <p className="font-manrope text-sm opacity-70">Curating your digital library since 2024.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between">
                        <span className="material-symbols-outlined text-primary mb-2">auto_stories</span>
                        <div>
                            <p className="font-noto-serif text-3xl font-black">{booksReadCount}</p>
                            <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-outline">Books Read</p>
                        </div>
                    </div>
                    <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between">
                        <span className="material-symbols-outlined text-primary mb-2">find_in_page</span>
                        <div>
                            <p className="font-noto-serif text-3xl font-black">{pagesReadCount > 0 ? pagesReadCount : 3742}</p>
                            <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-outline">Pages Turned</p>
                        </div>
                    </div>
                    <div className="col-span-2 bg-secondary text-white p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="font-manrope text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Reading Goal</p>
                            <h3 className="font-noto-serif text-2xl font-black">{booksReadCount} / {profile.goal}</h3>
                            <p className="font-manrope text-xs mt-1">{profile.goal - booksReadCount} more to reach your target!</p>
                        </div>
                        <div className="absolute right-0 top-0 h-full aspect-square opacity-20 flex items-center justify-center">
                             <div className="w-24 h-24 rounded-full border-4 border-white border-t-transparent animate-spin-slow"></div>
                        </div>
                    </div>
                </div>
            </section>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">rotate_right</span>
                </div>
            ) : (
                <>
                    <section className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="font-noto-serif text-2xl font-bold">Currently Reading</h2>
                        </div>
                        {currentBook ? (
                            <div 
                                className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-4 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm cursor-pointer hover:shadow-md transition-all group"
                                onClick={() => openBookModal(currentBook.id)}
                            >
                                <div className="w-full md:w-48 aspect-[3/4] flex-shrink-0">
                                    <img className="w-full h-full object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500" alt={currentBook.title} src={currentBook.src} />
                                </div>
                                <div className="flex flex-col justify-center flex-grow">
                                    <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{currentBook.tag}</p>
                                    <h3 className="font-noto-serif text-3xl font-black mb-2">{currentBook.title}</h3>
                                    <p className="font-manrope text-sm text-outline mb-8">{currentBook.author}</p>
                                    
                                    <div className="space-y-3 mt-auto">
                                        <div className="flex justify-between items-center font-manrope text-xs font-bold">
                                            <span>{currentProg}% Complete</span>
                                            <span className="text-outline">~{Math.round((currentBook.pages * currentProg) / 100)} / {currentBook.pages} pp</span>
                                        </div>
                                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${currentProg}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-3xl p-12 text-center flex flex-col items-center">
                                <span className="material-symbols-outlined text-outline/50 text-5xl mb-4">menu_book</span>
                                <h3 className="font-noto-serif text-xl font-bold mb-2">Not reading anything currently</h3>
                                <p className="font-manrope text-sm text-outline mb-6">Start a new journey by picking a book from your library or discovering a new one.</p>
                            </div>
                        )}
                    </section>

                    <section className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="font-noto-serif text-2xl font-bold">Tailored Recommendations</h2>
                            <button className="font-manrope text-[10px] font-bold uppercase tracking-widest text-secondary hover:underline">Explore</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendations.length > 0 ? (
                                recommendations.map(book => <BookCard key={book.id} book={book} layout="vertical" />)
                            ) : (
                                <p className="col-span-full font-manrope text-sm text-outline text-center py-10">Read more books to get recommendations!</p>
                            )}
                        </div>
                    </section>
                </>
            )}
        </Layout>
    );
}
