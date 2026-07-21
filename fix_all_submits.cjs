const fs = require('fs');

const files = [
  'src/pages/Vaccines.tsx',
  'src/pages/Medications.tsx',
  'src/pages/MedicalHistory.tsx',
  'src/pages/Documents.tsx'
];

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/if \(\!formData\.[a-zA-Z]+[^\)]+\) return;/g, '');
  fs.writeFileSync(file, content, 'utf8');
}
console.log("Success Removed Validations");
