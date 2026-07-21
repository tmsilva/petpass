const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

const regexImports = /import \{ ref, uploadBytes, getDownloadURL \} from 'firebase\/storage';/;
content = content.replace(regexImports, "import { compressImage } from '../lib/resize_image';");

const regexFirebaseStorage = /import \{ storage \} from '\.\.\/lib\/firebase';/;
content = content.replace(regexFirebaseStorage, "");

const regexHandleSubmit = /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?setIsUploading\(false\);\n    \}\n  \};/;
const replacementHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    let photoUrl = formData.photoUrl;

    setIsUploading(true);
    try {
      if (fileToUpload) {
        photoUrl = await compressImage(fileToUpload, 0.8);
      }
      
      if (isNew) {
        await addPet({
          ...(formData as Pet),
          photoUrl,
          id: generateId(),
          createdAt: new Date().toISOString(),
        });
      } else {
        await updatePet({
          ...(formData as Pet),
          photoUrl
        });
      }
      navigate('/pets');
    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Erro ao salvar o pet.");
    } finally {
      setIsUploading(false);
    }
  };`;

content = content.replace(regexHandleSubmit, replacementHandleSubmit);
fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
console.log("Success PetProfile");
