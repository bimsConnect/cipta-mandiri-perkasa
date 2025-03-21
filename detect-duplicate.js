const fs = require("fs");
const path = require("path");

// Fungsi untuk membaca semua file dalam direktori (rekursif)
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Fungsi untuk mengekstrak isi fungsi dari file TypeScript
function extractFunctions(fileContent) {
  const functionRegex = /(?:export\s+)?(?:const|let|var|function)\s+(\w+)\s*=?\s*(?:async\s*)?\(.*?\)\s*[{=]([\s\S]*?)}/g;
  const functions = [];
  let match;
  while ((match = functionRegex.exec(fileContent)) !== null) {
    functions.push({
      name: match[1],
      body: match[2].trim().replace(/\s+/g, " "), // Normalisasi isi fungsi
    });
  }
  return functions;
}

// Fungsi untuk mendeteksi fungsi yang mirip
function findDuplicateFunctions(allFiles) {
  const functionMap = new Map();

  allFiles.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    const functions = extractFunctions(content);

    functions.forEach(({ name, body }) => {
      if (!functionMap.has(body)) {
        functionMap.set(body, []);
      }
      functionMap.get(body).push({ file, name });
    });
  });

  // Menampilkan fungsi yang duplikat
  console.log("🔍 **Fungsi yang Mirip / Duplikat**:");
  let foundDuplicates = false;
  functionMap.forEach((instances, body) => {
    if (instances.length > 1) {
      foundDuplicates = true;
      console.log("\n🚀 **Kode yang sama ditemukan dalam beberapa file:**");
      instances.forEach(({ file, name }) => {
        console.log(`- **${name}** di ${file}`);
      });
    }
  });

  if (!foundDuplicates) {
    console.log("✅ Tidak ditemukan fungsi yang duplikat.");
  }
}

// Jalankan skrip
const projectRoot = path.resolve(__dirname); // Sesuaikan dengan direktori proyek
const allFiles = getAllFiles(projectRoot);
findDuplicateFunctions(allFiles);
