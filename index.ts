import { VerifyClient } from '@aaronp/kerits-verify';

const SPACETIME_URL = process.env.SPACETIME_URL ?? 'wss://maincloud.spacetimedb.com';
const TARGET_AID = process.env.TARGET_AID;
const SEED = process.env.SEED ?? 'example-verifier-seed';

if (!TARGET_AID) {
  console.error('Error: TARGET_AID environment variable is required.');
  console.error('');
  console.error('Usage:');
  console.error('  TARGET_AID=EAbcd... bun run start');
  console.error('');
  console.error('Environment variables:');
  console.error('  TARGET_AID      (required) AID of the target controller');
  console.error('  SPACETIME_URL   SpacetimeDB URL (default: wss://maincloud.spacetimedb.com)');
  console.error('  SEED            Verifier seed phrase (default: example-verifier-seed)');
  process.exit(1);
}

console.log('Creating verify client...');
console.log(`  Target:      ${TARGET_AID}`);
console.log(`  SpacetimeDB: ${SPACETIME_URL}`);
console.log(`  Seed:        ${SEED}`);

const client = await VerifyClient.create({
  spacetimeUrl: SPACETIME_URL,
  seed: SEED,
});

console.log('Connected. Sending verification request...');

const appData = { trade: { amount: 50000, currency: 'USD' } };

try {
  const result = await client.verify(TARGET_AID, 'EExampleDataSAID', appData);

  if (result.success) {
    // The responder hashes the full payload (appData + said field)
    const payload = { ...appData, said: 'EExampleDataSAID' };
    const hash = VerifyClient.calculateHash(payload);

    // In production, the approver's public key should be obtained out-of-band
    // (e.g. from a trusted registry, OOBI resolution, or a prior key exchange).
    // Here we resolve it from SpacetimeDB's aid_registry for convenience.
    const publicKey = await client.resolvePublicKey(TARGET_AID);
    const sigValid = publicKey
      ? VerifyClient.verifySignature(payload, publicKey, result.signature)
      : null;

    console.log('');
    console.log('Approved!');
    console.log(`  SAID:             ${result.said}`);
    console.log(`  Hash:             ${hash}`);
    console.log(`  Signature:        ${result.signature}`);
    console.log(`  Public Key:       ${publicKey ?? '(not resolved)'}`);
    console.log(`  Hash valid:       ${result.said === hash ? '\u2705' : '\u274c'}`);
    console.log(`  Signature valid:  ${sigValid === true ? '\u2705' : sigValid === false ? '\u274c' : '\u2753 (no public key)'}`);
    if (result.details) console.log('  Details:', JSON.stringify(result.details, null, 2));
  } else {
    console.log('');
    console.log('Rejected:', result.reason);
    if (result.details) console.log('  Details:', JSON.stringify(result.details, null, 2));
  }
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  await client.close();
  console.log('');
  console.log('Client closed.');
  process.exit(0);
}
