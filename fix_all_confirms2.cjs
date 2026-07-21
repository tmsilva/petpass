const fs = require('fs');
const files = [
  'src/pages/Vaccines.tsx',
  'src/pages/MedicalHistory.tsx',
  'src/pages/Medications.tsx',
  'src/pages/Documents.tsx',
  'src/pages/Contacts.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/if \(window\.confirm\("Tem certeza que deseja excluir\?"\)\) \{\s*delete[a-zA-Z]+\(id\);\s*\}/g, (match) => {
    // Extract the delete function call
    const deleteCall = match.match(/delete[a-zA-Z]+\(id\);/)[0];
    return deleteCall;
  });
  fs.writeFileSync(file, content, 'utf8');
});
console.log("Removed confirm dialogs");
