
# Kerits Verify Example


## Purpose

This is an example project of `kerits-verify`, a small library which allows you to easily insert approval within your application.

It uses distributed identity to combine a ridiculously easy, decentralised identity to give your application `non-repudiation` of authorisation.


This is how you use the `VerifyClient` to insert authorisation in a few lines of code:


```ts
import { VerifyClient } from '@aaronp/kerits-verify';

// line 1: register an account
const client = await VerifyClient.create({ seed: "some password you just make up" });

// line 2: request authorisation of some data:
const result = await client.verify(approverId, schemaId, { my : "data"});

// line 3: check the results. 
// (See a more complete example below for verifying the hash and signature of the )approval, etc
if (result.success) { ... }
```

You can see more about the kerits-verify library [here](./docs/about-the-client.md)

## Running this Example

You can see it in action below, or follow along with these steps.

### Prerequisites
---
- [Bun](https://bun.sh/) installed
- A `GITHUB_TOKEN` with `read:packages` scope (for GitHub Packages auth)
  (see [here](./docs/getting-a-github-token.md) for how to set this up)
- A target controller AID (see [here](./docs/creating-an-account.md)) to set up. It takes about 5 seconds

---

### Step 1: Setup an authorisor identity


We should be able to use any KERI-compliant system. For this demo, we use [kerits.id](https://kerits.id)

We just have to specify a name, then register our new identity with a chat server (a secure communication channel used by kerits). 

We use the default 'SpacetimeDB' channel.

Once registered, we copy the 'AID' (autonomous identifier) using the copy button in the bottom left


https://github.com/user-attachments/assets/2dbe532c-f648-47de-94e7-eebf9a8edd45


### Step 2: Run the client

Using the ID (AID) copied from your account, specify the authorisor (TARGET_AID) and an optional SEED (password). Using the same SEED will give your application  a consistent identity.

Note that during this sequence, I've gone back to [kerits.id](https://kerits.id) to manually approve

![Approving](./docs/approved.svg)


This is how our Makefile works:

```bash
# install deps + run (random seed)
make dev
# ... with a real target AID
TARGET_AID=EAbcd... make dev
# ...with a fixed seed for a consistent AID
SEED=my-stable-identity make dev
# ...(optional) against your own SpacetimeDB
SPACETIME_URL=ws://localhost:3010 make dev
```

https://github.com/user-attachments/assets/54f18dd2-ca8c-4b41-9496-f5c3679bba61


We could also run again to show rejection:

![Rejecting](./docs/rejected.svg)


As we use the same SEED, we'll see a second message


https://github.com/user-attachments/assets/845edff3-eecd-4d56-891f-b5bb0fccf488
