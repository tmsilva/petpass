import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Syringe, Activity, Pill, FileText, Phone, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Início', icon: LayoutDashboard },
  { path: '/pets', label: 'Pets', icon: PawPrint },
  { path: '/vaccines', label: 'Vacinas', icon: Syringe },
  { path: '/history', label: 'Histórico', icon: Activity },
  { path: '/medications', label: 'Remédios', icon: Pill },
  { path: '/documents', label: 'Documentos', icon: FileText },
  { path: '/contacts', label: 'Contatos', icon: Phone },
  { path: '/settings', label: 'Ajustes', icon: SettingsIcon },
];

export default function Layout({ children }: LayoutProps) {
  const [navPage, setNavPage] = useState(0);
  const user = useStore((state) => state.user);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800   font-sans selection:bg-[#18C3D6] selection:text-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white  border-r border-slate-200  h-full">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#18C3D6] to-[#45D6B0] flex items-center justify-center text-white shadow-lg shadow-cyan-200 ">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 ">PetPass</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-[#18C3D6]/10 text-[#18C3D6] font-semibold" 
                    : "text-slate-500 hover:bg-slate-50"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 mt-auto border-t border-slate-100 ">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200  border-2 border-white  shadow-sm overflow-hidden flex items-center justify-center">
              <span className="text-slate-500  font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-900 truncate w-32" title={user?.name || 'Usuário'}>{user?.name || 'Usuário'}</p>
              <p className="text-slate-500 text-xs">Tutor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full bg-white  md:rounded-l-[40px] md:shadow-2xl md:ml-[-20px] z-10 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80  backdrop-blur-md border-b border-slate-200  sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#18C3D6] to-[#45D6B0] flex items-center justify-center shadow-sm">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 ">PetPass</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 md:p-12 pb-24 md:pb-12">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      
            {/* Bottom Navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90  backdrop-blur-lg border-t border-slate-200  z-50 pb-safe">
        <div className="flex items-center justify-around p-2 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {navPage === 0 ? (
              <motion.div
                key="page0"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-around w-full"
              >
                {navItems.slice(0, 4).map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-all duration-200",
                        isActive 
                          ? "text-[#18C3D6]" 
                          : "text-slate-400 hover:text-slate-900"
                      )
                    }
                  >
                    <item.icon className={cn("w-6 h-6 mb-1", "active:scale-95 transition-transform")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </NavLink>
                ))}
                <button 
                  onClick={() => setNavPage(1)}
                  className="flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-all duration-200 text-slate-400 hover:text-slate-900"
                >
                  <ChevronRight className="w-6 h-6 mb-1 active:scale-95 transition-transform" />
                  <span className="text-[10px] font-medium">Mais</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="page1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-around w-full"
              >
                <button 
                  onClick={() => setNavPage(0)}
                  className="flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-all duration-200 text-slate-400 hover:text-slate-900"
                >
                  <ChevronLeft className="w-6 h-6 mb-1 active:scale-95 transition-transform" />
                  <span className="text-[10px] font-medium">Voltar</span>
                </button>
                {navItems.slice(4, 8).map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-all duration-200",
                        isActive 
                          ? "text-[#18C3D6]" 
                          : "text-slate-400 hover:text-slate-900"
                      )
                    }
                  >
                    <item.icon className={cn("w-6 h-6 mb-1", "active:scale-95 transition-transform")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

    </div>
  );
}
