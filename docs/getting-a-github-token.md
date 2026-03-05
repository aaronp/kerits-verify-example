[back](../README.md)

# Creating a `GITHUB_TOKEN` with `read:packages` Scope

## 1. Open GitHub Token Settings
Go to:

https://github.com/settings/tokens

You will see:
- **Fine-grained tokens**
- **Classic tokens**

For `read:packages`, **Classic tokens are usually easiest**.

---

## 2. Generate a New Classic Token

Open:

https://github.com/settings/tokens/new

---

## 3. Configure the Token

**Expiration:** 

Choose something appropriate (e.g. 30–90 days).

## 4. Select Scopes

Enable: packages-read

## 5. Generate the Token

Click **Generate token** and **copy it immediately**  
(GitHub only shows it once).

# Usage Examples

## Environment Variable
```bash
export GITHUB_TOKEN=ghp_xxxxxxxxx
```

# Docker / GHCR Logic

```sh
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

#  npm / GitHub Packages

`.npmrc` :
```sh
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

