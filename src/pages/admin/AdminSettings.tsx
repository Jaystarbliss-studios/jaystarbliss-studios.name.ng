import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState({
    companyName: 'Jaystarbliss Studios',
    contactEmail: 'hello@jaystarbliss.com',
    contactPhone: '+234 123 456 7890',
    address: 'Lagos, Nigeria',
    heroHeading: 'LEARN. CREATE. INNOVATE.',
    heroSubheading: 'Empowering the next generation of digital creators.',
    twitter: '',
    linkedin: '',
    instagram: '',
    cloudinaryCloudName: 'jaystarbliss',
    cloudinaryUploadPreset: 'jaystarbliss_cms',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings(prev => ({ ...prev, ...data }));
        }

        // Also check if cloudinary specific settings exist
        const cloudRef = doc(db, 'settings', 'cloudinary');
        const cloudSnap = await getDoc(cloudRef);
        if (cloudSnap.exists()) {
          const cData = cloudSnap.data();
          setSettings(prev => ({
            ...prev,
            cloudinaryCloudName: cData.cloudName || prev.cloudinaryCloudName,
            cloudinaryUploadPreset: cData.uploadPreset || prev.cloudinaryUploadPreset,
            cloudinaryApiKey: cData.apiKey || prev.cloudinaryApiKey,
            cloudinaryApiSecret: cData.apiSecret || prev.cloudinaryApiSecret
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const user = auth.currentUser;
      const settingsRef = doc(db, 'settings', 'global');
      
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      }, { merge: true });

      // Save Cloudinary configuration specifically
      const cloudinaryRef = doc(db, 'settings', 'cloudinary');
      await setDoc(cloudinaryRef, {
        cloudName: settings.cloudinaryCloudName || 'jaystarbliss',
        uploadPreset: settings.cloudinaryUploadPreset || 'jaystarbliss_cms',
        apiKey: settings.cloudinaryApiKey || '',
        apiSecret: settings.cloudinaryApiSecret || '',
        updatedAt: serverTimestamp()
      }, { merge: true });

      localStorage.setItem('cloudinary_cloud_name', settings.cloudinaryCloudName);
      localStorage.setItem('cloudinary_upload_preset', settings.cloudinaryUploadPreset);
      if (settings.cloudinaryApiKey) localStorage.setItem('cloudinary_api_key', settings.cloudinaryApiKey);
      
      setMessage({ type: 'success', text: 'Global & Cloudinary settings updated successfully!' });
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-brand-slate mb-8">Global Settings</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-semibold">{message.text}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
        
        {/* Company Info */}
        <section>
          <h2 className="text-xl font-bold text-brand-slate border-b pb-2 mb-6">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Office Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>
        </section>

        {/* Hero Content */}
        <section>
          <h2 className="text-xl font-bold text-brand-slate border-b pb-2 mb-6">Homepage Hero Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Main Heading</label>
              <input
                type="text"
                name="heroHeading"
                value={settings.heroHeading}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-bold text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subheading</label>
              <textarea
                name="heroSubheading"
                value={settings.heroSubheading}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>
        </section>

        {/* Cloudinary Integration */}
        <section>
          <div className="flex items-center justify-between border-b pb-2 mb-6">
            <div>
              <h2 className="text-xl font-bold text-brand-slate dark:text-white">Cloudinary Image Storage & CDN</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure your Cloudinary credentials to upload and manage high-resolution images across all CMS pages.</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-brand-red/10 text-brand-red px-2.5 py-1 rounded-full">
              Active Storage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cloudinary Cloud Name</label>
              <input
                type="text"
                name="cloudinaryCloudName"
                value={settings.cloudinaryCloudName}
                onChange={handleChange}
                placeholder="e.g. jaystarbliss"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">Your Cloudinary account cloud name identifier.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Unsigned Upload Preset</label>
              <input
                type="text"
                name="cloudinaryUploadPreset"
                value={settings.cloudinaryUploadPreset}
                onChange={handleChange}
                placeholder="e.g. jaystarbliss_cms or ml_default"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">Created in Cloudinary Settings &gt; Upload &gt; Upload Presets (set to Unsigned).</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cloudinary API Key (Optional / Private)</label>
              <input
                type="text"
                name="cloudinaryApiKey"
                value={settings.cloudinaryApiKey}
                onChange={handleChange}
                placeholder="e.g. 123456789012345"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cloudinary API Secret (Optional)</label>
              <input
                type="password"
                name="cloudinaryApiSecret"
                value={settings.cloudinaryApiSecret}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red font-mono text-sm"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h2 className="text-xl font-bold text-brand-slate border-b pb-2 mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Twitter / X URL</label>
              <input
                type="url"
                name="twitter"
                value={settings.twitter}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={settings.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
