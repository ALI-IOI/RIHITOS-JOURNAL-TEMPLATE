# Sync across devices with a private Gist

The app is a static site, so it has no server. To see the same progress on your laptop and phone,
it stores one JSON file in a **private GitHub Gist** that only your token can read or write.

## Set up (once)

1. On GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Give it a name (e.g. `journal-sync`), an expiry, and under **Account permissions** set **Gists** to **Read and write**. Nothing else.
3. Copy the token.
4. In the app, open **Console → Sync across devices**, paste the token, leave *Gist ID* empty and press **Connect & sync**.
   The app creates a private gist and shows its ID.

## Every other device

Open the site, go to **Console → Sync**, paste the same token **and** the Gist ID, press **Connect & sync**.

## How it behaves

- It pulls when the page opens, every 5 minutes while visible, and when you come back to the tab.
- It pushes a few seconds after you change anything.
- Each progress item, each day of the daily log, the parts list and your console edits carry a timestamp;
  the newer side wins, item by item, so two devices rarely overwrite each other.
- The token is kept only in that browser's local storage. Use **Forget on this device** on shared computers.
- A "secret" gist is unlisted, not encrypted: anyone with its URL can read it, so don't share the gist link.
