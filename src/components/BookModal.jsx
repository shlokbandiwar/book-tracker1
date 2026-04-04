import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function BookModal() {
    const { selectedBookId, closeBookModal, getBookDetails, library, updateBookStatus, removeBook } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (selectedBookId) {
            // Trigger animation frame for smooth mounting fade-in
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [selectedBookId]);

    if (!selectedBookId) return null;

    const book = getBookDetails(selectedBookId);
    if (!book) return null;

    const libEntry = library.find(l => l.bookId === book.id);
    const status = libEntry?.status;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsVisible(false);
            setTimeout(closeBookModal, 300); // Wait for fade out
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeBookModal, 300);
    };

    const handleAction = (newStatus) => {
        if (status === newStatus) {
            removeBook(book.id); // Toggle off if clicked again
        } else {
            updateBookStatus(book.id, newStatus);
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100 backdrop-blur-md bg-[#1a1c1c]/40' : 'opacity-0 backdrop-blur-none bg-transparent'}`}
            onClick={handleBackdropClick}
        >
            <div className={`relative w-full max-w-2xl mx-4 bg-surface rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-surface-container-low/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 aspect-[3/4] md:aspect-auto">
                        <img className="w-full h-full object-cover" src={book.src} alt={book.title} />
                    </div>
                    
                    <div className="md:w-3/5 p-8 flex flex-col justify-between">
                        <div>
                            <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-2">{book.tag} • {book.pages} Pages</p>
                            <h2 className="font-noto-serif text-3xl font-black leading-tight mb-2">{book.title}</h2>
                            <p className="font-manrope text-sm text-outline mb-6">by {book.author}</p>
                            <p className="font-manrope text-sm leading-relaxed text-on-surface opacity-80">{book.description}</p>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => handleAction('reading')}
                                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-manrope text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${status === 'reading' ? 'bg-primary text-white shadow-md' : 'bg-surface-container hover:bg-surface-container-high'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{status === 'reading' ? 'menu_book' : 'import_contacts'}</span>
                                    {status === 'reading' ? 'Reading' : 'Read Now'}
                                </button>
                                
                                <button 
                                    onClick={() => handleAction('read')}
                                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-manrope text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${status === 'read' ? 'bg-secondary text-white shadow-md' : 'bg-surface-container hover:bg-surface-container-high'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                                    {status === 'read' ? 'Completed' : 'Mark Read'}
                                </button>
                            </div>
                            
                            <button 
                               onClick={() => handleAction('wishlist')}
                               className={`w-full py-3 px-4 rounded-xl font-manrope text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${status === 'wishlist' ? 'bg-[#443000]/10 text-primary border border-primary/20' : 'bg-transparent border border-outline-variant/30 hover:bg-surface-container'}`}
                            >
                                <span className="material-symbols-outlined text-[16px]">{status === 'wishlist' ? 'bookmark_added' : 'bookmark_add'}</span>
                                {status === 'wishlist' ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
