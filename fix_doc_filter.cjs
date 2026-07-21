const fs = require('fs');
let content = fs.readFileSync('src/pages/Documents.tsx', 'utf8');

const regex = /const filteredDocuments = documents\.filter\(d => \s*d\.name\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\|\s*pets\.find\(p => p\.id === d\.petId\)\?\.name\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\s*\)\.sort\(/;

const replacement = `const filteredDocuments = documents.filter(d => 
    (selectedPet ? d.petId === selectedPet : true) &&
    (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pets.find(p => p.id === d.petId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort(`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Documents.tsx', content, 'utf8');
  console.log("Success Documents filter");
} else {
  console.log("Documents regex not found");
}
