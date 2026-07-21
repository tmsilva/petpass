const fs = require('fs');
let content = fs.readFileSync('src/pages/Medications.tsx', 'utf8');

const regexSubmit = /if \(\!formData\.petId \|\| \!formData\.name \|\| \!formData\.startDate \|\| \!formData\.type\) return;/;
const replacementSubmit = `if (!formData.petId || !formData.name || !formData.startDate || !formData.type || !formData.dosage || !formData.frequency || !formData.time) return;`;

if (regexSubmit.test(content)) {
  content = content.replace(regexSubmit, replacementSubmit);
  fs.writeFileSync('src/pages/Medications.tsx', content, 'utf8');
  console.log("Success Submit");
} else {
  console.log("Submit Regex not found");
}
