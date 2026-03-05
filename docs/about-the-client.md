[back](../README.md)

# About the Code




### Detailed code flow

```js
import { VerifyClient } from '@aaronp/kerits-verify';


// NOTE: for this demo/version, we use a plain password to create a client
// You can rotate / secure your passwords -- just not shown here.
const myIdentitySecret = "whatever you want - this is your sensitive password! Don't leak it!"

// create a client. This sets up a messaging account
//
// The client uses the default secure messaging out of the box
// (generous free limits, encrypted end-to-end)
//
// you can run and use your own communication servers as well
// (not shown here)
const client = await VerifyClient.create({ seed: myIdentitySecret });

```

Let's not assume you create whatever data you needs against a known schema you set up in [kerits](https://kerits.id)

```ts
// the schema ID you set up
const dataSchemaId = "..."

// the AID of the authority who will verify this data
const approverAid = "EAbcd..."

// this is the data which adheres to that schema, created however your
// app needs to create data.
const myAppData = {
    trade: {
        nonce : 12345,
        legs : [
            {
                fromWallet : "0x123...",
                toWallet : "0x456...",
                assetId : "ABC123",
                amount: 1
            },
            {
                fromWallet : "0x456...",
                toWallet : "0x123...",
                assetId : "XYZ456",
                amount: 2
            }
        ]
     },
  }


```


Now just invoke `verify` on the client with the target AID and your data. This will block until the approver approves or rejects it.

(If this a manual approval, use a non-blocking call which returns an approval Job Id - not shown here.)

Then just check the approve or reject status.


This gives you `non-repudiation` -- proof that a specific authority has approved exactly this request.

```ts
try {
  const result = await client.verify(approverAid, dataSchemaId, myAppData);

  if (result.success) {
    console.log('Verified!');
    console.log(`  SAID:      ${result.said}`);
    console.log(`  Signature: ${result.signature}`);

    // Verify the signature cryptographically.
    //
    // In production, the approver's public key should be obtained out-of-band
    // (e.g. from a trusted registry, OOBI resolution, or a prior key exchange).
    // Here we resolve it from SpacetimeDB's aid_registry for convenience.
    const publicKey = await client.resolvePublicKey(approverAid);
    if (publicKey) {
      // Compute the canonical hash of the data we sent
      const hash = VerifyClient.calculateHash(myAppData);

      // Verify the approver's signature over that hash
      const valid = VerifyClient.verifySignature(hash, publicKey, result.signature);
      console.log(`  Signature valid: ${valid}`);
    }

    if (result.details) console.log('  Details:', JSON.stringify(result.details, null, 2));
  } else {
    console.log('Rejected:', result.reason);
    if (result.details) console.log('  Details:', JSON.stringify(result.details, null, 2));
  }
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  await client.close();
}
```



### Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TARGET_AID` | yes | — | AID of the target controller |
| `SPACETIME_URL` | no | `wss://maincloud.spacetimedb.com` | SpacetimeDB WebSocket URL (set to `ws://localhost:3000` for local) |
| `SEED` | no | random | Verifier seed phrase — determines the client's AID. Random by default; set explicitly for a stable identity across runs. |
| `GITHUB_TOKEN` | yes (install) | — | GitHub token with `read:packages` scope |

