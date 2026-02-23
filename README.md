# 8806 Construction Payment Tracker

A real-time construction payment tracker with **two-way Google Sheets sync**. Edit vendors and payments in the app and they automatically sync to your Google Sheet — and vice versa.

Works everywhere: **desktop, tablet, mobile** via Vercel cloud hosting.

## Features

- ✅ **Two-way Google Sheets Sync**: Add, edit, delete vendors and payments → instantly synced to your Google Sheet
- 📊 **Live Dashboard**: See total amounts agreed, paid, and owed at a glance
- 💾 **Auto Backups**: Daily automatic backups stored locally (last 30 days)
- 📱 **Mobile Friendly**: Works great on desktop and mobile devices
- ☁️ **Cloud Hosted on Vercel**: Access from anywhere on any device
- 🎨 **Beautiful UI**: Clean, modern design with gradient cards

---

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel-compatible backend with Google Sheets sync"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your `8806tracker` repository from GitHub
4. Click **"Import"**

### Step 3: Add Environment Variables
After importing, Vercel will ask for environment variables. Click **"Environment Variables"** and add these:

Copy all values from `.env.example` and paste them into Vercel:

| Key | Value |
|-----|-------|
| `GOOGLE_TYPE` | `service_account` |
| `GOOGLE_PROJECT_ID` | `tracker-488314` |
| `GOOGLE_PRIVATE_KEY_ID` | `57e5f042b659a366b21a42d5ab904c404ee753ea` |
| `GOOGLE_PRIVATE_KEY` | *(long key from .env.example)* |
| `GOOGLE_CLIENT_EMAIL` | `id-806tracker-app@tracker-488314.iam.gserviceaccount.com` |
| `GOOGLE_CLIENT_ID` | `114443947260773910715` |
| `GOOGLE_AUTH_URI` | `https://accounts.google.com/o/oauth2/auth` |
| `GOOGLE_TOKEN_URI` | `https://oauth2.googleapis.com/token` |
| `GOOGLE_AUTH_PROVIDER_X509_CERT_URL` | `https://www.googleapis.com/oauth2/v1/certs` |
| `GOOGLE_CLIENT_X509_CERT_URL` | *(from .env.example)* |
| `GOOGLE_UNIVERSE_DOMAIN` | `googleapis.com` |
| `GOOGLE_SHEET_ID` | `1-IeGKq9BR4yrkly2OHJQgnn4ezFbqVVGd1u7oEBlTco` |

**⚠️ IMPORTANT:** Never share these values publicly. Vercel keeps them encrypted.

### Step 4: Deploy
Click **"Deploy"** and wait 1-2 minutes for your app to go live.

Your public URL will be something like: `https://8806tracker-xyz.vercel.app`

---

## 📱 Access Your App

Once deployed, open the Vercel URL on any browser:
- **Desktop**: Full experience
- **Mobile**: Fully responsive
- **Tablet**: Touch-optimized

Bookmark it or share the link with anyone who needs access!

---

## 🔄 How It Works

### Adding a Vendor
1. Fill in vendor name, work type, agreed amount
2. Click "Add Vendor"
3. **Instantly appears in your Google Sheet** ✨

### Recording Payments
1. Enter payment amount and method
2. Click "Add Payment"
3. **Google Sheet updates in real-time**

### Editing/Deleting
- Click "Edit" or "Delete"
- Changes sync to Google Sheet automatically

### Restore from Daily Backups
- Click "Restore" button in header
- Recover any previous day's data (last 30 days)

---

## 📊 Google Sheet Structure

Your Google Sheet (`Vendors` tab) should have these columns:

| A | B | C | D | E |
|---|---|---|---|---|
| Vendor Name | Work Type | Agreed Amount | Paid Amount | Payments (JSON) |

The app automatically manages columns D and E. You can edit columns A-C directly in Google Sheets.

---

## 🛠️ Local Development (Optional)

To test locally before deploying to Vercel:

### Install & Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000`

### Create .env file locally
Copy `.env.example` to `.env` and it will use local environment variables.

---

## API Endpoints (Vercel)

Vercel automatically routes API calls to the `/api` folder:

- `GET /api/vendors` - Fetch all vendors
- `POST /api/vendors` - Add a vendor
- `POST /api/vendors_payment` - Record a payment
- `PUT /api/vendors_id?id=X` - Update vendor
- `DELETE /api/vendors_id?id=X` - Delete vendor

---

## 🔐 Security

- Service account credentials stored **securely in Vercel** (never in code)
- `.env` files are in `.gitignore` (never pushed to GitHub)
- `server.js` removed (Vercel uses serverless functions instead)
- All API calls use OAuth with Google Sheets API

---

## 📚 File Structure

```
8806tracker/
├── index.html          # Frontend (never changes - loaded as static)
├── api/
│   ├── vendors.js      # GET/POST vendors
│   ├── vendors_id.js   # PUT/DELETE single vendor
│   └── vendors_payment.js  # POST payment
├── .env.example        # Copy to Vercel environment variables
├── .gitignore          # Keeps secrets out of Git
├── package.json        # Dependencies (minimal for Vercel)
└── README.md           # This file
```

---

## ❓ FAQ

**Q: Can I edit the Google Sheet directly?**  
A: Yes! Edit columns A-B (Vendor Name, Work Type). The app will read those changes when you refresh.

**Q: What if I lose my Vercel app?**  
A: Redeploy from GitHub anytime. Your data stays in Google Sheets.

**Q: Can I share this with my team?**  
A: Yes! Just share the Vercel URL. Anyone can access it instantly.

**Q: How do I update the app after deploying?**  
A: Push changes to GitHub → Vercel auto-redeploys. No manual steps needed.

**Q: Can multiple people use it at the same time?**  
A: Yes! All changes sync to Google Sheets, so everyone sees real-time updates.

---

## 🐛 Troubleshooting

**App shows blank or "Failed to fetch vendors"**
- Check that environment variables are set in Vercel dashboard
- Verify the service account has editor access to your Google Sheet
- Open browser DevTools (F12) → Console tab for error messages

**Changes not syncing to Google Sheet**
- Verify `GOOGLE_SHEET_ID` is correct in Vercel environment variables
- Check that the sheet name is exactly "Vendors"
- Try refreshing the page

**"Method Not Allowed" errors**
- Check that your request matches the correct HTTP method (GET, POST, PUT, DELETE)
- Verify the API endpoint path is correct

---

## 📄 License

MIT - Free to use and modify

---

**Built with ❤️ for construction project tracking**

