// Configuration for Boxit Logistics
// Note: In production, these should be stored securely and not exposed in client-side code

const CONFIG = {
  // Google Sheets Configuration
  GOOGLE_SHEET_ID: '1eVkUoE4CqoWHIaBlvzWIhrXjOpyVaIac_dl7UP6GtGs',
  
  // Google Sheets API Configuration
  // You'll need to get an API key from Google Cloud Console
  GOOGLE_API_KEY: 'AIzaSyA-AIzaSyCBTa93Iad1oEKp4XYDOuOmXSowZhIVnx4', // Replace with your actual API key
  
  // OAuth2 Client ID (required for write operations)
  // Get this from Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client IDs
  GOOGLE_CLIENT_ID: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com', // Replace with your actual client ID
  
  // Sheet configuration
  SHEET_NAME: 'Sheet1', // or whatever your sheet tab is named
  RANGE: 'A:F', // Columns A through F for the data
  
  // Form field mapping to sheet columns
  COLUMN_MAPPING: {
    A: 'timestamp',
    B: 'name', 
    C: 'phone',
    D: 'pickup_address',
    E: 'dropoff_address',
    F: 'selected_items_formatted'
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
