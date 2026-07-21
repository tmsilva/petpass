import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { LogOut, User, Bell, Shield, Moon, Download, Trash2, Upload, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

export default function Settings() {

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
    a.download = `petpass-backup-${new Date().toISOString().split('T')[0]}.json`;
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




  
  const [showAboutModal, setShowAboutModal] = useState(false);

  const [showNotifModal, setShowNotifModal] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: newName
        });
      }
      useStore.getState().setUser({ ...user!, name: newName });
      setShowProfileModal(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const { user: _discard, ...rest } = {} as any; // to avoid duplicate variable names

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out max-w-2xl mx-auto pb-8">
      <div>
        <h1 className="text-5xl font-black text-slate-900  tracking-tighter">Ajustes</h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Gerencie sua conta e preferências</p>
      </div>
      
      <div className="bg-slate-50  border border-slate-100  rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-200  flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#18C3D6] to-[#45D6B0] flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-cyan-200 ">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 ">{user?.name || 'Usuário'}</h2>
            <p className="text-slate-500 font-medium text-sm">{user?.email || 'usuario@exemplo.com'}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-3">
          <button onClick={() => { setNewName(user?.name || ''); setShowProfileModal(true); }} className="w-full flex items-center gap-5 p-4 hover:bg-white rounded-2xl transition-colors text-left group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <User className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Perfil</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Alterar seu nome</p>
            </div>
          </button>

          <button onClick={() => setShowNotifModal(true)} className="w-full flex items-center gap-5 p-4 hover:bg-white rounded-2xl transition-colors text-left group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Bell className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Notificações</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Avisos de vacinas e remédios</p>
            </div>
          </button>
        </div>

        <div className="p-6 border-t border-slate-200  space-y-3 bg-white ">
          
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


          
          <button onClick={() => setShowAboutModal(true)} className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Info className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Sobre</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Versão e informações</p>
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-5 p-4 hover:bg-red-50 rounded-2xl transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100  flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-500">Sair da Conta</p>
            </div>
          </button>
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Editar Perfil</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Atualize suas informações</p>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Nome Completo</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 font-medium">O email é gerenciado pelo Google e não pode ser alterado aqui.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowProfileModal(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-cyan-200 disabled:opacity-50">
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}
