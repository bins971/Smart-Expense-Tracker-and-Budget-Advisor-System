### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Personal-finance-Tracker
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ..
   npm install
   ```

3. **Set up environment variables**

   Create a `backend/.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   GROQ_API_KEY=your_groq_api_key
   ```

   **Getting your MongoDB URI:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your database password

   **Getting your Groq API Key:**
   - Go to [Groq Console](https://console.groq.com/keys)
   - Sign up (it's free!)
   - Create a new API key
   - Copy the key (starts with `gsk_`)

4. **Start the application**

   ```bash
   # Terminal 1 - Start backend (from backend folder)
   cd backend
   npm start

   # Terminal 2 - Start frontend (from root folder)
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🔧 Tech Stack

**Frontend:**
- React.js
- Material-UI (MUI)
- Axios
- React Router
- Chart.js

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Groq AI SDK

## 📝 Available Scripts

**Backend:**
- `npm start` - Start backend server with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production



## 🔐 Security Notes

- Never commit your `.env` file
- Keep your API keys secure
- Use strong JWT secrets in production
- Enable MongoDB IP whitelist in production


