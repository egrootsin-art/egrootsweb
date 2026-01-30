# Google OAuth Setup Instructions

## Error: redirect_uri_mismatch

This error occurs when the callback URL in your code doesn't match what's configured in Google Cloud Console.

## How to Fix

### Step 1: Find Your Callback URL

Your callback URL is: **`http://localhost:5000/api/auth/google/callback`**

Check your backend console logs - it should show:
```
🔗 Google OAuth Callback URL: http://localhost:5000/api/auth/google/callback
```

### Step 2: Configure Google Cloud Console (Localhost Only)

**For localhost development, you only need:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**

5. **Authorized JavaScript origins** (where your frontend runs):
   ```
   http://localhost:8080
   ```

6. **Authorized redirect URIs** (where Google sends the callback - this is your BACKEND):
   ```
   http://localhost:5000/api/auth/google/callback
   ```

   **⚠️ Important:** 
   - Port 8080 = Frontend (Vite dev server)
   - Port 5000 = Backend (Express server) - **This is where the callback goes!**
   - You only need ONE redirect URI: `http://localhost:5000/api/auth/google/callback`

7. **Remove any other redirect URIs** that you don't need for localhost (like production domains)

8. Click **SAVE**

### Step 3: Verify Environment Variables

Make sure your `.env` file in the `backend` folder has:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
BACKEND_URL=http://localhost:5000
```

For production, set:
```env
BACKEND_URL=https://yourdomain.com
```

### Step 4: Restart Your Backend Server

After making changes, restart your backend server:
```bash
cd backend
npm start
```

### Important Notes

- The callback URL must match **EXACTLY** (including `http://` vs `https://`, port numbers, trailing slashes)
- For localhost, use `http://` (not `https://`)
- You can add multiple redirect URIs (one for localhost, one for production)
- Changes in Google Cloud Console may take a few minutes to propagate

### Testing

After adding the redirect URI:
1. Restart your backend server
2. Try signing in with Google again
3. Check the backend console logs to see the callback URL being used

If you still get the error, double-check that:
- The URL in the console logs matches exactly what you added in Google Cloud Console
- There are no extra spaces or typos
- You saved the changes in Google Cloud Console
