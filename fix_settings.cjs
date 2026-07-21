const fs = require('fs');

let content = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

const importContent = `
  const { user } = useStore();
  const navigate = useNavigate();

  const handleExportData = () => {
    const store = useStore.getState();
    const data = {
      pets: store.pets,
      vaccines: store.vaccines,
      medicalRecords: store.medicalRecords,
      medications: store.medications,
      documents: store.documents,
      contacts: store.contacts
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`petpass-backup-\${new Date().toISOString().split('T')[0]}.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const store = useStore.getState();
        
        if (data.pets) {
          for (const pet of data.pets) {
            if (!store.pets.find((p: any) => p.id === pet.id)) {
              await store.addPet(pet);
            }
          }
        }
        if (data.vaccines) {
          for (const item of data.vaccines) {
            if (!store.vaccines.find((i: any) => i.id === item.id)) {
              await store.addVaccine(item);
            }
          }
        }
        if (data.medicalRecords) {
          for (const item of data.medicalRecords) {
            if (!store.medicalRecords.find((i: any) => i.id === item.id)) {
              await store.addMedicalRecord(item);
            }
          }
        }
        if (data.medications) {
          for (const item of data.medications) {
            if (!store.medications.find((i: any) => i.id === item.id)) {
              await store.addMedication(item);
            }
          }
        }
        if (data.documents) {
          for (const item of data.documents) {
            if (!store.documents.find((i: any) => i.id === item.id)) {
              await store.addDocument(item);
            }
          }
        }
        if (data.contacts) {
          for (const item of data.contacts) {
            if (!store.contacts.find((i: any) => i.id === item.id)) {
              await store.addContact(item);
            }
          }
        }
        alert("Dados importados com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao importar arquivo. Verifique o formato.");
      }
    };
    reader.readAsText(file);
  };
`;

content = content.replace("import { LogOut, User, Bell, Shield, Moon, Download, Trash2 } from 'lucide-react';", "import { LogOut, User, Bell, Shield, Moon, Download, Trash2, Upload } from 'lucide-react';");
content = content.replace("  const { user } = useStore();\n  const navigate = useNavigate();", importContent);

const buttonsContent = `
          <button onClick={handleExportData} className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">
            <div className="w-12 h-12 rounded-2xl bg-slate-100  flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Download className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 ">Exportar Dados</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Baixar backup em JSON</p>
            </div>
          </button>

          <div className="relative">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <button className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">
              <div className="w-12 h-12 rounded-2xl bg-slate-100  flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 ">Importar Dados</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Restaurar backup do JSON</p>
              </div>
            </button>
          </div>
`;

content = content.replace(/<button className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">[\s\S]*?Baixar backup em PDF ou JSON<\/p>\s*<\/div>\s*<\/button>/, buttonsContent);

fs.writeFileSync('src/pages/Settings.tsx', content, 'utf8');
console.log("Success Settings Update");
