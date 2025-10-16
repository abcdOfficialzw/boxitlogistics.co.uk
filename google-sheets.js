// Google Sheets integration for Boxit Logistics

class GoogleSheetsAPI {
  constructor() {
    this.sheetId = CONFIG.GOOGLE_SHEET_ID;
    this.apiKey = CONFIG.GOOGLE_API_KEY;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    this.clientId = CONFIG.GOOGLE_CLIENT_ID;
    this.accessToken = null;
  }

  // Function to authenticate with Google OAuth2
  async authenticate() {
    return new Promise((resolve, reject) => {
      if (typeof gapi === 'undefined') {
        reject(new Error('Google API not loaded. Please include the Google API script.'));
        return;
      }

      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.clientId,
          scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance.isSignedIn.get()) {
            this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
            resolve(this.accessToken);
          } else {
            authInstance.signIn().then(() => {
              this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
              resolve(this.accessToken);
            }).catch(reject);
          }
        }).catch(reject);
      });
    });
  }

  // Function to append data to Google Sheet
  async appendToSheet(formData) {
    try {
      // Authenticate first
      if (!this.accessToken) {
        await this.authenticate();
      }

      // Prepare the data in the correct format for the sheet
      const values = this.formatDataForSheet(formData);
      
      // Create the request URL (no API key needed with OAuth2)
      const url = `${this.baseUrl}/${this.sheetId}/values/${CONFIG.SHEET_NAME}!${CONFIG.RANGE}:append?valueInputOption=RAW`;
      
      // Prepare the request body
      const requestBody = {
        values: [values]
      };

      console.log('Sending data to Google Sheets:', requestBody);

      // Make the API request with OAuth2 token
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Sheets API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: url
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Successfully added to Google Sheets:', result);
      return result;

    } catch (error) {
      console.error('Error adding to Google Sheets:', error);
      throw error;
    }
  }

  // Function to format form data for the sheet
  formatDataForSheet(formData) {
    const mapping = CONFIG.COLUMN_MAPPING;
    
    // Create array with values in the correct column order
    const values = [
      formData[mapping.A] || '', // timestamp
      formData[mapping.B] || '', // name
      formData[mapping.C] || '', // phone
      formData[mapping.D] || '', // pickup_address
      formData[mapping.E] || '', // dropoff_address
      formData[mapping.F] || ''  // selected_items_formatted
    ];

    return values;
  }

  // Function to test the connection (optional)
  async testConnection() {
    try {
      const url = `${this.baseUrl}/${this.sheetId}?key=${this.apiKey}`;
      console.log('Testing connection to:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Connection test failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Google Sheets connection test successful:', result.title);
      return true;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }

  // Function to test sheet access specifically
  async testSheetAccess() {
    try {
      const url = `${this.baseUrl}/${this.sheetId}/values/${CONFIG.SHEET_NAME}!A1:Z1?key=${this.apiKey}`;
      console.log('Testing sheet access to:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sheet access test failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Sheet access test successful:', result);
      return true;
    } catch (error) {
      console.error('Sheet access test failed:', error);
      return false;
    }
  }
}

// Create a global instance
const googleSheets = new GoogleSheetsAPI();

// Function to handle form submission to Google Sheets
async function submitToGoogleSheets(formData) {
  try {
    // Check if API key is configured
    if (CONFIG.GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('Google Sheets API key not configured. Skipping sheet submission.');
      return { success: false, error: 'API key not configured' };
    }

    // Submit to Google Sheets
    const result = await googleSheets.appendToSheet(formData);
    return { success: true, result: result };
    
  } catch (error) {
    console.error('Failed to submit to Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

// Debug function to test API access
async function debugGoogleSheetsAPI() {
  console.log('🔍 Starting Google Sheets API Debug...');
  console.log('Sheet ID:', CONFIG.GOOGLE_SHEET_ID);
  console.log('API Key:', CONFIG.GOOGLE_API_KEY.substring(0, 10) + '...');
  
  try {
    // Test 1: Basic connection
    console.log('\n📡 Test 1: Basic Connection');
    const connectionTest = await googleSheets.testConnection();
    console.log('Connection test result:', connectionTest);
    
    // Test 2: Sheet access
    console.log('\n📊 Test 2: Sheet Access');
    const sheetTest = await googleSheets.testSheetAccess();
    console.log('Sheet access test result:', sheetTest);
    
    return { connectionTest, sheetTest };
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return { error: error.message };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GoogleSheetsAPI, submitToGoogleSheets, debugGoogleSheetsAPI };
} else {
  window.submitToGoogleSheets = submitToGoogleSheets;
  window.googleSheets = googleSheets;
  window.debugGoogleSheetsAPI = debugGoogleSheetsAPI;
}
