const fs = require('fs');

let content = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

const importContent = `import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { LogOut, User, Bell, Shield, Moon, Download, Trash2, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';`;

content = content.replace(/import React from 'react';[\s\S]*?import { logout } from '\.\.\/lib\/firebase';/, importContent);

const modalContent = `
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
`;

content = content.replace("  const handleLogout = async () => {", modalContent + "\n  const handleLogout = async () => {");

content = content.replace(/<button className="w-full flex items-center gap-5 p-4 hover:bg-white rounded-2xl transition-colors text-left group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">\s*<div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary\/10 group-hover:text-primary transition-colors">\s*<User className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" \/>\s*<\/div>\s*<div className="flex-1">\s*<p className="font-bold text-slate-900">Perfil<\/p>\s*<p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Alterar nome, email e senha<\/p>\s*<\/div>\s*<\/button>/, 
`<button onClick={() => { setNewName(user?.name || ''); setShowProfileModal(true); }} className="w-full flex items-center gap-5 p-4 hover:bg-white rounded-2xl transition-colors text-left group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <User className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Perfil</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Alterar seu nome</p>
            </div>
          </button>`);
          
const returnEnd = content.indexOf("    </div>\n  );\n}");

const modalHtml = `
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
`;

content = content.substring(0, returnEnd) + modalHtml + content.substring(returnEnd);

fs.writeFileSync('src/pages/Settings.tsx', content, 'utf8');
console.log("Success update modal settings");
