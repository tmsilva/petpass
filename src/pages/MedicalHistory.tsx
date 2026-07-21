import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Activity, Plus, Search, Filter, Edit2, Trash2, Calendar, FileText, Weight, Thermometer } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { generateId } from '../lib/utils';
import { format } from 'date-fns';
import { MedicalRecord } from '../types';

export default function MedicalHistory() {
  const { medicalRecords, pets, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPet = searchParams.get('pet') || '';
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({});

  const filteredRecords = medicalRecords.filter(r => 
    (selectedPet ? r.petId === selectedPet : true) &&
    ((r.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pets.find(p => p.id === r.petId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenModal = (record?: MedicalRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData({
        petId: selectedPet || (pets.length > 0 ? pets[0].id : ''),
        type: 'Consultation',
        date: format(new Date(), 'yyyy-MM-dd'),
        diagnosis: '',
        notes: '',
        weight: undefined,
        temperature: undefined
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (editingRecord) {
      updateMedicalRecord(formData as MedicalRecord);
    } else {
      addMedicalRecord({
        ...(formData as Omit<MedicalRecord, 'id'>),
        id: generateId()
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteMedicalRecord(id);
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      Consultation: 'Consulta',
      Surgery: 'Cirurgia',
      Hospitalization: 'Internação',
      Exam: 'Exame',
      Other: 'Outro'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Histórico Médico</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Consultas, cirurgias e exames</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3AB09E] text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-teal-200"
        >
          <Plus className="w-5 h-5" />
          Novo Registro
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar no histórico..."
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
      {filteredRecords.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Nenhum registro médico</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Guarde aqui o histórico de saúde dos seus pets para consultas futuras.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecords.map((record) => {
            const pet = pets.find(p => p.id === record.petId);
            return (
              <div key={record.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(record)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(record.id)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-16 h-16 shrink-0 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                          {getTypeLabel(record.type)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(record.date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-slate-900">
                        {record.diagnosis || 'Atendimento Geral'}
                      </h3>
                      <p className="text-slate-500 font-medium">{pet?.name}</p>
                    </div>

                    {(record.weight || record.temperature) && (
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                        {record.weight && (
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                              <span className="font-bold">Kg</span>
                            </div>
                            <span className="font-medium">{record.weight} kg</span>
                          </div>
                        )}
                        {record.temperature && (
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                              <Thermometer className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{record.temperature} °C</span>
                          </div>
                        )}
                      </div>
                    )}

                    {record.notes && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRecord ? 'Editar Registro' : 'Novo Registro Médico'}>
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
                <option value="Consultation">Consulta</option>
                <option value="Surgery">Cirurgia</option>
                <option value="Hospitalization">Internação</option>
                <option value="Exam">Exame</option>
                <option value="Other">Outro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
            <input
              required
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Diagnóstico ou Motivo (Opcional)</label>
            <input
              type="text"
              value={formData.diagnosis || ''}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              placeholder="Ex: Checkup anual, Otite, Limpeza de tártaro..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="Ex: 5.5"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature || ''}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="Ex: 38.5"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Anotações do Veterinário</label>
            <textarea
              rows={4}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none"
              placeholder="Prescrições, recomendações, evolução clínica..."
            />
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
