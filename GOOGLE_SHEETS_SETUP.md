# Google Sheets API Setup Guide

## Prerequisites
1. A Google account
2. Access to Google Cloud Console
3. The Google Sheet with ID: `1eVkUoE4CqoWHIaBlvzWIhrXjOpyVaIac_dl7UP6GtGs`

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Boxit Logistics Forms"
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create API Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit usage to Google Sheets API only

## Step 4: Configure Your Sheet

1. Open your Google Sheet: `1eVkUoE4CqoWHIaBlvzWIhrXjOpyVaIac_dl7UP6GtGs`
2. Make sure the sheet has the following columns (or adjust the mapping in `config.js`):
   - Column A: Timestamp
   - Column B: Name
   - Column C: Phone
   - Column D: Pickup Address
   - Column E: Dropoff Address
   - Column F: Items to Move

## Step 5: Update Configuration

1. Open `config.js`
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   GOOGLE_API_KEY: 'your_actual_api_key_here',
   ```

## Step 6: Test the Integration

1. Open your website
2. Fill out the form and submit
3. Check the browser console for success/error messages
4. Check your Google Sheet to see if the data was added

## Security Notes

⚠️ **Important**: The current setup exposes the API key in client-side code. For production:

1. **Use a backend service** to handle Google Sheets API calls
2. **Implement rate limiting** to prevent abuse
3. **Use OAuth 2.0** for better security
4. **Set up API key restrictions** in Google Cloud Console

## Troubleshooting

### Common Issues:

1. **"API key not valid"**: Check that the API key is correct and Google Sheets API is enabled
2. **"Permission denied"**: Make sure the Google Sheet is accessible (not private)
3. **"Sheet not found"**: Verify the Sheet ID is correct
4. **CORS errors**: This is expected with client-side API calls. Consider using a backend service.

### Testing the Connection:

You can test the connection by opening the browser console and running:
```javascript
googleSheets.testConnection();
```

## Data Format

The form data will be appended to your sheet in this format:
- **Column A**: Timestamp (ISO format)
- **Column B**: Customer Name
- **Column C**: Phone Number
- **Column D**: Pickup Address (Postcode)
- **Column E**: Dropoff Address (Postcode)
- **Column F**: Items to Move (formatted as "Bed x2, Sofa x4, Wardrobe")

## Next Steps

Once this is working, you can:
1. Set up email notifications
2. Add WhatsApp integration
3. Implement a backend service for better security
4. Add form validation and error handling
