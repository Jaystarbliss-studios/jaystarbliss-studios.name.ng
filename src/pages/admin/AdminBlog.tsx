import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'blog'));
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your articles and news.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/blog/new" className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            <Plus size={16} /> Add Post
          </Link>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No posts found.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:bg-slate-950">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{post.status || 'DRAFT'}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link to={`/admin/blog/${post.id}`} className="text-brand-red hover:text-red-900 mr-4">Edit</Link>
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
export default AdminBlog;
