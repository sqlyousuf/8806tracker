// This script imports sample vendor data into your Google Sheet
// Run with: node import-data.js

const { google } = require('googleapis');
require('dotenv').config();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Vendors';

// Sample vendor data from your original app
const vendorData = [
  {
    name: 'Windows Material',
    workType: 'Material Only',
    agreedAmount: 5918.00,
    paidAmount: 0,
    payments: []
  },
  {
    name: 'Honey Bucket',
    workType: 'Material Only',
    agreedAmount: 192.85,
    paidAmount: 192.85,
    payments: [{ amount: 192.85, date: '2026-02-23', method: 'Credit Card' }]
  },
  {
    name: 'Henry Framer',
    workType: 'Labor Only',
    agreedAmount: 27300.00,
    paidAmount: 4000.00,
    payments: [{ amount: 4000.00, date: '2026-02-23', method: 'Zelle' }]
  },
  {
    name: 'Builders First Resource',
    workType: 'Material Only',
    agreedAmount: 50856.14,
    paidAmount: 29272.08,
    payments: [
      { amount: 19798.00, date: '2026-02-23', method: 'Credit Card' },
      { amount: 9474.08, date: '2026-02-23', method: 'Credit Card' }
    ]
  },
  {
    name: 'American Trusses',
    workType: 'Material Only',
    agreedAmount: 9705.00,
    paidAmount: 9705.00,
    payments: [{ amount: 9705.00, date: '2026-02-23', method: 'Credit Card' }]
  },
  {
    name: 'Labor Lunch Foundation',
    workType: 'Labor & Material',
    agreedAmount: 110.00,
    paidAmount: 110.00,
    payments: [{ amount: 110.00, date: '2026-02-23', method: 'Credit Card' }]
  },
  {
    name: 'Habib Engineer Inspection',
    workType: 'Labor Only',
    agreedAmount: 300.00,
    paidAmount: 300.00,
    payments: [{ amount: 300.00, date: '2026-02-23', method: 'Zelle' }]
  },
  {
    name: 'Waseem/Rene Plumber',
    workType: 'Labor Only',
    agreedAmount: 4000.00,
    paidAmount: 4000.00,
    payments: [{ amount: 4000.00, date: '2026-02-23', method: 'Zelle' }]
  },
  {
    name: 'Alfa Foundation',
    workType: 'Labor & Material',
    agreedAmount: 33500.00,
    paidAmount: 33500.00,
    payments: [
      { amount: 20000.00, date: '2026-02-23', method: 'Cash' },
      { amount: 13500.00, date: '2026-02-23', method: 'Zelle' }
    ]
  }
];

async function importData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet to check if Vendors sheet exists
    console.log('Checking spreadsheet structure...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    let vendorsSheetId = null;
    for (const sheet of spreadsheet.data.sheets || []) {
      if (sheet.properties.title === SHEET_NAME) {
        vendorsSheetId = sheet.properties.sheetId;
        break;
      }
    }

    // If Vendors sheet doesn't exist, create it
    if (vendorsSheetId === null) {
      console.log('Creating "Vendors" sheet...');
      const addSheetResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: {
          requests: [{
            addSheet: {
              properties: { title: SHEET_NAME }
            }
          }]
        }
      });
      vendorsSheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
    }

    // First, add headers
    console.log('Adding headers...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${SHEET_NAME}'!A1:E1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['Vendor Name', 'Work Type', 'Agreed Amount', 'Paid Amount', 'Payments (JSON)']]
      }
    });

    // Convert vendor data to sheet rows
    const rows = vendorData.map(vendor => [
      vendor.name,
      vendor.workType,
      vendor.agreedAmount,
      vendor.paidAmount,
      JSON.stringify(vendor.payments)
    ]);

    // Add vendor data
    console.log(`Importing ${rows.length} vendors...`);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `'${SHEET_NAME}'!A:E`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: rows }
    });

    console.log('✅ Data imported successfully!');
    console.log(`📊 Added ${rows.length} vendors to your Google Sheet.`);
    console.log('🌐 Your app is now ready to use!');
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
}

importData();
