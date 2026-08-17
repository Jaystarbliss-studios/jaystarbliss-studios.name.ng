import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Loader2, GripVertical, Plus, Trash2, Shield } from 'lucide-react';

const AdminPageForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState({
    title: '',
    path: '',
    status: 'PUBLISHED'
  });

  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      getDoc(doc(db, 'pages', id)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPage({
            title: data.title || '',
            path: data.path || '',
            status: data.status || 'DRAFT'
          });
          setSections(data.sections || []);
        }
        setLoading(false);
      }).catch(() => { setError('Failed to load page'); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [id, isEditing]);

  const addSection = (type: string) => {
    setSections([...sections, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'HERO_ORB' ? { protected: true, title: 'Learn. Build. Create. Grow.' } : {},
      visible: true
    }]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        ...page,
        sections,
        updatedAt: new Date().toISOString()
      };

      if (isEditing && id) {
        await updateDoc(doc(db, 'pages', id), payload);
      } else {
        payload.createdAt = new Date().toISOString();
        const docId = page.path === '/' ? 'home' : page.path.replace('/', '');
        await setDoc(doc(db, 'pages', docId || 'new-page'), payload);
      }
      navigate('/admin/pages');
    } catch (err) {
      console.error(err);
      setError('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block w-8 h-8 text-brand-red" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/pages" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditing ? `Edit Page: ${page.title}` : 'Create New Page'}
        </h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Page Metadata */}
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">Page Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Title</label>
              <input type="text" value={page.title} onChange={e => setPage({...page, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Path URL</label>
              <input type="text" value={page.path} onChange={e => setPage({...page, path: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red font-mono" placeholder="/about" required disabled={id === 'home'} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Status</label>
              <select value={page.status} onChange={e => setPage({...page, status: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red">
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Builder */}
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold">Section Builder</h2>
            <div className="flex gap-2">
              <select 
                id="add-section-select"
                className="px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-sm"
              >
                <option value="TEXT">Text Section</option>
                <option value="TEXT_IMAGE">Text + Image</option>
                <option value="FEATURE_GRID">Feature Grid</option>
                <option value="PROGRAM_GRID">Program Grid</option>
                <option value="CTA">Call To Action</option>
              </select>
              <button 
                type="button" 
                onClick={() => addSection((document.getElementById('add-section-select') as HTMLSelectElement).value)}
                className="bg-brand-slate text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {sections.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                No sections added yet. Build your page layout here.
              </div>
            ) : (
              sections.map((section, index) => (
                <div key={section.id} className="flex gap-4 items-start bg-gray-50 dark:bg-slate-950 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
                  <div className="flex flex-col gap-1 mt-2 text-gray-400 cursor-move">
                    <button type="button" onClick={() => moveSection(index, 'up')} disabled={index === 0} className="hover:text-gray-700 disabled:opacity-30">▲</button>
                    <GripVertical size={20} />
                    <button type="button" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="hover:text-gray-700 disabled:opacity-30">▼</button>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-wider text-sm bg-brand-slate text-white px-2 py-1 rounded">
                          {section.type}
                        </span>
                        {section.type === 'HERO_ORB' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                            <Shield size={12} /> PROTECTED COMPONENT
                          </span>
                        )}
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={() => removeSection(index)}
                        disabled={section.type === 'HERO_ORB'}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {section.type !== 'HERO_ORB' ? (
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-500">
                        Content editing for {section.type} is mapped via the frontend component engine.
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-500">
                        This section contains the official animated logo hero and cannot be modified or deleted directly to preserve brand integrity.
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg shadow-brand-red/20 flex items-center gap-2">
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? 'SAVING...' : 'SAVE PAGE CONFIGURATION'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPageForm;
