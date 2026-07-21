const fs = require('fs');

const files = [
  { path: 'src/pages/Vaccines.tsx', name: 'vaccines', item: 'v' },
  { path: 'src/pages/Medications.tsx', name: 'medications', item: 'm' },
  { path: 'src/pages/MedicalHistory.tsx', name: 'medicalRecords', item: 'r' },
  { path: 'src/pages/Documents.tsx', name: 'documents', item: 'doc' },
];

for (let file of files) {
  let content = fs.readFileSync(file.path, 'utf8');

  // Add import
  if (!content.includes("import { useSearchParams }")) {
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useSearchParams } from 'react-router-dom';");
  }

  // Add selectedPet hook
  if (!content.includes("const [searchParams, setSearchParams] = useSearchParams();")) {
    const storeRegex = /const {.*?} = useStore\(\);/;
    const storeMatch = content.match(storeRegex);
    if (storeMatch) {
      content = content.replace(storeMatch[0], `${storeMatch[0]}\n  const [searchParams, setSearchParams] = useSearchParams();\n  const selectedPet = searchParams.get('pet') || '';`);
    }
  }

  // Edit filtered logic
  const filteredRegex = new RegExp(`const filtered${file.name.charAt(0).toUpperCase() + file.name.slice(1)} = ${file.name}.filter\\(${file.item} =>[\\s\\S]*?\\)\\.sort\\(`, "g");
  
  if (file.name === 'vaccines') {
    content = content.replace(/const filteredVaccines = vaccines\.filter\(v => [\s\S]*?\.includes\(searchTerm\.toLowerCase\(\)\)\s*\)\.sort\(/g,
`const filteredVaccines = vaccines.filter(v => 
    (selectedPet ? v.petId === selectedPet : true) &&
    (v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pets.find(p => p.id === v.petId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort(`);
  } else if (file.name === 'medications') {
    content = content.replace(/const filteredMedications = medications\.filter\(m => [\s\S]*?\.includes\(searchTerm\.toLowerCase\(\)\)\s*\)\.sort\(/g,
`const filteredMedications = medications.filter(m => 
    (selectedPet ? m.petId === selectedPet : true) &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pets.find(p => p.id === m.petId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort(`);
  } else if (file.name === 'medicalRecords') {
    content = content.replace(/const filteredRecords = medicalRecords\.filter\(r => [\s\S]*?\.includes\(searchTerm\.toLowerCase\(\)\)\s*\)\.sort\(/g,
`const filteredRecords = medicalRecords.filter(r => 
    (selectedPet ? r.petId === selectedPet : true) &&
    (r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pets.find(p => p.id === r.petId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort(`);
  } else if (file.name === 'documents') {
    content = content.replace(/const filteredDocuments = documents\.filter\(doc => [\s\S]*?\.includes\(searchTerm\.toLowerCase\(\)\)\s*\)\.sort\(/g,
`const filteredDocuments = documents.filter(doc => 
    (selectedPet ? doc.petId === selectedPet : true) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pets.find(p => p.id === doc.petId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort(`);
  }

  // Edit UI select dropdown
  const searchUIRegex = /<div className="flex gap-4">\s*<div className="flex-1 relative">/g;
  const selectUI = `<div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">`;
  
  content = content.replace(searchUIRegex, selectUI);

  const searchUIEndRegex = /<\/div>\s*<\/div>\s*\{filtered/g;
  const searchUIEndReplacement = `</div>
        <div className="w-full sm:w-64">
          <select
            value={selectedPet}
            onChange={(e) => {
              if (e.target.value) {
                setSearchParams({ pet: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-medium appearance-none"
          >
            <option value="">Todos os Pets</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
        </div>
      </div>
      {filtered`;

  content = content.replace(searchUIEndRegex, searchUIEndReplacement);

  fs.writeFileSync(file.path, content, 'utf8');
  console.log("Success " + file.name);
}
