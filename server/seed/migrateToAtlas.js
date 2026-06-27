/**
 * Velora DB Migration: Local MongoDB → MongoDB Atlas
 * Run with: node seed/migrateToAtlas.js
 */

const mongoose = require('mongoose');

const LOCAL_URI  = 'mongodb://localhost:27017/velora';
const ATLAS_URI  = 'mongodb+srv://pprajapati2424_db_user:kXl5P6LTeTcxYib9@cluster0.uoblknz.mongodb.net/velora?appName=Cluster0';

// Collections to migrate
const COLLECTIONS = ['users', 'products', 'orders', 'newsletters', 'contacts'];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function migrate() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   Velora DB Migration → MongoDB Atlas    ║');
  console.log('╚══════════════════════════════════════════╝\n');

  // ── Step 1: Connect to LOCAL ───────────────────────────────
  console.log('📡 Connecting to LOCAL MongoDB...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('✅ Connected to local: mongodb://localhost:27017/velora\n');

  // ── Step 2: Connect to ATLAS ───────────────────────────────
  console.log('☁️  Connecting to MongoDB ATLAS...');
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('✅ Connected to Atlas cluster\n');

  let totalMigrated = 0;

  // ── Step 3: For each collection, copy all docs ─────────────
  for (const colName of COLLECTIONS) {
    process.stdout.write(`⏳ Migrating "${colName}"...`);

    const localCol = localConn.db.collection(colName);
    const atlasCol = atlasConn.db.collection(colName);

    // Read all docs from local
    const docs = await localCol.find({}).toArray();

    if (docs.length === 0) {
      console.log(` skipped (empty)`);
      continue;
    }

    // Drop existing Atlas collection to avoid duplicates
    try { await atlasCol.drop(); } catch (_) { /* collection may not exist yet */ }

    // Insert all docs to Atlas
    await atlasCol.insertMany(docs, { ordered: false });

    console.log(` ✅ ${docs.length} document(s) migrated`);
    totalMigrated += docs.length;

    await sleep(200); // small pause between collections
  }

  // ── Step 4: Done ───────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log(`🎉 Migration complete! ${totalMigrated} total documents copied.`);
  console.log('══════════════════════════════════════════\n');

  // Quick verify on Atlas
  console.log('📊 Atlas collection summary:');
  for (const colName of COLLECTIONS) {
    const count = await atlasConn.db.collection(colName).countDocuments();
    if (count > 0) console.log(`   ✔ ${colName}: ${count} docs`);
  }

  await localConn.close();
  await atlasConn.close();
  console.log('\n✅ Connections closed. Your data is now on Atlas!\n');
}

migrate().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  console.error('\nTips:');
  console.error('  - Make sure your local MongoDB service is running');
  console.error('  - Check your internet connection for Atlas');
  console.error('  - Whitelist your IP in Atlas Network Access settings');
  process.exit(1);
});
