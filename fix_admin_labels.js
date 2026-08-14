const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

code = code.replace(/<strong>🏫 School-Specific Exams:<\/strong>/g, `<strong><i data-lucide="school" class="w-4 h-4 inline align-text-bottom mr-1"></i> School-Specific Exams:</strong>`);
code = code.replace(/<strong>🏫 School Resources &amp; Links:<\/strong>/g, `<strong><i data-lucide="school" class="w-4 h-4 inline align-text-bottom mr-1"></i> School Resources &amp; Links:</strong>`);
code = code.replace(/<strong>👤 Create Student Accounts:<\/strong>/g, `<strong><i data-lucide="user-plus" class="w-4 h-4 inline align-text-bottom mr-1"></i> Create Student Accounts:</strong>`);
code = code.replace(/<strong>👨‍🏫 Staff Registration:<\/strong>/g, `<strong><i data-lucide="user-plus" class="w-4 h-4 inline align-text-bottom mr-1"></i> Staff Registration:</strong>`);
code = code.replace(/<strong>🔗 Registration Link:<\/strong>/g, `<strong><i data-lucide="link" class="w-4 h-4 inline align-text-bottom mr-1"></i> Registration Link:</strong>`);
code = code.replace(/<strong>📚 General Staff Resources:<\/strong>/g, `<strong><i data-lucide="book-open" class="w-4 h-4 inline align-text-bottom mr-1"></i> General Staff Resources:</strong>`);
code = code.replace(/<option value="all_staff">👨‍🏫 All Staff Members<\/option>/g, `<option value="all_staff">All Staff Members</option>`);
code = code.replace(/<option value="link">🔗 Link<\/option>/g, `<option value="link">Link</option>`);
code = code.replace(/alert\('✅ Staff invitation created!\\n\\nSend to ' \+ name \+ ':\\nEmail: ' \+ email \+ '\\n🔑 Code: JAYSTAR2024\\n🔗 Link: ' \+ window\.location\.origin \+ '\/staff-register\.html'\);/g, `alert('Staff invitation created!\\n\\nSend to ' + name + ':\\nEmail: ' + email + '\\nCode: JAYSTAR2024\\nLink: ' + window.location.origin + '/staff-register.html');`);
code = code.replace(/<h3>👨‍🏫 /g, `<h3><i data-lucide="user-check" class="w-5 h-5 inline align-text-bottom mr-1 text-primary"></i> `);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
