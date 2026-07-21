import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { PawPrint, ArrowLeft, Camera, QrCode, Share2, FileText, Syringe, Activity, Calendar, Pill } from 'lucide-react';
import { generateId, calculateAge } from '../lib/utils';
import { Pet } from '../types';
import QRCode from 'react-qr-code';
import { compressImage } from '../lib/resize_image';


export default function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, addPet, updatePet, deletePet, user } = useStore();
  const isNew = id === 'new';
  
  const existingPet = pets.find(p => p.id === id);
  
  const [formData, setFormData] = useState<Partial<Pet>>(
    existingPet || {
      species: 'Dog',
      gender: 'Male',
      isNeutered: false,
    }
  );
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    await deletePet(id!);
    navigate('/pets');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    let photoUrl = formData.photoUrl;

    setIsUploading(true);
    try {
      if (fileToUpload) {
        photoUrl = await compressImage(fileToUpload, 0.8);
      }
      
      if (isNew) {
        await addPet({
          ...(formData as Pet),
          photoUrl,
          id: generateId(),
          createdAt: new Date().toISOString(),
        });
      } else {
        await updatePet({
          ...(formData as Pet),
          photoUrl
        });
      }
      navigate('/pets');
    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Erro ao salvar o pet.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isNew && !existingPet) {
    return <div className="p-8 text-center">Pet não encontrado</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-8">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('/pets')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Meus Pets</span>
        </button>
      </div>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900  tracking-tighter">
            {isNew ? 'Novo Pet' : formData.name}
          </h1>
          {!isNew && formData.breed && (
            <p className="text-slate-400 font-medium mt-2 uppercase tracking-widest text-xs">
              {formData.breed} • {formData.birthDate ? calculateAge(formData.birthDate) : ''} • {formData.weight}kg
            </p>
          )}
        </div>
        {!isNew && (
          <div className="flex gap-4">
            <button onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }} className="px-6 py-3 bg-[#FF9E3D] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
              Ver QR Code
            </button>
            <button onClick={() => {
              if (navigator.share) {
                navigator.share({ title: formData.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado!');
              }
            }} className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white  border border-slate-100  rounded-[3rem] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-3xl bg-slate-50  flex items-center justify-center relative group overflow-hidden border-2 border-dashed border-slate-200 ">
                  {formData.photoUrl || fileToUpload ? (
                    <img src={fileToUpload ? URL.createObjectURL(fileToUpload) : formData.photoUrl} alt="Foto do pet" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFileToUpload(file);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-center text-slate-500 font-bold uppercase tracking-wider">Alterar Foto</p>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Nome do Pet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-slate-900 "
                    placeholder="Ex: Rex"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Espécie</label>
                  <select 
                    value={formData.species || 'Dog'}
                    onChange={e => setFormData({ ...formData, species: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900 "
                  >
                    <option value="Dog">Cachorro</option>
                    <option value="Cat">Gato</option>
                    <option value="Bird">Pássaro</option>
                    <option value="Other">Outro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Raça</label>
                  <input 
                    type="text" 
                    required
                    value={formData.breed || ''}
                    onChange={e => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900 "
                    placeholder="Ex: Golden Retriever"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Sexo</label>
                  <div className="flex gap-4 h-[46px]">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50  border border-slate-200  rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <input type="radio" name="gender" className="sr-only" checked={formData.gender === 'Male'} onChange={() => setFormData({...formData, gender: 'Male'})} />
                      <span className={`font-bold ${formData.gender === 'Male' ? 'text-primary' : 'text-slate-600 '}`}>Macho</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50  border border-slate-200  rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <input type="radio" name="gender" className="sr-only" checked={formData.gender === 'Female'} onChange={() => setFormData({...formData, gender: 'Female'})} />
                      <span className={`font-bold ${formData.gender === 'Female' ? 'text-primary' : 'text-slate-600 '}`}>Fêmea</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Nascimento</label>
                  <input 
                    type="date" 
                    required
                    value={formData.birthDate || ''}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900 "
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                    required
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900 "
                    placeholder="0.0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Cor</label>
                  <input 
                    type="text" 
                    required
                    value={formData.color || ''}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900 "
                    placeholder="Ex: Preto e Branco"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100  grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Microchip</label>
                <input 
                  type="text" 
                  value={formData.microchip || ''}
                  onChange={e => setFormData({ ...formData, microchip: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900  font-mono font-bold tracking-widest"
                  placeholder="Opcional"
                />
              </div>
              
              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-3 p-4 bg-slate-50  border border-slate-200  rounded-xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isNeutered || false}
                    onChange={e => setFormData({ ...formData, isNeutered: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="font-bold text-slate-700 ">Pet Castrado</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              {!isNew ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-4 text-rose-500 font-bold tracking-wide hover:bg-rose-50 rounded-2xl transition-colors"
                >
                  {showDeleteConfirm ? 'Confirmar Exclusão' : 'Excluir Pet'}
                </button>
              ) : <div></div>}
              <button 
                type="submit"
                disabled={isUploading}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold tracking-wide hover:bg-primary/90 transition-colors shadow-lg shadow-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Salvando...' : (isNew ? 'Cadastrar Pet' : 'Salvar Alterações')}
              </button>
            </div>
          </form>
        </div>

        {!isNew && (
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#18C3D6] to-[#45D6B0] p-8 rounded-[3rem] text-white">
              <p className="font-bold uppercase tracking-widest text-[10px] opacity-80 mb-4">QR Passaporte Digital</p>
              <div className="bg-white p-4 rounded-3xl mb-6 w-full aspect-square flex items-center justify-center relative">
                <QRCode value={window.location.href} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} fgColor="#18C3D6" />
                <div className="absolute flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100">
                    <PawPrint className="w-8 h-8 text-[#18C3D6]" />
                  </div>
                </div>
              </div>
              <p className="text-center font-bold text-sm leading-tight">Compartilhe os dados de {formData.name} com segurança em segundos.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Vacinas', icon: Syringe, color: 'text-orange-500', path: `/vaccines?pet=${id}` },
                { label: 'Histórico', icon: Activity, color: 'text-secondary', path: `/history?pet=${id}` },
                { label: 'Documentos', icon: FileText, color: 'text-indigo-500', path: `/documents?pet=${id}` },
                { label: 'Remédios', icon: Pill, color: 'text-rose-500', path: `/medications?pet=${id}` },
              ].map((item, idx) => (
                <button key={idx} onClick={() => navigate(item.path)} className="bg-slate-50  p-4 rounded-3xl border border-slate-100  flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors shadow-sm group">
                  <div className="w-12 h-12 rounded-2xl bg-white  flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 ">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
