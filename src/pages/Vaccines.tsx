import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Syringe, Plus, Search, Filter, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { generateId } from '../lib/utils';
import { format } from 'date-fns';
import { Vaccine } from '../types';

export default function Vaccines() {
  const { vaccines, pets, addVaccine, updateVaccine, deleteVaccine, user } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPet = searchParams.get('pet') || '';
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
  
  const [formData, setFormData] = useState<Partial<Vaccine>>({});

  const filteredVaccines = vaccines.filter(v => 
    (selectedPet ? v.petId === selectedPet : true) &&
    ((v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pets.find(p => p.id === v.petId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenModal = (vaccine?: Vaccine) => {
    if (vaccine) {
      setEditingVaccine(vaccine);
      setFormData(vaccine);
    } else {
      setEditingVaccine(null);
      setFormData({
        petId: selectedPet || (pets.length > 0 ? pets[0].id : ''),
        name: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        nextDueDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVaccine(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (editingVaccine) {
      updateVaccine(formData as Vaccine);
    } else {
      addVaccine({
        ...(formData as Omit<Vaccine, 'id'>),
        id: generateId()
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteVaccine(id);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Carteira de Vacinação</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Controle das vacinas dos seus pets</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9E3D] text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-200"
        >
          <Plus className="w-5 h-5" />
          Registrar Vacina
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar vacina..."
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
      {filteredVaccines.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Syringe className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Nenhuma vacina registrada</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Mantenha as vacinas em dia adicionando o histórico aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaccines.map((vaccine) => {
            const pet = pets.find(p => p.id === vaccine.petId);
            return (
              <div key={vaccine.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(vaccine)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(vaccine.id)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center">
                    <Syringe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{vaccine.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{pet?.name}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Aplicada: <strong className="text-slate-900">{format(new Date(vaccine.date), 'dd/MM/yyyy')}</strong></span>
                  </div>
                  {vaccine.nextDueDate && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>Próxima: <strong className="text-orange-500">{format(new Date(vaccine.nextDueDate), 'dd/MM/yyyy')}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingVaccine ? 'Editar Vacina' : 'Registrar Vacina'}>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Vacina</label>
            <input
              required
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              placeholder="Ex: V10, Antirrábica..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data da Aplicação</label>
              <input
                required
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Próxima Dose</label>
              <input
                type="date"
                value={formData.nextDueDate || ''}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
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
