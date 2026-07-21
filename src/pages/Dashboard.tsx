import React from 'react';
import { useStore } from '../store/useStore';
import { PawPrint, Syringe, Calendar, Pill, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { pets, vaccines, medicalRecords, medications } = useStore();
  const today = new Date();
  
  // Calculate stats
  const pendingVaccines = vaccines.filter(v => v.nextDueDate && isBefore(new Date(v.nextDueDate), addDays(today, 30)));
  const upcomingConsultations = medicalRecords.filter(r => isAfter(new Date(r.date), today));
  const activeMedications = medications.filter(m => !m.endDate || isAfter(new Date(m.endDate), today));

  const stats = [
    { label: 'Meus Pets', value: pets.length, icon: PawPrint, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Vacinas Próximas', value: pendingVaccines.length, icon: Syringe, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Consultas', value: upcomingConsultations.length, icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Remédios Ativos', value: activeMedications.length, icon: Pill, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const timelineEvents = [
    ...pendingVaccines.map(v => ({
      type: 'vaccine',
      title: `Vacinação: ${v.name}`,
      subtitle: v.clinic || v.veterinarian || 'Local não informado',
      date: new Date(v.nextDueDate!),
      icon: Syringe,
      color: 'bg-primary'
    })),
    ...upcomingConsultations.map(c => ({
      type: 'consultation',
      title: `Consulta: ${c.type}`,
      subtitle: c.diagnosis || c.notes || 'Detalhes não informados',
      date: new Date(c.date),
      icon: Calendar,
      color: 'bg-secondary'
    }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 4);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900  tracking-tighter">Resumo</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Visão geral da saúde dos seus pets</p>
        </div>
        <Link 
          to="/pets/new" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9E3D] text-white rounded-2xl font-bold shadow-lg shadow-orange-200  hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Adicionar Pet
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-50  p-6 rounded-[2rem] border border-slate-100  flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-black text-slate-900 ">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-900 ">Avisos Inteligentes</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pendingVaccines.length === 0 && activeMedications.length === 0 && (
              <div className="col-span-full p-8 text-center bg-slate-50  rounded-[2.5rem] border border-slate-100  border-dashed">
                <div className="w-12 h-12 bg-white  rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <PawPrint className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Tudo em dia! Nenhum aviso no momento.</p>
              </div>
            )}

            {pendingVaccines.slice(0, 2).map((vaccine) => {
              const pet = pets.find(p => p.id === vaccine.petId);
              return (
                <div key={vaccine.id} className="bg-orange-50  border border-orange-100  p-6 rounded-[2.5rem] flex flex-col gap-4">
                  <h4 className="text-orange-900  font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Vacina Próxima
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-white/60  rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <p className="text-xs font-bold text-orange-900  italic">
                      A vacina {vaccine.name} vence em {vaccine.nextDueDate ? format(new Date(vaccine.nextDueDate), "dd/MM") : ''}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {activeMedications.slice(0, 2).map((med) => {
              const pet = pets.find(p => p.id === med.petId);
              return (
                <div key={med.id} className="bg-cyan-50  border border-cyan-100  p-6 rounded-[2.5rem] flex flex-col gap-4">
                  <h4 className="text-cyan-900  font-bold flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Hora do Medicamento
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-white/60  rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    <p className="text-xs font-bold text-cyan-900  italic">
                      Dar {med.name} às {med.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-8 bg-secondary rounded-full"></span>
              <h2 className="text-xl font-bold text-slate-900 ">Timeline de Saúde</h2>
            </div>
            <Link to="/history" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">Ver todos</Link>
          </div>

          <div className="bg-white  p-8 rounded-[2.5rem] border border-slate-100  shadow-sm relative overflow-hidden h-[300px]">
            <div className="absolute left-10 top-10 bottom-[-40px] w-0.5 bg-slate-100 " />
            
            <div className="space-y-6 relative z-10">
              {timelineEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 font-medium">Nenhum evento próximo na timeline.</p>
                </div>
              ) : (
                timelineEvents.map((event, idx) => (
                  <div key={idx} className={`flex gap-6 relative ${idx > 0 ? 'opacity-60' : ''}`}>
                    <div className={`w-8 h-8 rounded-full ${event.color} flex items-center justify-center shrink-0 ring-4 ring-slate-50  z-10`}>
                      <event.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 ">{event.title}</p>
                      <p className="text-slate-500 text-sm">{event.subtitle}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-slate-100  rounded-full text-xs font-bold text-slate-500 ">
                        {format(event.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
