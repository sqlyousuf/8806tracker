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
  const vendorId = parseInt(req.query.id);
  if (req.method === 'PUT') {
    try {
      const { name, workType, agreedAmount } = req.body;
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
      });
      const rows = response.data.values || [];
      const rowIndex = vendorId + 1;
      if (rowIndex >= rows.length) return res.status(404).json({ error: 'Vendor not found' });
      const currentRow = rows[rowIndex];
      currentRow[0] = name;
      currentRow[1] = workType;
      currentRow[2] = agreedAmount;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex + 1}:E${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [currentRow] },
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update vendor' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
      });
      const rows = response.data.values || [];
      const rowIndex = vendorId + 1;
      if (rowIndex >= rows.length) return res.status(404).json({ error: 'Vendor not found' });
      const emptyRow = ['', '', '', '', ''];
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex + 1}:E${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [emptyRow] },
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete vendor' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
