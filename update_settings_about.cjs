const fs = require('fs');

let content = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

content = content.replace(
  "import { LogOut, User, Bell, Shield, Moon, Download, Trash2, Upload, X } from 'lucide-react';",
  "import { LogOut, User, Bell, Shield, Moon, Download, Trash2, Upload, X, Info } from 'lucide-react';"
);

const modalState = `
  const [showAboutModal, setShowAboutModal] = useState(false);
`;

content = content.replace(
  "const [showNotifModal, setShowNotifModal] = useState(false);",
  modalState + "\n  const [showNotifModal, setShowNotifModal] = useState(false);"
);

const aboutBtn = `
          <button onClick={() => setShowAboutModal(true)} className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Info className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Sobre</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Versão e informações</p>
            </div>
          </button>
`;

content = content.replace(
  /<button\s*onClick=\{handleLogout\}\s*className="w-full flex items-center gap-5 p-4 hover:bg-red-50 rounded-2xl transition-colors text-left group"\s*>/,
  aboutBtn + "\n          <button \n            onClick={handleLogout}\n            className=\"w-full flex items-center gap-5 p-4 hover:bg-red-50 rounded-2xl transition-colors text-left group\"\n          >"
);

const modalHtml = `
      {showAboutModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">PetPass</h2>
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-widest rounded-full mb-4">
              Fase Beta
            </div>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Versão 1.0.0-beta<br/>
              O aplicativo está em fase de testes. Algumas funcionalidades podem estar sujeitas a instabilidades.
            </p>
            <button onClick={() => setShowAboutModal(false)} className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-colors">
              Fechar
            </button>
          </div>
        </div>
      )}
`;

const returnEnd = content.indexOf("    </div>\n  );\n}");

content = content.substring(0, returnEnd) + modalHtml + content.substring(returnEnd);

fs.writeFileSync('src/pages/Settings.tsx', content, 'utf8');
console.log("Success update about modal");
