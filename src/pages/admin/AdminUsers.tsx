import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Shield, User, Download, Plus, X } from 'lucide-react';

const AdminUsers: React.FC = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STUDENT');
  const [inviteName, setInviteName] = useState('');
  const [inviting, setInviting] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Ensure you have SUPER_ADMIN permissions.');
    }
  };


  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await setDoc(doc(db, 'invites', inviteEmail.toLowerCase()), {
        email: inviteEmail.toLowerCase(),
        name: inviteName,
        role: inviteRole,
        createdAt: new Date().toISOString()
      });
      alert('User invited! When they sign in with Google, they will receive this role.');
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
    } catch (err) {
      console.error(err);
      alert('Failed to invite user.');
    } finally {
      setInviting(false);
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) return;
    const headers = Object.keys(users[0]).filter(k => typeof users[0][k] !== 'object');
    const csvContent = [
      headers.join(','),
      ...users.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Onboard New User</h2>
              <button onClick={() => setShowInviteModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name (Optional)</label>
                <input 
                  type="text" 
                  value={inviteName} 
                  onChange={e => setInviteName(e.target.value)} 
                  className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={inviteEmail} 
                  onChange={e => setInviteEmail(e.target.value)} 
                  className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700" 
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={inviteRole} 
                  onChange={e => setInviteRole(e.target.value)} 
                  className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value="USER">User (Default)</option>
                  <option value="STUDENT">Student</option>
                  <option value="PARENT">Parent</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="STAFF">Staff</option>
                  <option value="SCHOOL">School Admin</option>
                  <option value="CONTENT_ADMIN">Content Admin</option>
                  <option value="EDUCATION_ADMIN">Education Admin</option>
                  <option value="SERVICES_ADMIN">Services Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={inviting}
                className="w-full bg-brand-red text-white py-2 rounded-lg font-bold disabled:opacity-50"
              >
                {inviting ? 'Sending...' : 'Add User Invite'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users & Roles</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage user access and administrative roles.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> Onboard User
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">No users found. (This might be a permission issue)</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:bg-slate-950">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-500">
                        {user.role?.includes('ADMIN') ? <Shield size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.name || 'Anonymous User'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {user.accountType || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role || 'USER'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg p-1.5 bg-white dark:bg-slate-900 dark:border-slate-800 focus:ring-brand-red focus:border-brand-red font-medium"
                    >
                      <option value="USER">User (Default)</option>
                      <option value="STUDENT">Student</option>
                      <option value="PARENT">Parent</option>
                      <option value="TUTOR">Tutor</option>
                      <option value="SCHOOL">School Admin</option>
                      <option value="CONTENT_ADMIN">Content Admin</option>
                      <option value="EDUCATION_ADMIN">Education Admin</option>
                      <option value="SERVICES_ADMIN">Services Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
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

export default AdminUsers;
