import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Calendar, ArrowLeft, User } from 'lucide-react';
import DOMPurify from 'dompurify';

const BlogPostDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'blog'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-brand-neutral dark:bg-slate-950">
          <Loader2 className="w-12 h-12 animate-spin text-brand-red" />
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-neutral dark:bg-slate-950 px-4 text-center">
          <h1 className="text-4xl font-bold text-brand-slate dark:text-white mb-6">Post Not Found</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
            We couldn't find the article you were looking for. It might have been moved or removed.
          </p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-brand-slate text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} />
            BACK TO BLOG
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="bg-brand-neutral dark:bg-slate-950 pb-24">
        {/* Hero Section */}
        {post.featuredImage ? (
          <div className="w-full h-[40vh] md:h-[60vh] relative">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 max-w-4xl pb-12 md:pb-20">
                <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors font-bold uppercase tracking-wider text-sm">
                  <ArrowLeft size={16} />
                  Back to Blog
                </Link>
                <div className="flex items-center gap-6 text-sm font-bold text-white/80 mb-6 uppercase tracking-wider">
                  {post.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  )}
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {post.author}
                    </div>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-brand-slate text-white pt-32 pb-24 px-4">
            <div className="container mx-auto max-w-4xl">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors font-bold uppercase tracking-wider text-sm">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
              <div className="flex items-center gap-6 text-sm font-bold text-white/60 mb-6 uppercase tracking-wider">
                {post.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                )}
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {post.author}
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-3xl py-16 md:py-24">
          <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-brand-red max-w-none">
            <div className="quill-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }} />
          </div>
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogPostDetails;
