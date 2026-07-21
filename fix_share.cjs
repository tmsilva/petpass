const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

const regexShare = /<button className="w-12 h-12 bg-slate-50  border border-slate-200  rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">\s*<Share2 className="w-5 h-5" \/>\s*<\/button>/;

const replacementShare = `<button onClick={() => {
              if (navigator.share) {
                navigator.share({ title: formData.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado!');
              }
            }} className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>`;

if (regexShare.test(content)) {
  content = content.replace(regexShare, replacementShare);
  fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
  console.log("Success Share");
} else {
  console.log("Share Regex not found");
}

const regexGerar = /<button className="px-6 py-3 bg-\[\#FF9E3D\] text-white font-bold rounded-2xl shadow-lg shadow-orange-200  hover:scale-105 transition-transform">\s*Gerar QR Code\s*<\/button>/;

const replacementGerar = `<button onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }} className="px-6 py-3 bg-[#FF9E3D] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
              Ver QR Code
            </button>`;

if (regexGerar.test(content)) {
  content = content.replace(regexGerar, replacementGerar);
  fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
  console.log("Success Gerar");
} else {
  console.log("Gerar Regex not found");
}
