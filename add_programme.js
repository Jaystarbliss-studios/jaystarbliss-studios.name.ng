const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const tabHtml = `
    <div id="programmeApprovals" class="tab-content">
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">
            <span class="material-symbols-outlined">fact_check</span>
            Programme Approvals
            <span class="live-dot"></span>
          </span>
        </div>
        <div class="panel-body">
          <div class="info-box">
            <strong>📋 Programme Approvals:</strong> Review and approve educational programmes submitted by tutors.
          </div>
          <div class="overflow-x-auto mt-4">
            <table id="approvalsTable" class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-high text-on-surface text-sm">
                  <th class="p-3 border-b border-outline-variant rounded-tl-lg">Student ID</th>
                  <th class="p-3 border-b border-outline-variant">Tutor ID</th>
                  <th class="p-3 border-b border-outline-variant">Status</th>
                  <th class="p-3 border-b border-outline-variant rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="4" class="p-6 text-center text-on-surface-variant italic bg-surface-container-low rounded-b-lg">No pending approvals found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div id="studentRequests"`;

code = code.replace(/<div id="studentRequests"/, tabHtml);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
