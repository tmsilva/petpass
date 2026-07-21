const fs = require('fs');
let content = fs.readFileSync('src/pages/Medications.tsx', 'utf8');

const regex = /<div className="grid grid-cols-2 gap-4">\s*<div>\s*<label className="block text-sm font-bold text-slate-700 mb-1">Data Início<\/label>/;

const replacement = `<div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Horário</label>
              <input
                required
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data Início</label>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Medications.tsx', content, 'utf8');
  console.log("Success Medications");
} else {
  console.log("Regex not found in Medications");
}
