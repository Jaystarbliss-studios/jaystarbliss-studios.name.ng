import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'inquiries')).then(snapshot => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status, updatedAt: new Date().toISOString() });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Inquiries & Leads</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage contact requests and applications.</p>
      </div>
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type / Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <tr><td colSpan={3} className="px-6 py-12 text-center">Loading...</td></tr> : 
             inquiries.length === 0 ? <tr><td colSpan={3} className="px-6 py-12 text-center">No inquiries found.</td></tr> :
             inquiries.map(i => (
               <tr key={i.id} className="hover:bg-gray-50 dark:bg-slate-950">
                 <td className="px-6 py-4">
                   <div className="font-medium text-gray-900 dark:text-white">{i.name}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{i.email}</div>
                 </td>
                 <td className="px-6 py-4 text-sm max-w-xs">
                   <span className="font-semibold text-brand-slate dark:text-white text-xs mb-1 block">{i.type}</span>
                   <p className="text-gray-500 dark:text-gray-400 truncate">{i.message}</p>
                 </td>
                 <td className="px-6 py-4">
                   <select 
                     value={i.status || 'NEW'} 
                     onChange={(e) => updateStatus(i.id, e.target.value)}
                     className="text-sm border rounded p-1 bg-white dark:bg-slate-900 dark:border-slate-800"
                   >
                     <option value="NEW">New</option>
                     <option value="REVIEWING">Reviewing</option>
                     <option value="RESPONDED">Responded</option>
                     <option value="CLOSED">Closed</option>
                   </select>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminInquiries;
