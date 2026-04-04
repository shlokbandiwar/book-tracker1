import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function AddBookModal({ isOpen, onClose }) {
    const { addBookToCatalog } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        tag: 'Classics',
        pages: '',
        description: '',
        src: ''
    });

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 10);
            setFormData({ title: '', author: '', tag: 'Classics', pages: '', description: '', src: '' });
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addBookToCatalog({
                ...formData,
                pages: parseInt(formData.pages) || 0
            });
            handleClose();
        } catch (error) {
            console.error("Failed to add book", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100 backdrop-blur-md bg-[#1a1c1c]/40' : 'opacity-0 backdrop-blur-none bg-transparent'}`}
            onClick={handleBackdropClick}
        >
            <div className={`relative w-full max-w-lg mx-4 bg-surface rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-surface-container-low/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="p-8">
                    <h2 className="font-noto-serif text-2xl font-black leading-tight mb-6 mt-2">Add New Book</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-manrope text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Title</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-surface-container py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" placeholder="The Great Gatsby" />
                        </div>
                        <div>
                            <label className="block font-manrope text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Author</label>
                            <input required name="author" value={formData.author} onChange={handleChange} className="w-full bg-surface-container py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" placeholder="F. Scott Fitzgerald" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-manrope text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Genre/Tag</label>
                                <input required name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-surface-container py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Classics" />
                            </div>
                            <div className="flex-1">
                                <label className="block font-manrope text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Pages</label>
                                <input required type="number" name="pages" value={formData.pages} onChange={handleChange} className="w-full bg-surface-container py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" placeholder="218" />
                            </div>
                        </div>
                        <div>
                            <label className="block font-manrope text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Image URL</label>
                            <input required name="src" value={formData.src} onChange={handleChange} className="w-full bg-surface-container py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block font-manrope text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-surface-container py-3 px-4 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="A stunning portrait of the Jazz Age..."></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full mt-4 py-3 px-4 rounded-xl font-manrope text-[11px] font-bold uppercase tracking-widest transition-all ${isSubmitting ? 'bg-outline text-white' : 'bg-primary text-white hover:scale-[1.02] shadow-md hover:shadow-lg'}`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add to Catalog'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
