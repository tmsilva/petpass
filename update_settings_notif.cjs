const fs = require('fs');

let content = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

const modalContent = `
  const [showNotifModal, setShowNotifModal] = useState(false);
`;

content = content.replace("  const [showProfileModal, setShowProfileModal] = useState(false);", modalContent + "\n  const [showProfileModal, setShowProfileModal] = useState(false);");

content = content.replace(/<button className="w-full flex items-center gap-5 p-4 hover:bg-white rounded-2xl transition-colors text-left group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">\s*<div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary\/10 group-hover:text-primary transition-colors">\s*<Bell className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" \/>\s*<\/div>\s*<div className="flex-1">\s*<p className="font-bold text-slate-900">Notificações<\/p>\s*<p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Avisos de vacinas e remédios<\/p>\s*<\/div>\s*<\/button>/, 
`<button onClick={() => setShowNotifModal(true)} className="w-full flex items-center gap-5 p-4 hover:bg-white rounded-2xl transition-colors text-left group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Bell className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Notificações</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Avisos de vacinas e remédios</p>
            </div>
          </button>`);
          
const returnEnd = content.indexOf("    </div>\n  );\n}");

const modalHtml = `
      {showNotifModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notificações</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Configure seus alertas</p>
              </div>
              <button onClick={() => setShowNotifModal(false)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Lembretes de Vacinas</h3>
                  <p className="text-xs text-slate-500">Avisar quando a vacina estiver próxima do vencimento.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Lembretes de Remédios</h3>
                  <p className="text-xs text-slate-500">Avisar no horário de dar o remédio para o pet.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Novidades</h3>
                  <p className="text-xs text-slate-500">Receber dicas e novidades sobre cuidados com pets.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowNotifModal(false)} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-cyan-200">
                  Concluído
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

content = content.substring(0, returnEnd) + modalHtml + content.substring(returnEnd);

fs.writeFileSync('src/pages/Settings.tsx', content, 'utf8');
console.log("Success update notif modal");
