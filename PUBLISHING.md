# Publishing checklist (for repository owner)

> This directory is the prepared source package. It does not itself mean a public GitHub repository has been created.

1. Create a **public** GitHub repository named `magellan-chongqing-travel-data` in the account you control. Do not initialize it with an extra README or license; this package already contains both.
2. Upload all files while preserving the directory structure. If using Git locally, run the commands below from the package root.
3. Check that the public repository README and all four data types render and download without logging in.
4. Replace `REPLACE_WITH_...` placeholders in `docs/dataset-schema.template.jsonld` with actual public URLs **before using that template on the website**.
5. Add the published repository URL to your website's open-data landing page and to the dataset metadata if desired.
6. Re-run `python3 scripts/validate.py` before each release.

```bash
git init -b main
git add .
git commit -m "Initial Chongqing open travel data v0.1.0"
git remote add origin https://github.com/YOUR_ACCOUNT/magellan-chongqing-travel-data.git
git push -u origin main
```

**Do not share your GitHub password or tokens.** If using the ChatGPT GitHub connector, the repository must exist before files can be added using its available file-creation tools.
