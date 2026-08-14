let item = {_url: "http://example.com", title: "A", _type: "Link", _label: "View", timestamp: new Date()};
function fmtDate(d) { return 'now'; }
let iconHtml = 'html'; let btnIcon = 'icon';
let s = `
<div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group text-left">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        ${iconHtml}
        <div>
          <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">${item.title}</h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
            <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="tag" class="w-3 h-3"></i> ${item._type.replace(/[^A-Za-z ()]/g, '')}</span>
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${fmtDate(item.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
    ${item.description ? `<p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">${item.description}</p>` : ''}
    <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
      <button class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit bg-transparent border-none cursor-pointer" onclick="window.open('${item._url}','_blank')">
        <i data-lucide="${btnIcon}" class="w-4 h-4"></i> ${item._label.replace(/[^A-Za-z ]/g, '')}
      </button>
    </div>
</div>`;
console.log(s);
