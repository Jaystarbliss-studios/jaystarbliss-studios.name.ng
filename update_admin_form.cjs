const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminProgramForm.tsx', 'utf8');

const target = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Program Title</label>
              <input 
                type="text" 
                name="title" 
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Slug (URL friendly)</label>
              <input 
                type="text" 
                name="slug" 
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input 
                type="text" 
                name="categoryId" 
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                placeholder="e.g. Web Development"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Format</label>
              <select
                name="deliveryFormat"
                value={formData.deliveryFormat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-900 dark:border-slate-800"
              >
                <option value="ONLINE">Online</option>
                <option value="PHYSICAL">Physical</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pricing</label>
              <input 
                type="text" 
                name="pricing" 
                value={formData.pricing}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                placeholder="e.g. ₦50,000"
              />
            </div>
          </div>`;

const replacement = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Program Title</label>
              <input 
                type="text" 
                name="title" 
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Slug (URL friendly)</label>
              <input 
                type="text" 
                name="slug" 
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              >
                <option value="">Select Category...</option>
                <option value="ACADEMICS">Academics</option>
                <option value="DIGITAL_AND_TECHNOLOGY">Digital & Technology</option>
                <option value="CREATIVE">Creative</option>
                <option value="MUSIC">Music</option>
                <option value="EXAM_PREPARATION">Exam Preparation</option>
                <option value="PERSONALIZED_LEARNING">Personalized Learning</option>
                <option value="SCHOOL_PROGRAMS">School Programs & Clubs</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Format</label>
              <select
                name="deliveryFormat"
                value={formData.deliveryFormat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              >
                <option value="ONLINE">Online</option>
                <option value="PHYSICAL">Physical</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Age Range / Audience</label>
              <input 
                type="text" 
                name="targetAudience" 
                value={formData.targetAudience || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                placeholder="e.g. Ages 5-11 or Senior Secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pricing</label>
              <input 
                type="text" 
                name="pricing" 
                value={formData.pricing}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                placeholder="e.g. ₦50,000 or Contact Us"
              />
            </div>
          </div>`;

if(content.includes('<input \n                type="text" \n                name="categoryId"')) {
    // try replacing differently if exact string match fails
    content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?placeholder="e\.g\. ₦50,000"\n              \/>\n            <\/div>\n          <\/div>/, replacement);
    fs.writeFileSync('src/pages/admin/AdminProgramForm.tsx', content);
    console.log('AdminProgramForm updated');
} else {
    console.log('Target not found, trying regex anyway');
    content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?placeholder="e\.g\. ₦50,000"\n              \/>\n            <\/div>\n          <\/div>/, replacement);
    fs.writeFileSync('src/pages/admin/AdminProgramForm.tsx', content);
}
