const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const TOKEN = '6157796070:AAFU6ucF7bCwAkCuzpgS0G1Knorc_W1gVdw'; // Replace with your bot's token
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = `https://your-server-url.com${URI}`; // Replace with your server URL

app.use(bodyParser.json());

// Set webhook
app.post('/setWebhook', async (req, res) => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: WEBHOOK_URL,
    });
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Handle incoming webhook updates
app.post(URI, async (req, res) => {
  const message = req.body.message;
  console.log('Received message:', message);

  const chatId = message.chat.id;
  const text = message.text;

  // Example: Reply with a simple text message
  if (text === '/start') {
    await sendMessage(chatId, 'Welcome to your bot!');
  } else {
    await sendMessage(chatId, `You said: ${text}`);
  }

  return res.send();
});

// Function to send a message
const sendMessage = async (chatId, text) => {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  } catch (error) {
    console.log('Error sending message:', error.message);
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Setting webhook...');
  try {
    await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: WEBHOOK_URL,
    });
    console.log('Webhook set successfully!');
  } catch (error) {
    console.log('Error setting webhook:', error.message);
  }
});
