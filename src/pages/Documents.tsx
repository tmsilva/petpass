import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileText, Plus, Search, Filter, Edit2, Trash2, Calendar, File, Upload, Loader2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { generateId } from '../lib/utils';
import { format } from 'date-fns';
import { Document } from '../types';

import { compressImage } from '../lib/resize_image';

export default function Documents() {
  const { user, documents, pets, addDocument, updateDocument, deleteDocument } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPet = searchParams.get('pet') || '';
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState<Partial<Document>>({});
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocuments = documents.filter(d => 
    (selectedPet ? d.petId === selectedPet : true) &&
    ((d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pets.find(p => p.id === d.petId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  const handleOpenModal = (doc?: Document) => {
    if (doc) {
      setEditingDocument(doc);
      setFormData(doc);
    } else {
      setEditingDocument(null);
      setFormData({
        petId: selectedPet || (pets.length > 0 ? pets[0].id : ''),
        name: '',
        type: 'Other',
        dateAdded: format(new Date(), 'yyyy-MM-dd'),
        fileUrl: ''
      });
    }
    setFileToUpload(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isUploading) return;
    setIsModalOpen(false);
    setEditingDocument(null);
    setFormData({});
    setFileToUpload(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    
    let fileUrl = formData.fileUrl;

    setIsUploading(true);
    try {
      if (fileToUpload) {
        if (fileToUpload.size > 1048576 && !fileToUpload.type.startsWith('image/')) {
           alert("O arquivo é muito grande (máximo 1MB). Por favor, escolha um arquivo menor.");
           setIsUploading(false);
           return;
        }
        fileUrl = await compressImage(fileToUpload, 0.8);
      }
      
      if (editingDocument) {
        await updateDocument({ ...formData, fileUrl } as Document);
      } else {
        await addDocument({
          ...(formData as Omit<Document, 'id'>),
          fileUrl,
          id: generateId()
        });
      }
      setIsModalOpen(false);
      setEditingDocument(null);
      setFormData({});
      setFileToUpload(null);
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Erro ao salvar o documento.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'RG': return 'RG / Identidade';
      case 'Vaccine Card': return 'Cartão de Vacina';
      case 'Other': return 'Outro';
      default: return type;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Documentos</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">RG, Pedigree, exames e laudos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Adicionar Documento
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-medium"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedPet}
            onChange={(e) => {
              if (e.target.value) {
                setSearchParams({ pet: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-medium appearance-none"
          >
            <option value="">Todos os Pets</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
        </div>
      </div>
      {filteredDocuments.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Nenhum documento anexado</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Guarde aqui os exames, receitas e documentos importantes dos seus pets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const pet = pets.find(p => p.id === doc.petId);
            return (
              <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(doc)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{doc.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{pet?.name} • {getTypeLabel(doc.type)}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{format(new Date(doc.dateAdded), 'dd/MM/yyyy')}</span>
                    </div>
                    {doc.fileUrl && (
                      <button onClick={() => {
                        if (doc.fileUrl?.startsWith('data:')) {
                          const a = document.createElement('a');
                          a.href = doc.fileUrl;
                          a.download = doc.name;
                          a.click();
                        } else {
                          window.open(doc.fileUrl, '_blank');
                        }
                      }} className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600">
                        <File className="w-4 h-4" />
                        Acessar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingDocument ? 'Editar Documento' : 'Novo Documento'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Pet</label>
              <select
                required
                value={formData.petId || ''}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              >
                <option value="" disabled>Selecione um pet</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label>
              <select
                required
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              >
                <option value="RG">RG / Identidade</option>
                <option value="Vaccine Card">Cartão de Vacina</option>
                <option value="Other">Outro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Documento</label>
            <input
              required
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              placeholder="Ex: Exame de Sangue, RG..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
            <input
              required
              type="date"
              value={formData.dateAdded || ''}
              onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Arquivo do Documento (Opcional)</label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">
                    {fileToUpload ? fileToUpload.name : 'Selecionar arquivo (PDF, JPG, PNG)'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileToUpload(e.target.files[0]);
                        setFormData({ ...formData, fileUrl: '' });
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-xs font-medium text-slate-400 uppercase">Ou cole o link</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              <input
                type="url"
                value={formData.fileUrl || ''}
                onChange={(e) => {
                  setFormData({ ...formData, fileUrl: e.target.value });
                  setFileToUpload(null);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isUploading}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
