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
  content = content.replace(/if \(confirm\('.*?'\)\) \{/g, 'if (window.confirm("Tem certeza que deseja excluir?")) {');
  fs.writeFileSync(file, content, 'utf8');
});
console.log("Replaced confirm with window.confirm");
