const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

content = content.replace(/import { (.*?) } from 'lucide-react';/, "import { $1, Pill } from 'lucide-react';");
content = content.replace(/{ label: 'Remédios', icon: Calendar, color: 'text-rose-500', path: \`\/medications\?pet=\${id}\` }/, "{ label: 'Remédios', icon: Pill, color: 'text-rose-500', path: `/medications?pet=${id}` }");

fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
console.log("Success Profile Icon");
