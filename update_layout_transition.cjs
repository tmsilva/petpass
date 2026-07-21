const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');

if (!content.includes('motion/react')) {
  content = content.replace(
    "import { ChevronRight, ChevronLeft } from 'lucide-react';",
    "import { ChevronRight, ChevronLeft } from 'lucide-react';\nimport { AnimatePresence, motion } from 'motion/react';"
  );
}

const navContent = `      {/* Bottom Navigation for mobile */}
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
      </nav>`;

content = content.replace(/\{\/\* Bottom Navigation for mobile \*\/\}[\s\S]*?<\/nav>/, navContent);

fs.writeFileSync('src/components/layout/Layout.tsx', content, 'utf8');
console.log("Success update transition");
