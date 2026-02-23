import { google } from 'googleapis';

export default async function handler(req, res) {
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
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SHEET_NAME = 'Vendors';

  if (req.method === 'GET') {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
      });
      const rows = response.data.values || [];
      if (rows.length === 0) return res.status(200).json([]);
      const vendors = rows.slice(1).map((row, index) => ({
        id: index + 1,
        name: row[0] || '',
        workType: row[1] || '',
        agreedAmount: parseFloat(row[2]) || 0,
        paidAmount: parseFloat(row[3]) || 0,
        payments: row[4] ? JSON.parse(row[4]) : [],
      }));
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendors' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, workType, agreedAmount, initialPayment, paymentMethod } = req.body;
      const paymentHistory = initialPayment > 0
        ? [{ amount: initialPayment, date: new Date().toISOString().split('T')[0], method: paymentMethod }]
        : [];
      const newRow = [
        name,
        workType,
        agreedAmount,
        initialPayment || 0,
        JSON.stringify(paymentHistory),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [newRow] },
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add vendor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
