import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';

const AdminPortfolioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '', 
    portfolioType: 'CLIENT_WORK', 
    client: '', 
    studentName: '', 
    programId: '', 
    category: '', 
    description: '', 
    liveUrl: '', 
    status: 'DRAFT', 
    isFeatured: false 
  });

  useEffect(() => {
    if (isEditing && id) {
      getDoc(doc(db, 'portfolio', id)).then(snap => {
        if (snap.exists()) setFormData({ portfolioType: 'CLIENT_WORK', ...snap.data() } as any);
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...formData, updatedAt: new Date().toISOString() };
      if (!isEditing) (data as any).createdAt = new Date().toISOString();
      if (isEditing) await updateDoc(doc(db, 'portfolio', id!), data);
      else await addDoc(collection(db, 'portfolio'), data);
      navigate('/admin/portfolio');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-red" size={32} /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/portfolio" className="text-gray-400 hover:text-gray-900 dark:text-white"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'New Project'}</h1>
      </div>
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Portfolio Type</label>
            <select name="portfolioType" value={formData.portfolioType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white">
              <option value="CLIENT_WORK">Client Work (B2B)</option>
              <option value="STUDENT_WORK">Student Work (Academy)</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium mb-1">Slug</label><input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
          
          {formData.portfolioType === 'CLIENT_WORK' ? (
            <div><label className="block text-sm font-medium mb-1">Client</label><input type="text" name="client" value={formData.client} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
          ) : (
            <>
              <div><label className="block text-sm font-medium mb-1">Student Name</label><input type="text" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
              <div><label className="block text-sm font-medium mb-1">Program ID</label><input type="text" name="programId" value={formData.programId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
            </>
          )}

          <div className={formData.portfolioType === 'CLIENT_WORK' ? '' : 'col-span-2'}><label className="block text-sm font-medium mb-1">Category</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Live URL</label><input type="text" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><ReactQuill theme="snow" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} className="bg-white text-black" /></div>
        <div className="flex gap-8">
          <div><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
          <div className="flex items-center pt-6"><label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded text-brand-red dark:bg-slate-900 dark:border-slate-700" /><span>Featured Project</span></label></div>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800"><button type="submit" disabled={saving} className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">{saving ? 'Saving...' : 'Save Project'}</button></div>
      </form>
    </div>
  );
};
export default AdminPortfolioForm;
