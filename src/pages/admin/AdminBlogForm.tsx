import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminBlogForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '', 
    author: '',
    featuredImage: '',
    excerpt: '', 
    content: '', 
    status: 'DRAFT' 
  });

  useEffect(() => {
    if (isEditing && id) {
      getDoc(doc(db, 'blog', id)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            author: data.author || '',
            featuredImage: data.featuredImage || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            status: data.status || 'DRAFT'
          });
        }
        setLoading(false);
      }).catch(() => { setError('Failed to load'); setLoading(false); });
    }
  }, [id, isEditing]);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...formData, updatedAt: new Date().toISOString() };
      if (isEditing && id) {
        await updateDoc(doc(db, 'blog', id), payload);
      } else {
        payload.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'blog'), payload);
      }
      navigate('/admin/blog');
    } catch { setError('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block w-8 h-8 text-brand-red" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/blog" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><ArrowLeft size={24} /></Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Blog Post' : 'Create New Post'}</h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="e.g. 10 Reasons to Learn Coding" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">URL Slug *</label>
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="e.g. 10-reasons-to-learn-coding" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Author</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="e.g. Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red">
              <option value="DRAFT">Draft (Hidden)</option>
              <option value="PUBLISHED">Published (Public)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Featured Image URL</label>
          <input type="url" name="featuredImage" value={formData.featuredImage} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="https://example.com/image.jpg" />
          {formData.featuredImage && (
            <div className="mt-4 aspect-[21/9] w-full max-w-lg rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
              <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Excerpt (Short Summary)</label>
          <textarea name="excerpt" rows={3} value={formData.excerpt} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red resize-none" placeholder="A brief summary of the article..." />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Content</label>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
            <ReactQuill theme="snow" value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} className="h-[400px] mb-12 text-black" />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-slate-800 flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-70 flex items-center gap-2">
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? 'SAVING...' : isEditing ? 'UPDATE POST' : 'PUBLISH POST'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogForm;
