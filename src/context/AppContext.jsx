import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProfile, MOCK_BOOKS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { doc, onSnapshot, setDoc, collection, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
    const { currentUser } = useAuth();

    const [profile, setProfile] = useState(initialProfile);
    const [library, setLibrary] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [books, setBooks] = useState([]);

    // 📚 GLOBAL BOOKS LISTENER
    useEffect(() => {
        if (!currentUser) return;

        const booksRef = collection(db, 'books');

        const unsubscribeBooks = onSnapshot(booksRef, async (snapshot) => {
            if (snapshot.empty) {
                try {
                    const batch = writeBatch(db);

                    MOCK_BOOKS.forEach((book) => {
                        const newBookRef = doc(booksRef, String(book.id));
                        batch.set(newBookRef, {
                            ...book,
                            id: String(book.id),
                            createdBy: 'system',
                            createdAt: new Date().toISOString()
                        });
                    });

                    await batch.commit();
                } catch (err) {
                    console.error("Batch seed failed.", err);
                }
            } else {
                const loadedBooks = snapshot.docs.map(docSnap => ({
                    id: String(docSnap.id),
                    ...docSnap.data()
                }));
                setBooks(loadedBooks);
            }
        });

        return () => unsubscribeBooks();
    }, [currentUser]);

    // 👤 USER DATA LISTENER
    useEffect(() => {
        if (!currentUser) return;

        const userDocRef = doc(db, 'users', currentUser.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfile(data.profile || initialProfile);
                setLibrary(data.library || []);
            } else {
                setDoc(userDocRef, {
                    profile: initialProfile,
                    library: []
                }, { merge: true });
            }
            setIsDataLoaded(true);
        }, (error) => {
            console.error("Firebase sync error:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // ✏️ UPDATE PROFILE
    const updateProfile = async (newProfile) => {
        setProfile(newProfile);

        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, { profile: newProfile }, { merge: true });
        }
    };

    // 📖 UPDATE BOOK STATUS
    const updateBookStatus = async (bookId, newStatus) => {
        let newLibrary = [...library];

        const existsIndex = newLibrary.findIndex(
            item => String(item.bookId) === String(bookId)
        );

        if (existsIndex >= 0) {
            const currentItem = newLibrary[existsIndex];
            const newProgress = newStatus === 'read' ? 100 : (currentItem.progress || 0);

            newLibrary[existsIndex] = {
                ...currentItem,
                status: newStatus,
                progress: newProgress
            };
        } else {
            newLibrary.push({
                bookId,
                status: newStatus,
                progress: 0,
                pagesRead: 0
            });
        }

        setLibrary(newLibrary);

        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, { library: newLibrary }, { merge: true });
        }
    };

    // ❌ REMOVE BOOK
    const removeBook = async (bookId) => {
        const newLibrary = library.filter(
            item => String(item.bookId) !== String(bookId)
        );

        setLibrary(newLibrary);

        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, { library: newLibrary }, { merge: true });
        }
    };

    // 🔍 HELPERS
    const getBookDetails = (bookId) =>
        books.find(b => String(b.id) === String(bookId));

    const openBookModal = (bookId) => setSelectedBookId(bookId);
    const closeBookModal = () => setSelectedBookId(null);

    // ➕ ADD BOOK (FIXED)
    const addBookToCatalog = async (bookData) => {
        try {
            if (!currentUser) {
                throw new Error("User not logged in");
            }

            const newBook = {
                ...bookData,
                createdBy: currentUser.uid,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'books'), newBook);

        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        }
    };

    // ✅ RETURN (THIS WAS MISSING)
    return (
        <AppContext.Provider value={{
            profile,
            setProfile: updateProfile,
            library,
            setLibrary,
            books,
            addBookToCatalog,
            updateBookStatus,
            removeBook,
            getBookDetails,
            selectedBookId,
            openBookModal,
            closeBookModal,
            isDataLoaded
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}