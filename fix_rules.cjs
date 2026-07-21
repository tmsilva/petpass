const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(/data\.photoUrl\.size\(\) <= 1000/g, "data.photoUrl.size() <= 1048576");
content = content.replace(/data\.fileUrl\.size\(\) <= 1000/g, "data.fileUrl.size() <= 1048576");
content = content.replace(/data\.pdfUrl\.size\(\) <= 1000/g, "data.pdfUrl.size() <= 1048576");

fs.writeFileSync('firestore.rules', content, 'utf8');
console.log("Success Rules");
