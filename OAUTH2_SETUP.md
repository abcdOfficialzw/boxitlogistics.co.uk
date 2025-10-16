# OAuth2 Setup for Google Sheets API

## Why OAuth2 is Required

The Google Sheets API requires OAuth2 authentication for **write operations** (like appending data). API keys only work for read operations on public sheets.

## Step 1: Create OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add your domain to "Authorized JavaScript origins":
   - `http://localhost` (for testing)
   - `https://yourdomain.com` (for production)
7. Click "Create"
8. Copy the **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

## Step 2: Update Configuration

1. Open `config.js`
2. Replace `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` with your actual Client ID:
   ```javascript
   GOOGLE_CLIENT_ID: '123456789-abcdefg.apps.googleusercontent.com',
   ```

## Step 3: Enable Required APIs

Make sure these APIs are enabled in Google Cloud Console:
1. **Google Sheets API** (for reading/writing sheets)
2. **Google Drive API** (for accessing the sheet)

## Step 4: Test the Integration

1. Open your website
2. Fill out the form and submit
3. You should see a Google OAuth popup asking for permission
4. Grant permission to access Google Sheets
5. The form data should be added to your sheet

## How It Works

1. **User submits form** → JavaScript triggers OAuth2 flow
2. **Google OAuth popup** → User grants permission
3. **Access token received** → Used to authenticate API calls
4. **Data appended** → Form data is added to Google Sheet

## Security Notes

- The OAuth2 flow is secure and handled by Google
- Users must explicitly grant permission
- Access tokens are temporary and expire
- No sensitive credentials are stored in your code

## Troubleshooting

### "Google API not loaded" Error
- Make sure the Google API script is included: `<script src="https://apis.google.com/js/api.js"></script>`

### "Invalid client ID" Error
- Check that your Client ID is correct in `config.js`
- Verify the domain is added to "Authorized JavaScript origins"

### "Access denied" Error
- Make sure the Google Sheets API is enabled
- Check that your sheet is accessible

### OAuth Popup Blocked
- Some browsers block popups by default
- Users may need to allow popups for your site

## Alternative: Service Account (Advanced)

For server-side applications, you can use a Service Account instead of OAuth2:
1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Use the service account email to share your Google Sheet
4. Use the service account credentials for API calls

This approach is more secure but requires a backend server.
