export const compressImage = (file: File, maxSizeMB: number = 0.5): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > height && width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        let quality = 0.8;
        let dataUrl = canvas.toDataURL(file.type || 'image/jpeg', quality);
        
        // Target size in bytes
        const maxBytes = maxSizeMB * 1024 * 1024;
        
        // Rough size calculation of base64
        while (dataUrl.length * 0.75 > maxBytes && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL(file.type || 'image/jpeg', quality);
        }
        
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
