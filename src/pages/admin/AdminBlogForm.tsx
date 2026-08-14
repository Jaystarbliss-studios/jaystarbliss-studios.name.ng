import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AdminBlogForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', status: 'DRAFT' });

  useEffect(() => {
    if (isEditing && id) {
      getDoc(doc(db, 'blog', id)).then(docSnap => {
        if (docSnap.exists()) setFormData(docSnap.data() as any);
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
    } catch (err) { setError('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/blog" className="text-gray-400 hover:text-gray-900 dark:text-white"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Post' : 'New Post'}</h1>
      </div>
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Slug</label><input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea name="excerpt" rows={2} value={formData.excerpt} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
        <div><label className="block text-sm font-medium mb-1">Content (Markdown/HTML)</label><textarea name="content" rows={10} value={formData.content} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
        <div><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="px-4 py-2 border rounded-lg"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
        <div className="pt-4 border-t"><button type="submit" disabled={saving} className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">{saving ? 'Saving...' : 'Save Post'}</button></div>
      </form>
    </div>
  );
};
export default AdminBlogForm;
