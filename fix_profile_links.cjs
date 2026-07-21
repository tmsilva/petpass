const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

content = content.replace(/{ label: 'Agenda', icon: Calendar, color: 'text-rose-500', path: \`\/agenda\?pet=\${id}\` }/, 
"{ label: 'Remédios', icon: Calendar, color: 'text-rose-500', path: `/medications?pet=${id}` }");

fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
console.log("Success Profile Links");
