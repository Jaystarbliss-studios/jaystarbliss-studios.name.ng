const fs = require('fs');
let file = fs.readFileSync('src/components/home/AudiencePathways.tsx', 'utf8');
file = file.replace(/title: 'TUTORS',[\s\S]*?ctaLink: '\/contact'/g, `title: 'TUTORS',\n    description: 'Join a learning environment where teaching, practical skills and student development come together.',\n    icon: <UserCircle size={32} className="text-brand-red mb-4" />,\n    ctaText: 'BECOME A TUTOR',\n    ctaLink: '/register'`);
fs.writeFileSync('src/components/home/AudiencePathways.tsx', file);
