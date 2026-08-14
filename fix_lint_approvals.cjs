const fs = require('fs');

let adminFile = fs.readFileSync('/app/applet/src/pages/admin/AdminApprovals.tsx', 'utf8');
adminFile = adminFile.replace('getDocs, doc', 'doc');
adminFile = adminFile.replace('import { CheckCircle, XCircle, Clock } from \'lucide-react\';\n', '');
fs.writeFileSync('/app/applet/src/pages/admin/AdminApprovals.tsx', adminFile, 'utf8');

let parentFile = fs.readFileSync('/app/applet/src/pages/portal/ParentDashboard.tsx', 'utf8');
parentFile = parentFile.replace('GraduationCap, FileText, Calendar, Award', 'GraduationCap, FileText, Calendar');
fs.writeFileSync('/app/applet/src/pages/portal/ParentDashboard.tsx', parentFile, 'utf8');

let staffFile = fs.readFileSync('/app/applet/src/pages/portal/StaffDashboard.tsx', 'utf8');
staffFile = staffFile.replace('db, auth', 'db');
staffFile = staffFile.replace('BookOpen, Users, Calendar, FileText', 'Users, Calendar, FileText');
fs.writeFileSync('/app/applet/src/pages/portal/StaffDashboard.tsx', staffFile, 'utf8');

console.log('Fixed lint issues');
