const fs = require('fs');
const path = '/app/applet/src/components/admin/AdminLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

const newNav = `
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Resources', href: '/admin/resources', icon: FileText },
    { name: 'Exams', href: '/admin/exams', icon: BookOpen },
    { name: 'Links', href: '/admin/links', icon: FolderOpen },
    { name: 'Schools', href: '/admin/schools', icon: Users },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Staff & Tutors', href: '/admin/staff', icon: Users },
    { name: 'Approvals', href: '/admin/approvals', icon: MessageSquare },
    { name: 'Payments', href: '/admin/payments', icon: Briefcase },
    { name: 'Programs', href: '/admin/programs', icon: BookOpen },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
`;

content = content.replace(/const navigation = \[[\s\S]*?\];/, newNav.trim());
fs.writeFileSync(path, content, 'utf8');
console.log('Updated AdminLayout.tsx navigation');
