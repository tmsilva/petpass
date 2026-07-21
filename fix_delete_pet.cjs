const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

const regexBtn = /<div className="flex justify-end pt-4">([\s\S]*?)<\/div>/;

const replacementBtn = `<div className="flex justify-between items-center pt-4">
              {!isNew ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-4 text-rose-500 font-bold tracking-wide hover:bg-rose-50 rounded-2xl transition-colors"
                >
                  Excluir Pet
                </button>
              ) : <div></div>}
              <button 
                type="submit"
                disabled={isUploading}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold tracking-wide hover:bg-primary/90 transition-colors shadow-lg shadow-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Salvando...' : (isNew ? 'Cadastrar Pet' : 'Salvar Alterações')}
              </button>
            </div>`;

if (regexBtn.test(content)) {
  content = content.replace(regexBtn, replacementBtn);
} else {
  console.log("Button Regex not found");
}

const regexHandler = /const handleSubmit = async \(e: React.FormEvent\) => \{/;
const replacementHandler = `const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
      await deletePet(id!);
      navigate('/pets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {`;

if (regexHandler.test(content)) {
  content = content.replace(regexHandler, replacementHandler);
} else {
  console.log("Handler Regex not found");
}

const regexStore = /const \{ pets, addPet, updatePet, user \} = useStore\(\);/;
const replacementStore = `const { pets, addPet, updatePet, deletePet, user } = useStore();`;

if (regexStore.test(content)) {
  content = content.replace(regexStore, replacementStore);
} else {
  console.log("Store Regex not found");
}

fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
console.log("Success");
