# WhatsApp Gemini AI Chatbot 🤖

A powerful WhatsApp chatbot powered by Google's Gemini AI with conversation history stored in Supabase.

## Features ✨

- 🤖 **AI-Powered Responses**: Uses Google Gemini AI for intelligent conversations
- 💾 **Conversation Memory**: Stores last 20 messages per user in Supabase
- 📱 **WhatsApp Integration**: Full WhatsApp Cloud API integration
- 🔧 **Command Support**: Built-in commands for help, clear history, and info
- ⚡ **Real-time Processing**: Fast message processing with typing indicators
- 🛡️ **Error Handling**: Robust error handling and logging
- 📊 **Health Monitoring**: Health check endpoints for monitoring

## Prerequisites 📋

- Node.js 18+ installed
- WhatsApp Business Account with Cloud API access
- Google AI Studio API key for Gemini
- Supabase account with a database

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-gemini-chatbot.git
cd whatsapp-gemini-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env` (if not already done)
- Update the values with your actual credentials

4. Set up Supabase table:
```sql
CREATE TABLE chatbot_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON chatbot_history(user_id);
CREATE INDEX idx_created_at ON chatbot_history(created_at DESC);
```

## Running the Application 🏃

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on port 3000 (or the port specified in .env).

## Webhook Configuration 🔗

1. Your webhook URL will be: `https://your-domain.com/webhook`
2. Configure this URL in your WhatsApp Cloud API settings
3. Use the verify token from your `.env` file

### Using ngrok for local development:
```bash
ngrok http 3000
```
Then use the ngrok URL as your webhook URL.

## Available Commands 📝

Users can send these commands to the bot:

- `/help` - Show available commands
- `/clear` or `/reset` - Clear conversation history
- `/info` - Show bot information and message count

## API Endpoints 🌐

- `GET /` - API information
- `GET /webhook` - WhatsApp webhook verification
- `POST /webhook` - Receive WhatsApp messages
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information

## Project Structure 📁

```
whatsapp-gemini-chatbot/
├── src/
│   ├── config/
│   │   └── config.js          # Configuration management
│   ├── controllers/
│   │   └── messageProcessor.js # Message processing logic
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling middleware
│   ├── routes/
│   │   ├── webhook.js         # WhatsApp webhook routes
│   │   └── health.js          # Health check routes
│   ├── services/
│   │   ├── whatsappService.js # WhatsApp API integration
│   │   ├── geminiService.js   # Gemini AI integration
│   │   └── supabaseService.js # Database operations
│   ├── utils/
│   │   └── logger.js          # Logging utility
│   └── index.js               # Application entry point
├── .env                       # Environment variables
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── README.md                 # Documentation
└── changelog.md              # Change log
```

## Environment Variables 🔐

| Variable | Description | Required |
|----------|-------------|----------|
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token | Yes |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API access token | Yes |
| `WHATSAPP_PHONE_ID` | WhatsApp phone number ID | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GEMINI_TIMEOUT` | API timeout in milliseconds | No (default: 8000) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting 🔧

### Bot not responding:
1. Check webhook URL configuration in WhatsApp settings
2. Verify all environment variables are set correctly
3. Check server logs for errors
4. Ensure Supabase table exists and is accessible

### Gemini API errors:
1. Verify API key is valid
2. Check API quota limits
3. Ensure internet connectivity

### Database errors:
1. Verify Supabase credentials
2. Check table structure matches expected schema
3. Ensure database is not at capacity

## Security Considerations 🔒

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Implement rate limiting for production
- Consider implementing webhook signature validation
- Use HTTPS in production

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License 📄

ISC License

## Support 💬

For issues or questions, please open an issue on GitHub or contact support.

---

Built with ❤️ using Node.js, Gemini AI, and Supabase
