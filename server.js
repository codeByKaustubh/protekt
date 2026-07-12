import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Twilio client:', err);
  }
} else {
  console.warn('Twilio credentials (TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN) are missing. Running in mock/dry-run mode.');
}

app.post('/api/send-sos', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Recipient phone ("to") and message are required.' });
  }

  // Formatting number (requires '+' prefix and country code, e.g. +91...)
  let formattedTo = to.trim().replace(/[^\d+]/g, '');
  if (!formattedTo.startsWith('+')) {
    if (formattedTo.length === 10) {
      formattedTo = '+91' + formattedTo;
    } else {
      formattedTo = '+' + formattedTo;
    }
  }

  console.log(`Sending emergency SMS to ${formattedTo}...`);

  if (!client) {
    console.log('[MOCK SMS SENT] To:', formattedTo, 'Msg:', message);
    return res.json({ 
      success: true, 
      mocked: true, 
      message: `SMS mock sent successfully to ${formattedTo} (Twilio credentials not configured in .env).` 
    });
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedTo
    });

    console.log(`SMS Sent Successfully! Message SID: ${response.sid}`);
    return res.json({ 
      success: true, 
      sid: response.sid,
      message: `Emergency SMS sent successfully to ${formattedTo}.`
    });
  } catch (err) {
    console.error('Twilio Error:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Failed to send SMS via Twilio.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`PROTEKT Emergency Alert Server is running on port ${PORT}`);
  console.log(`API endpoint available at: http://localhost:${PORT}/api/send-sos`);
});
