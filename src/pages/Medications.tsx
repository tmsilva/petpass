import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Pill, Plus, Search, Filter, Calendar, Edit2, Trash2, Clock } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { generateId } from '../lib/utils';
import { format } from 'date-fns';
import { Medication } from '../types';

export default function Medications() {
  const { medications, pets, addMedication, updateMedication, deleteMedication } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPet = searchParams.get('pet') || '';
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<Partial<Medication>>({});

  const filteredMedications = medications.filter(m => 
    (selectedPet ? m.petId === selectedPet : true) &&
    ((m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pets.find(p => p.id === m.petId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const handleOpenModal = (medication?: Medication) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData(medication);
    } else {
      setEditingMedication(null);
      setFormData({
        petId: selectedPet || (pets.length > 0 ? pets[0].id : ''),
        name: '',
        type: 'General',
        dosage: '',
        frequency: '',
        time: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (editingMedication) {
      updateMedication(formData as Medication);
    } else {
      addMedication({
        ...(formData as Omit<Medication, 'id'>),
        id: generateId()
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteMedication(id);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Medicamentos</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Controle de remédios, antipulgas e vermífugos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Novo Medicamento
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar medicamento..."
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
      {filteredMedications.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Pill className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Nenhum medicamento ativo</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Cadastre os medicamentos contínuos e tratamentos atuais.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((med) => {
            const pet = pets.find(p => p.id === med.petId);
            return (
              <div key={med.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(med)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(med.id)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{med.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{pet?.name} • {med.type}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Início: <strong className="text-slate-900">{format(new Date(med.startDate), 'dd/MM/yyyy')}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span><strong className="text-slate-900">{med.dosage}</strong>, {med.frequency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMedication ? 'Editar Medicamento' : 'Novo Medicamento'}>
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
                <option value="General">Geral</option>
                <option value="Dewormer">Vermífugo</option>
                <option value="FleaTick">Antipulgas/Carrapatos</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Medicamento</label>
            <input
              required
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              placeholder="Ex: Bravecto, NexGard..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Dose</label>
              <input
                required
                type="text"
                value={formData.dosage || ''}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="Ex: 1 comprimido"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Frequência</label>
              <input
                required
                type="text"
                value={formData.frequency || ''}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="Ex: A cada 12 horas"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Horário</label>
              <input
                required
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data Início</label>
              <input
                required
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data Fim (Opcional)</label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
