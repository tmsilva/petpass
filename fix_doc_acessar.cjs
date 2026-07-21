const fs = require('fs');
let content = fs.readFileSync('src/pages/Documents.tsx', 'utf8');

const regexAcessar = /<a href=\{doc\.fileUrl\} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600">\s*<File className="w-4 h-4" \/>\s*Acessar\s*<\/a>/;

const replacementAcessar = `<button onClick={() => {
                        if (doc.fileUrl?.startsWith('data:')) {
                          const a = document.createElement('a');
                          a.href = doc.fileUrl;
                          a.download = doc.name;
                          a.click();
                        } else {
                          window.open(doc.fileUrl, '_blank');
                        }
                      }} className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600">
                        <File className="w-4 h-4" />
                        Acessar
                      </button>`;

if (regexAcessar.test(content)) {
  content = content.replace(regexAcessar, replacementAcessar);
  fs.writeFileSync('src/pages/Documents.tsx', content, 'utf8');
  console.log("Success Acessar");
} else {
  console.log("Acessar Regex not found");
}
