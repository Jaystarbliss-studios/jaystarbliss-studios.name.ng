import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPages: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pages'));
        let pagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Seed default pages if none exist
        if (pagesData.length === 0) {
          const defaultPages = [
            { id: 'home', title: 'Home', path: '/', status: 'PUBLISHED' },
            { id: 'about', title: 'About', path: '/about', status: 'PUBLISHED' },
            { id: 'contact', title: 'Contact', path: '/contact', status: 'PUBLISHED' }
          ];
          for (const p of defaultPages) {
            await setDoc(doc(db, 'pages', p.id), p);
          }
          pagesData = defaultPages;
        }
        
        setPages(pagesData);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pages (CMS)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage page content and sections.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/pages/new" className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            <Plus size={16} /> Add Page
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : pages.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No pages found.</td></tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 dark:bg-slate-950">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{page.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{page.id === 'home' ? 'Protected Hero Enabled' : 'Standard Page'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{page.path}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${page.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {page.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link to={`/admin/pages/${page.id}`} className="text-brand-red hover:text-red-900 dark:hover:text-red-400 flex items-center justify-end gap-1">
                      <Edit size={16} /> Edit Sections
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPages;
