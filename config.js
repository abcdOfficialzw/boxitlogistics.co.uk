// Configuration for Boxit Logistics
// Note: In production, these should be stored securely and not exposed in client-side code

const CONFIG = {
  // Google AppScript Endpoint Configuration (Lead/Hero quote form)
  GOOGLE_APPSCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwX0YS9hNYCe4uEkLcEb92xWG2oelfzCDWYOQneYlVkqHuucxWdTDYo0faYjxeIiNayoQ/exec',

  // Google AppScript Endpoint Configuration (Contact form in "Ready to move" section)
  // Paste your new Apps Script Web App URL here
  CONTACT_APPSCRIPT_URL: 'https://script.google.com/macros/s/AKfycbz_494ackP55K0jQy7yobPlX_tio6OcVmrkjqCaGY27uJeFxJgYrb9zMjCVf0ES0z-DFA/exec',
  
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
