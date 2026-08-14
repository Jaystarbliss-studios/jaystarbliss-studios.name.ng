const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

// For Resources
const oldRes = `                    const qs = await getDocs(query(
                        collection(db,'personalResources'),
                        where('studentId','==',studentId)
                    ));
                    allResources = [];
                    qs.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });`;

const newRes = `                    allResources = [];
                    // 1. Personal Resources
                    const qsPersonal = await getDocs(query(collection(db,'personalResources'), where('studentId','==',studentId)));
                    qsPersonal.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File (Personal)',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    
                    // 2. General Resources
                    const qsGeneral = await getDocs(collection(db,'resources'));
                    qsGeneral.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File (General)',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    
                    // 3. School Resources
                    if (window._jdh_studentData && window._jdh_studentData.schoolId) {
                        const qsSchool = await getDocs(query(collection(db,'schoolResources'), where('schoolId','==',window._jdh_studentData.schoolId)));
                        qsSchool.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File (School)',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    }`;

html = html.replace(oldRes, newRes);

// For Links
const oldLinks = `                    const qs = await getDocs(query(
                        collection(db,'personalLinks'),
                        where('studentId','==',studentId)
                    ));
                    allLinks = [];
                    qs.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link',_btn:'open-btn',_url:data.url,_label:'↗ Open Link'}); });`;

const newLinks = `                    allLinks = [];
                    // 1. Personal Links
                    const qsPersonal = await getDocs(query(collection(db,'personalLinks'), where('studentId','==',studentId)));
                    qsPersonal.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link (Personal)',_btn:'open-btn',_url:data.url,_label:'↗ Open Link'}); });
                    
                    // 2. General Links
                    const qsGeneral = await getDocs(collection(db,'links'));
                    qsGeneral.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link (General)',_btn:'open-btn',_url:data.url,_label:'↗ Open Link'}); });
                    
                    // 3. School Links
                    if (window._jdh_studentData && window._jdh_studentData.schoolId) {
                        const qsSchool = await getDocs(query(collection(db,'schoolLinks'), where('schoolId','==',window._jdh_studentData.schoolId)));
                        qsSchool.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link (School)',_btn:'open-btn',_url:data.url,_label:'↗ Open Link'}); });
                    }`;

html = html.replace(oldLinks, newLinks);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
console.log("Updated resources and links fetches");
