import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'blog'),
          where('status', '==', 'PUBLISHED'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <SEO title="Blog" description="Insights, tutorials and tech news." />
      <div className="bg-brand-slate text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            BLOG & INSIGHTS
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
            Articles, thoughts, and technical insights from the Jaystarbliss team.
          </p>
        </div>
      </div>

      <div className="py-24 bg-brand-neutral dark:bg-slate-950 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState 
              title="No Posts Found" 
              description="Check back later for new insights and articles from our team."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                  <Card hoverEffect className="h-full border-0 ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                    {post.featuredImage ? (
                      <div className="aspect-[16/9] w-full overflow-hidden">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Jaystarbliss</span>
                      </div>
                    )}
                    <CardContent className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 tracking-wider uppercase flex-wrap">
                        {post.createdAt && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        )}
                        {post.author && (
                          <div className="flex items-center gap-1.5">
                            <User size={14} />
                            {post.author}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-brand-slate dark:text-white mb-4 group-hover:text-brand-red transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium line-clamp-3 mb-6 flex-grow">
                        {post.excerpt}
                      </p>
                      <span className="text-brand-red font-bold text-sm uppercase tracking-wider group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors mt-auto">
                        READ ARTICLE &rarr;
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Blog;
