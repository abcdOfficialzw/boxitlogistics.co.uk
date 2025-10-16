// WhatsApp integration for Boxit Logistics

class WhatsAppIntegration {
  constructor() {
    this.phoneNumber = CONFIG.WHATSAPP_PHONE;
    this.businessName = CONFIG.BUSINESS_NAME;
  }

  // Function to generate WhatsApp URL with prepopulated message
  generateWhatsAppURL(formData) {
    const message = this.createMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = this.phoneNumber.replace(/\D/g, ''); // Remove non-digits
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  // Function to create the prepopulated message
  createMessage(formData) {
    const name = formData.name || 'Customer';
    const items = formData.selected_items_formatted || formData.selected_items || 'Various items';
    const pickup = formData.pickup_address || 'Not specified';
    const dropoff = formData.dropoff_address || 'Not specified';
    
    return `Hi ${this.businessName}, 

My name is ${name} and I've just submitted a quote request on your website. 

Here are my details:
• Items to move: ${items}
• Pickup address: ${pickup}
• Dropoff address: ${dropoff}
• My phone: ${formData.phone || 'Not provided'}

Please take a look at my request and get back to me with a quotation. 

Thank you!`;
  }

  // Function to open WhatsApp with prepopulated message
  openWhatsApp(formData) {
    try {
      const whatsappURL = this.generateWhatsAppURL(formData);
      console.log('Opening WhatsApp with URL:', whatsappURL);
      
      // Open WhatsApp in a new tab/window
      window.open(whatsappURL, '_blank');
      
      return { success: true, url: whatsappURL };
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }

  // Function to create a WhatsApp button element
  createWhatsAppButton(formData, buttonText = 'Continue to WhatsApp') {
    const button = document.createElement('a');
    button.href = this.generateWhatsAppURL(formData);
    button.target = '_blank';
    button.className = 'inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30 transition-colors';
    button.innerHTML = `
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
      ${buttonText}
    `;
    
    return button;
  }
}

// Create a global instance
const whatsappIntegration = new WhatsAppIntegration();

// Function to handle WhatsApp redirect after form submission
function redirectToWhatsApp(formData) {
  try {
    console.log('🔄 Redirecting to WhatsApp...');
    const result = whatsappIntegration.openWhatsApp(formData);
    
    if (result.success) {
      console.log('✅ WhatsApp opened successfully');
      return result;
    } else {
      console.error('❌ Failed to open WhatsApp:', result.error);
      return result;
    }
  } catch (error) {
    console.error('❌ Error in WhatsApp redirect:', error);
    return { success: false, error: error.message };
  }
}

// Function to show WhatsApp button in confirmation UI
function showWhatsAppButton(formData, container) {
  try {
    const whatsappButton = whatsappIntegration.createWhatsAppButton(formData, 'Continue to WhatsApp');
    container.appendChild(whatsappButton);
    return whatsappButton;
  } catch (error) {
    console.error('❌ Error creating WhatsApp button:', error);
    return null;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WhatsAppIntegration, redirectToWhatsApp, showWhatsAppButton };
} else {
  window.redirectToWhatsApp = redirectToWhatsApp;
  window.showWhatsAppButton = showWhatsAppButton;
  window.whatsappIntegration = whatsappIntegration;
}
