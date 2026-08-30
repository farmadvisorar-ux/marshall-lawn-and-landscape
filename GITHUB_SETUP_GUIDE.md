# GitHub Setup & 100% Free Hosting Guide: Marshall Lawn and Landscape

This guide walks you through uploading your website to **GitHub** and turning on **GitHub Pages** for completely free, fast, 24/7 web hosting with free HTTPS SSL.

---

## ⚡ Method 1: Web Upload via GitHub.com (Easiest - 1 Minute, No Tools Needed)

1. **Log in to GitHub**: Go to [github.com](https://github.com) (or create a free account if you don't have one).
2. **Create a New Repository**:
   - Click the green **"New"** button (or visit [github.com/new](https://github.com/new)).
   - **Repository name**: `marshall-lawn-and-landscape` (or your preferred name).
   - Set to **Public**.
   - Leave "Initialize with README" unchecked.
   - Click **"Create repository"**.
3. **Upload Your Files**:
   - On the new repository page, click the link that says **"uploading an existing file"**.
   - Open your file explorer on your computer to:
     `C:\Users\Admin\.gemini\antigravity\scratch\marshall-lawn-and-landscape\`
   - Select all files and folders:
     - `index.html`
     - `styles.css`
     - `app.js`
     - `llms.txt`
     - `sitemap.xml`
     - `robots.txt`
     - `README.md`
     - `services/` folder
     - `locations/` folder
   - Drag and drop them into the GitHub upload box.
   - Click the green **"Commit changes"** button at the bottom.

---

## 🌐 How to Turn On Free 24/7 Hosting (GitHub Pages)

Once your files are in the repository:

1. In your GitHub repository, click on **Settings** (tab on the top right).
2. On the left sidebar menu, click **Pages** (under "Code and automation").
3. Under **Build and deployment** -> **Branch**:
   - Change `None` to **`main`** (or `master`).
   - Leave the folder as **`/ (root)`**.
   - Click **Save**.
4. Refresh the page in 60 seconds. A banner will appear at the top:
   > *"Your site is live at https://yourusername.github.io/marshall-lawn-and-landscape/"*

---

## 🔗 Connecting Your Custom Domain (e.g., `marshalllawnandlandscape.com`)

1. In **Settings** -> **Pages**, scroll down to **Custom domain**.
2. Type your domain: `marshalllawnandlandscape.com` and click **Save**.
3. Check the box **"Enforce HTTPS"** for automatic free SSL security.
4. At your domain registrar (GoDaddy, Namecheap, Google/Squarespace Domains, Cloudflare):
   - Add an **A Record** pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add a **CNAME Record** for `www` pointing to `yourusername.github.io`.

---

## 📲 Link to Your Google Business Profile
After your GitHub site is live:
1. Open your [Google Business Profile Manager](https://business.google.com).
2. Set your website URL to your GitHub Pages URL or your custom domain.
3. Set your appointment URL to `https://yourdomain.com/#calculator`.
