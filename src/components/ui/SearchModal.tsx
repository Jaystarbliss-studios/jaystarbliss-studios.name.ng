import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'PROGRAM' | 'SERVICE' | 'PORTFOLIO' | 'BLOG';
  title: string;
  description: string;
  slug: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // All published documents cached for client-side search
  const [allDocs, setAllDocs] = useState<SearchResult[]>([]);
  const [docsLoaded, setDocsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      
      // Load docs if not already loaded
      if (!docsLoaded) {
        fetchAllPublishedDocs();
      }
    } else {
      document.body.style.overflow = 'auto';
      setSearchTerm('');
      setResults([]);
      setHasSearched(false);
    }
    
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, docsLoaded]);

  const fetchAllPublishedDocs = async () => {
    try {
      const [programsSnap, servicesSnap, portfolioSnap, blogSnap] = await Promise.all([
        getDocs(query(collection(db, 'programs'), where('status', '==', 'PUBLISHED'))),
        getDocs(query(collection(db, 'services'), where('status', '==', 'PUBLISHED'))),
        getDocs(query(collection(db, 'portfolio'), where('status', '==', 'PUBLISHED'))),
        getDocs(query(collection(db, 'blog'), where('status', '==', 'PUBLISHED')))
      ]);

      const docs: SearchResult[] = [];
      
      programsSnap.forEach(doc => {
        const data = doc.data();
        docs.push({ id: doc.id, type: 'PROGRAM', title: data.title, description: data.shortDescription || '', slug: `/programs/${data.slug}` });
      });
      
      servicesSnap.forEach(doc => {
        const data = doc.data();
        docs.push({ id: doc.id, type: 'SERVICE', title: data.title, description: data.shortDescription || '', slug: `/services/${data.slug}` });
      });
      
      portfolioSnap.forEach(doc => {
        const data = doc.data();
        docs.push({ id: doc.id, type: 'PORTFOLIO', title: data.title, description: data.description || '', slug: `/portfolio` }); // assuming portfolio uses ID
      });
      
      blogSnap.forEach(doc => {
        const data = doc.data();
        docs.push({ id: doc.id, type: 'BLOG', title: data.title, description: data.excerpt || '', slug: `/blog/${data.slug}` });
      });
      
      setAllDocs(docs);
      setDocsLoaded(true);
    } catch (err) {
      console.error('Error prefetching search docs:', err);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const term = searchTerm.toLowerCase();
    
    const filtered = allDocs.filter(doc => 
      doc.title.toLowerCase().includes(term) || 
      doc.description.toLowerCase().includes(term)
    );
    
    setResults(filtered.slice(0, 10)); // Limit to 10 results
  }, [searchTerm, allDocs]);

  if (!isOpen) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PROGRAM': return 'Program';
      case 'SERVICE': return 'Service';
      case 'PORTFOLIO': return 'Project';
      case 'BLOG': return 'Resource';
      default: return 'Page';
    }
  };

  const handleResultClick = (slug: string) => {
    onClose();
    navigate(slug);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-0 focus:ring-0 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
            placeholder="Search programs, services, resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-slate-800 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {!docsLoaded && searchTerm.length > 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group flex items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-red dark:text-red-400">
                          {getTypeLabel(result.type)}
                        </span>
                        <h4 className="text-base font-medium text-gray-900 dark:text-white truncate group-hover:text-brand-red transition-colors">
                          {result.title}
                        </h4>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-red transition-colors shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <p>No results found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try searching for something else.</p>
              </div>
            )
          ) : (
            <div className="py-8 px-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start typing to search across the platform
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md">Try "Coding"</span>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md">Try "Design"</span>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md">Try "Music"</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
