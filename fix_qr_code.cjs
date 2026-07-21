const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

if (!content.includes("import QRCode from 'react-qr-code';")) {
  content = content.replace("import { Pet } from '../types';", "import { Pet } from '../types';\nimport QRCode from 'react-qr-code';");
}

const regexQR = /<div className="bg-white p-4 rounded-3xl mb-6 w-full aspect-square flex items-center justify-center relative">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const replacementQR = `<div className="bg-white p-4 rounded-3xl mb-6 w-full aspect-square flex items-center justify-center relative">
                <QRCode value={window.location.href} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} fgColor="#18C3D6" />
                <div className="absolute flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100">
                    <PawPrint className="w-8 h-8 text-[#18C3D6]" />
                  </div>
                </div>
              </div>`;

if (regexQR.test(content)) {
  content = content.replace(regexQR, replacementQR);
  fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
  console.log("Success QR Code");
} else {
  console.log("QR Code Regex not found");
}
