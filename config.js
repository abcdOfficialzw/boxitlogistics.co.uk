// Configuration for Boxit Logistics
// Note: In production, these should be stored securely and not exposed in client-side code

const CONFIG = {
  // Google AppScript Endpoint Configuration
  GOOGLE_APPSCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzK-o07KdWFkpC-2qvOnObRcgjsLx1pAFdgrR9DOZ7VCFelZSnThzgy8XnuqgZ6F7Vvfw/exec',
  
  // WhatsApp Configuration
  WHATSAPP_PHONE: '447497460219', // Business WhatsApp number
  BUSINESS_NAME: 'Boxit Logistics and Storage'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
