const fs = require('fs');
const files = [
  'src/pages/Vaccines.tsx',
  'src/pages/Medications.tsx',
  'src/pages/MedicalHistory.tsx',
  'src/pages/Documents.tsx'
];

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/petId: pets\.length > 0 \? pets\[0\]\.id : '',/, "petId: selectedPet || (pets.length > 0 ? pets[0].id : ''),");
  fs.writeFileSync(file, content, 'utf8');
}
console.log("Success Pre-fill Modal PetId");
