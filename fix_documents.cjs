const fs = require('fs');
let content = fs.readFileSync('src/pages/Documents.tsx', 'utf8');

const regexImports = /import \{ ref, uploadBytes, getDownloadURL \} from 'firebase\/storage';/;
content = content.replace(regexImports, "import { compressImage } from '../lib/resize_image';");

const regexFirebaseStorage = /import \{ storage \} from '\.\.\/lib\/firebase';/;
content = content.replace(regexFirebaseStorage, "");

const regexHandleSubmit = /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?setIsUploading\(false\);\n    \}\n  \};/;
const replacementHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    if (!formData.petId || !formData.name || !formData.type || !formData.dateAdded) return;
    
    let fileUrl = formData.fileUrl;

    setIsUploading(true);
    try {
      if (fileToUpload) {
        if (fileToUpload.size > 1048576 && !fileToUpload.type.startsWith('image/')) {
           alert("O arquivo é muito grande (máximo 1MB). Por favor, escolha um arquivo menor.");
           setIsUploading(false);
           return;
        }
        fileUrl = await compressImage(fileToUpload, 0.8);
      }
      
      if (editingDocument) {
        await updateDocument({ ...formData, fileUrl } as Document);
      } else {
        await addDocument({
          ...(formData as Omit<Document, 'id'>),
          fileUrl,
          id: generateId()
        });
      }
      setIsModalOpen(false);
      setEditingDocument(null);
      setFormData({});
      setFileToUpload(null);
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Erro ao salvar o documento.");
    } finally {
      setIsUploading(false);
    }
  };`;

content = content.replace(regexHandleSubmit, replacementHandleSubmit);
fs.writeFileSync('src/pages/Documents.tsx', content, 'utf8');
console.log("Success Documents");
