# GitBook setup

Follow these steps to connect this repository to GitBook and publish the docs site.

## Prerequisites

- Push the `docs/` folder and `.gitbook.yaml` to `main` on [github.com/andrewkimjoseph/celina-api](https://github.com/andrewkimjoseph/celina-api)
- A [GitBook](https://www.gitbook.com) account

## 1. Create organization and space

1. Sign up or log in at [gitbook.com](https://www.gitbook.com)
2. Use the **Celina** organization (or create one)
3. Create a **Space** named **Celina API** (separate from Celina SDK)

## 2. Connect Git Sync

1. In the space, click **Set up Git Sync**
2. Install the **GitBook GitHub app** when prompted
3. Authorize access to `andrewkimjoseph/celina-api`
4. Select branch: **`main`**
5. **Project directory:** leave empty (`.gitbook.yaml` at repo root sets `root: ./docs/`)
6. Initial sync direction: **GitHub → GitBook**

GitBook will import all pages listed in `SUMMARY.md`.

## 3. Create and publish docs site

1. Create a **Docs site** in your GitBook organization
2. Link the "Celina API" space as a section
3. Set audience to **Public**
4. Click **Publish**

Expected URL: `https://andrewkimjoseph.gitbook.io/celina-api`

## Ongoing workflow

When the SDK catalog changes:

```bash
npm run docs:tools
git add docs/reference/tools.md
git commit -m "docs: refresh tool list"
git push origin main
```

GitBook syncs automatically on push to `main`.

## Troubleshooting

- **New page not showing:** Add it to `docs/SUMMARY.md` — every `.md` file must appear exactly once.
- **Sync errors:** Ensure `docs/README.md` exists (GitBook homepage).
- **Stale tool list:** Run `npm run docs:tools` and commit `docs/reference/tools.md`.
