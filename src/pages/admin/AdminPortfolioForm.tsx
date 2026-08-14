import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AdminPortfolioForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({ title: '', slug: '', client: '', category: '', description: '', liveUrl: '', status: 'DRAFT', isFeatured: false });

  useEffect(() => {
    if (isEditing && id) {
      getDoc(doc(db, 'portfolio', id)).then(snap => {
        if (snap.exists()) setFormData(snap.data() as any);
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = { ...formData, updatedAt: new Date().toISOString() };
    if (isEditing && id) await updateDoc(doc(db, 'portfolio', id), payload);
    else { payload.createdAt = new Date().toISOString(); await addDoc(collection(db, 'portfolio'), payload); }
    navigate('/admin/portfolio');
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/portfolio" className="text-gray-400 hover:text-gray-900 dark:text-white"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'New Project'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Slug</label><input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Client</label><input type="text" name="client" value={formData.client} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Live URL</label><input type="text" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
        <div className="flex gap-8">
          <div><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="px-4 py-2 border rounded-lg"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
          <div className="flex items-center pt-6"><label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded text-brand-red" /><span>Featured Project</span></label></div>
        </div>
        <div className="pt-4 border-t"><button type="submit" disabled={saving} className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">{saving ? 'Saving...' : 'Save Project'}</button></div>
      </form>
    </div>
  );
};
export default AdminPortfolioForm;
