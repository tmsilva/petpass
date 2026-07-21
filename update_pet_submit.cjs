const fs = require('fs');
let content = fs.readFileSync('src/pages/PetProfile.tsx', 'utf8');

const target = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    let photoUrl = formData.photoUrl;

    if (fileToUpload && user) {
      setIsUploading(true);
      try {
        const storageRef = ref(storage, \`pets/\${user.id}/\${Date.now()}_\${fileToUpload.name}\`);
        const snapshot = await uploadBytes(storageRef, fileToUpload);
        photoUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Erro ao fazer upload da foto. O pet será salvo sem a foto.");
      } finally {
        setIsUploading(false);
      }
    }
    
    if (isNew) {
      addPet({
        ...(formData as Pet),
        photoUrl,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    } else {
      updatePet({
        ...(formData as Pet),
        photoUrl
      });
    }
    navigate('/pets');
  };`;

const replacement = `  const handleSubmit = async (e: React.FormEvent) => {
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

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/PetProfile.tsx', content, 'utf8');
  console.log("Success");
} else {
  console.log("Target not found");
}
