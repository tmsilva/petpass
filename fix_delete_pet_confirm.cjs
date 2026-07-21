const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

const importRegex = /const \[isUploading, setIsUploading\] = useState\(false\);/;
const importReplacement = `const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);`;

content = content.replace(importRegex, importReplacement);

const handleRegex = /const handleDelete = async \(\) => \{\s*if \(confirm\('Tem certeza que deseja excluir este pet\?'\)\) \{\s*await deletePet\(id!\);\s*navigate\('\/pets'\);\s*\}\s*\};/;
const handleReplacement = `const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    await deletePet(id!);
    navigate('/pets');
  };`;

content = content.replace(handleRegex, handleReplacement);

const btnRegex = /Excluir Pet\s*<\/button>/;
const btnReplacement = `{showDeleteConfirm ? 'Confirmar Exclusão' : 'Excluir Pet'}
                </button>`;

content = content.replace(btnRegex, btnReplacement);

fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
console.log("Success Pet Delete");
