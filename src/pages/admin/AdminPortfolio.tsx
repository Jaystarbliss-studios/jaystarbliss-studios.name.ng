import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPortfolio: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'portfolio')).then(snapshot => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage past work and case studies.</p>
        </div>
        <Link to="/admin/portfolio/new" className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
          <Plus size={16} /> Add Project
        </Link>
      </div>
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center">Loading...</td></tr> : 
             projects.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center">No projects found.</td></tr> :
             projects.map(p => (
               <tr key={p.id} className="hover:bg-gray-50 dark:bg-slate-950">
                 <td className="px-6 py-4"><div className="font-medium text-gray-900 dark:text-white">{p.title}</div></td>
                 <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{p.client}</td>
                 <td className="px-6 py-4"><span className={`px-2 text-xs rounded-full ${p.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.status}</span></td>
                 <td className="px-6 py-4 text-right text-sm font-medium"><Link to={`/admin/portfolio/${p.id}`} className="text-brand-red">Edit</Link></td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminPortfolio;
