import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function BookCard({ book, layout = 'vertical' }) {
    const { openBookModal, library } = useAppContext();
    const libEntry = library.find(l => l.bookId === book.id);
    const status = libEntry?.status;

    if (layout === 'horizontal') {
        return (
            <div 
                className="flex gap-6 group cursor-pointer items-start p-2 -m-2 rounded-2xl hover:bg-surface-container-low transition-colors duration-300"
                onClick={() => openBookModal(book.id)}
            >
                <div className="relative">
                    <img 
                        className="w-24 h-36 object-cover rounded-xl shadow-md group-hover:scale-95 duration-300 group-hover:shadow-lg" 
                        alt={book.title}
                        src={book.src}
                    />
                    {status && (
                        <div className="absolute -top-2 -right-2 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-[12px]">
                                {status === 'read' ? 'done' : status === 'wishlist' ? 'bookmark' : 'menu_book'}
                            </span>
                        </div>
                    )}
                </div>
                <div className="pt-2 flex-1">
                    <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">{book.tag}</p>
                    <h4 className="font-noto-serif text-lg font-bold mb-1 group-hover:text-primary transition-colors">{book.title}</h4>
                    <p className="font-manrope text-xs text-outline">{book.author}</p>
                    {status === 'reading' && libEntry.progress > 0 && (
                        <div className="mt-3 w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${libEntry.progress}%` }}></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div 
            className="space-y-6 group cursor-pointer"
            onClick={() => openBookModal(book.id)}
        >
            <div className="bg-surface-container-low aspect-[3/4] rounded-xl overflow-hidden relative shadow-md group-hover:shadow-2xl transition-all duration-500">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={book.title}
                    src={book.src} 
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <span className="material-symbols-outlined text-white text-4xl mb-2 drop-shadow-md">visibility</span>
                    <button className="bg-surface-container-lowest px-6 py-2 rounded-full shadow-lg font-manrope text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">View Details</button>
                </div>
                {status && (
                    <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full shadow-sm">
                         <span className="font-manrope text-[9px] font-bold uppercase tracking-widest">
                            {status === 'read' ? 'Completed' : status === 'wishlist' ? 'Wishlist' : 'Reading'}
                         </span>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h4 className="font-noto-serif text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{book.title}</h4>
                <p className="font-manrope text-[10px] font-bold uppercase tracking-widest text-outline truncate">{book.author}</p>
            </div>
        </div>
    );
}
