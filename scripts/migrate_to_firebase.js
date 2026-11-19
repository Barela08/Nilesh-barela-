const { initializeApp, getApps, getApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyAU37WSKIwU71q1kVNGvzfJ-YqkNznhlPo",
  authDomain: "nilesh-barela.firebaseapp.com",
  projectId: "nilesh-barela",
  storageBucket: "nilesh-barela.firebasestorage.app",
  messagingSenderId: "181013463096",
  appId: "1:181013463096:web:f68519ad896546d438a6cd",
  measurementId: "G-3EWJFLZ3QZ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadCollection(collectionName, fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`[Skip] File not found: ${fileName}`);
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let items = [];
  try {
    items = JSON.parse(raw);
  } catch (e) {
    console.error(`[Error] Parsing ${fileName}:`, e.message);
    return;
  }

  console.log(`\nUploading ${items.length} records to collection '${collectionName}'...`);
  let count = 0;
  for (const item of items) {
    if (!item.id) continue;
    try {
      const docRef = doc(db, collectionName, item.id);
      await setDoc(docRef, { ...item, syncedAt: new Date().toISOString() }, { merge: true });
      count++;
      console.log(`  ✓ Synced ${collectionName}/${item.id}`);
    } catch (err) {
      console.error(`  ✗ Failed ${collectionName}/${item.id}:`, err.message);
    }
  }
  console.log(`[Success] Finished ${collectionName}: ${count}/${items.length} uploaded.`);
}

async function main() {
  console.log('==============================================');
  console.log('Firebase Migration Tool - HackifyPro');
  console.log(`Target Firebase Project: ${firebaseConfig.projectId}`);
  console.log('==============================================');

  await uploadCollection('appointments', 'appointments.json');
  await uploadCollection('enquiries', 'enquiries.json');
  await uploadCollection('quotes', 'quotes.json');
  await uploadCollection('projects', 'projects.json');

  console.log('\n==============================================');
  console.log('All local data successfully migrated to Firebase!');
  console.log('==============================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
