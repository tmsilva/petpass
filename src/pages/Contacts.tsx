import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Phone, Plus, Search, Filter, Edit2, Trash2, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { generateId } from '../lib/utils';
import { Contact } from '../types';

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Partial<Contact>>({});

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData(contact);
    } else {
      setEditingContact(null);
      setFormData({
        name: '',
        type: 'Veterinarian',
        phone: '',
        whatsapp: '',
        email: '',
        address: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) return;
    
    if (editingContact) {
      updateContact(formData as Contact);
    } else {
      addContact({
        ...(formData as Omit<Contact, 'id'>),
        id: generateId()
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      Veterinarian: 'Veterinário(a)',
      Clinic: 'Clínica',
      Hospital: 'Hospital',
      PetShop: 'Pet Shop',
      PetSitter: 'Pet Sitter',
      Kennel: 'Canil',
      Hotel: 'Hotelzinho'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Contatos</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Veterinários, clínicas e parceiros</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-rose-200"
        >
          <Plus className="w-5 h-5" />
          Novo Contato
        </button>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-medium"
          />
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Nenhum contato salvo</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Adicione os contatos importantes para ter sempre à mão.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(contact)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(contact.id)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{contact.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{getTypeLabel(contact.type)}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                {contact.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors font-medium">{contact.phone}</a>
                  </div>
                )}
                {contact.whatsapp && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors font-medium">{contact.whatsapp}</a>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors font-medium">{contact.email}</a>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingContact ? 'Editar Contato' : 'Novo Contato'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Contato ou Local</label>
              <input
                required
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="Ex: Dra. Ana, Clínica São Francisco..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label>
              <select
                required
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              >
                <option value="Veterinarian">Veterinário(a)</option>
                <option value="Clinic">Clínica</option>
                <option value="Hospital">Hospital</option>
                <option value="PetShop">Pet Shop</option>
                <option value="PetSitter">Pet Sitter</option>
                <option value="Kennel">Canil</option>
                <option value="Hotel">Hotelzinho</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="(00) 0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="(00) 90000-0000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Endereço Completo</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              placeholder="Rua, Número, Bairro, Cidade"
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
