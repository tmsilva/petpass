const fs = require('fs');
let content = fs.readFileSync('src/pages/Medications.tsx', 'utf8');

const regex = /setFormData\(\{\s*petId: pets\.length > 0 \? pets\[0\]\.id : '',\s*name: '',\s*type: 'General',\s*dosage: '',\s*startDate: format\(new Date\(\), 'yyyy-MM-dd'\)\s*\}\);/;

const replacement = `setFormData({
        petId: pets.length > 0 ? pets[0].id : '',
        name: '',
        type: 'General',
        dosage: '',
        frequency: '',
        time: '',
        startDate: format(new Date(), 'yyyy-MM-dd')
      });`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Medications.tsx', content, 'utf8');
  console.log("Success Medications Defaults");
} else {
  console.log("Medications Defaults regex not found");
}
