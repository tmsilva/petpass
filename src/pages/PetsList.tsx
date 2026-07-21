import React from 'react';
import { useStore } from '../store/useStore';
import { PawPrint, Plus, ChevronRight, Activity, Bone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateAge } from '../lib/utils';

export default function PetsList() {
  const pets = useStore(state => state.pets);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-black text-slate-900  tracking-tighter">Meus Pets</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">Gerencie o perfil dos seus animais</p>
        </div>
        <Link 
          to="/pets/new" 
          className="w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-3 bg-[#FF9E3D] text-white rounded-2xl font-bold shadow-lg shadow-orange-200  hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Adicionar Pet</span>
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="bg-slate-50  border border-slate-100  rounded-[3rem] p-12 text-center flex flex-col items-center justify-center mt-8">
          <div className="w-20 h-20 bg-white  rounded-2xl shadow-sm flex items-center justify-center mb-6">
            <PawPrint className="w-10 h-10 text-slate-300 " />
          </div>
          <h2 className="text-2xl font-black text-slate-900  tracking-tighter mb-2">Nenhum pet cadastrado</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
            Comece adicionando seu primeiro pet para acompanhar vacinas, consultas e histórico médico.
          </p>
          <Link 
            to="/pets/new" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-200 "
          >
            <Plus className="w-5 h-5" />
            Cadastrar Pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <Link 
              key={pet.id} 
              to={`/pets/${pet.id}`}
              className="group bg-slate-50  border border-slate-100  rounded-[2.5rem] p-6 flex flex-col gap-6 relative overflow-hidden hover:border-primary transition-colors"
            >
              <div className="absolute top-6 right-6 p-2 bg-white  rounded-xl shadow-sm opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex items-center gap-4">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-slate-200 to-slate-100   flex items-center justify-center text-slate-400 shadow-inner">
                    <PawPrint className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900  group-hover:text-primary transition-colors">{pet.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">{pet.breed || pet.species}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white  p-3 rounded-2xl flex items-center gap-3 shadow-sm">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-slate-700 ">{calculateAge(pet.birthDate)}</span>
                </div>
                <div className="bg-white  p-3 rounded-2xl flex items-center gap-3 shadow-sm">
                  <Bone className="w-4 h-4 text-[#FF9E3D]" />
                  <span className="text-sm font-bold text-slate-700 ">{pet.weight} kg</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
