const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

const regex = /const handleSubmit = async \(e: React.FormEvent\) => \{[\s\S]*?navigate\('\/pets'\);\s*\n\s*\};/;

const replacement = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    let photoUrl = formData.photoUrl;

    setIsUploading(true);
    try {
      if (fileToUpload && user) {
        const storageRef = ref(storage, \`pets/\${user.id}/\${Date.now()}_\${fileToUpload.name}\`);
        const snapshot = await uploadBytes(storageRef, fileToUpload);
        photoUrl = await getDownloadURL(snapshot.ref);
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

if (regex.test(content)) {
  fs.writeFileSync('src/pages/PetProfile.tsx', content.replace(regex, replacement), 'utf8');
  console.log("Success");
} else {
  console.log("Regex not found");
}
