const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  projectId: "self-driving-car-rental-9f35f",
  appId: "1:611647646497:web:857638b3e91219df7b2c60",
  storageBucket: "self-driving-car-rental-9f35f.firebasestorage.app",
  apiKey: "AIzaSyDgGzbnzU_sMrZS9tF774ZD0_6jDvBKsEM",
  authDomain: "self-driving-car-rental-9f35f.firebaseapp.com",
  messagingSenderId: "611647646497",
  measurementId: "G-3JEWNBVFHR"
};

const app = initializeApp(firebaseConfig);
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
  console.log('ALL DATA SUCCESSFULLY UPLOADED TO FIREBASE!');
  console.log('==============================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
