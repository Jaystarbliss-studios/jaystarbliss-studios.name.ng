import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Edit, ExternalLink, Layers, Sparkles, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CMS_PAGES } from '../../lib/cms';

const AdminPages: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pages'));
        const dbPages = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) }));
        
        // Merge registered CMS pages with DB entries
        const merged = CMS_PAGES.map(cmsPage => {
          const matched = dbPages.find(p => p.id === cmsPage.id) as Record<string, any> | undefined;
          return {
            id: cmsPage.id,
            title: cmsPage.title,
            path: cmsPage.path,
            description: cmsPage.description,
            sectionsCount: cmsPage.sections.length,
            status: matched?.status || 'PUBLISHED',
            ...matched
          };
        });

        // Ensure these entries exist in Firestore
        for (const p of merged) {
          await setDoc(doc(db, 'pages', p.id), {
            id: p.id,
            title: p.title,
            path: p.path,
            status: p.status,
            description: p.description
          }, { merge: true });
        }
        
        setPages(merged);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-slate dark:text-white flex items-center gap-3">
            <Layers className="text-brand-red w-8 h-8" />
            Website Pages & Section CMS
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Edit every title, description, image, and CTA button across all pages in Jaystarbliss Studios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ImageIcon size={16} className="text-brand-red" />
            Cloudinary Storage Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-20 text-center text-slate-400">Loading CMS Pages...</div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-xl font-black text-brand-slate dark:text-white group-hover:text-brand-red transition-colors flex items-center gap-2">
                      {page.title}
                    </h2>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {page.path}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={12} />
                    {page.status || 'PUBLISHED'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {page.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <Sparkles size={14} className="text-brand-red" />
                  <span>{page.sectionsCount || 4} Configurable Content Sections</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
                >
                  <ExternalLink size={14} />
                  Live Preview
                </a>

                <Link
                  to={`/admin/pages/${page.id}`}
                  className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm shadow-brand-red/20"
                >
                  <Edit size={14} />
                  Edit Page Sections
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPages;
