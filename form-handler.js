// Form handling logic for Boxit Logistics quote requests

// Function to submit data to Google Sheets via AppScript
async function submitToAppScript(formData) {
  try {
    // Map form data to AppScript endpoint format
    const appScriptData = {
      name: formData.name || '',
      phone: formData.phone || '',
      pickup: formData.pickup_address || '',
      dropoff: formData.dropoff_address || '',
      selected_items_formatted: formData.selected_items_formatted || '',
      contact_method: formData.contact_method || '',
      email: formData.email || '',
      message: formData.message || ''
    };

    console.log('Submitting to AppScript:', appScriptData);

    // Send as a CORS-simple request to avoid preflight (no custom headers)
    const response = await fetch(CONFIG.GOOGLE_APPSCRIPT_URL, {
      method: 'POST',
      // text/plain is CORS-safelisted; Apps Script can JSON.parse(e.postData.contents)
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(appScriptData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log('AppScript response:', result);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('AppScript submission error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Variant that targets a specific endpoint (used to route contact vs hero forms)
async function submitToAppScriptWithEndpoint(formData, endpointUrl) {
  try {
    const appScriptData = {
      name: formData.name || '',
      phone: formData.phone || '',
      pickup: formData.pickup_address || '',
      dropoff: formData.dropoff_address || '',
      selected_items_formatted: formData.selected_items_formatted || '',
      contact_method: formData.contact_method || '',
      email: formData.email || '',
      message: formData.message || ''
    };

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(appScriptData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.text();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Function to process form submission and log details
function processQuoteRequest(formData) {
  console.log('=== QUOTE REQUEST SUBMITTED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Form Source:', formData.source || 'Unknown');
  console.log('Page URL:', formData.page || window.location.href);
  console.log('');
  
  console.log('=== CUSTOMER DETAILS ===');
  console.log('Name:', formData.name || 'Not provided');
  console.log('Phone:', formData.phone || 'Not provided');
  console.log('');
  
  console.log('=== MOVE DETAILS ===');
  console.log('Pickup Address (Postcode):', formData.pickup_address || 'Not provided');
  console.log('Dropoff Address (Postcode):', formData.dropoff_address || 'Not provided');
  console.log('');
  
  console.log('=== ITEMS TO MOVE ===');
  const selectedItems = formData.selected_items || 'No items selected';
  console.log('Selected Items (Raw):', selectedItems);
  
  // Parse selected items for better display
  if (selectedItems && selectedItems !== 'No items selected' && selectedItems.length > 0) {
    const itemsArray = selectedItems.split(', ');
    console.log('Items Breakdown:');
    itemsArray.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });
    
    // Also log in the requested format: "bed x2, Sofa x4, Wardrobe x1"
    const formattedItems = itemsArray.map(item => {
      // Convert "Bed (x3)" to "Bed x3" format
      return item.replace(/ \(x(\d+)\)/g, ' x$1');
    }).join(', ');
    console.log('Formatted Items:', formattedItems);
    
    // Also show the formatted items from the function if available
    if (formData.selected_items_formatted) {
      console.log('Formatted Items (from function):', formData.selected_items_formatted);
    }
  } else {
    console.log('No items selected');
  }
  console.log('');
  
  console.log('=== SUMMARY ===');
  console.log('Total form fields:', Object.keys(formData).length);
  console.log('Has items selected:', selectedItems !== 'No items selected' && selectedItems.length > 0);
  console.log('================================');
  
  return formData;
}

// Test function to verify AppScript integration (for development)
async function testAppScriptIntegration() {
  const testData = {
    name: 'Test User',
    phone: '0787980222',
    pickup_address: '1234',
    dropoff_address: '1234',
    selected_items_formatted: 'Bed x2, Sofa x3'
  };
  
  console.log('🧪 Testing AppScript integration...');
  const result = await submitToAppScript(testData);
  
  if (result.success) {
    console.log('✅ AppScript integration test successful!');
  } else {
    console.error('❌ AppScript integration test failed:', result.error);
  }
  
  return result;
}

// Uncomment the line below to test the integration
// testAppScriptIntegration();

// Initialize form functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Lead form handling: show confirmation and process data
  document.querySelectorAll('.lead-form').forEach(function(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
      }

      // Collect form data
      const data = Object.fromEntries(new FormData(form).entries());
      data.page = window.location.href;
      data.timestamp = new Date().toISOString();
      
      // Ensure selected items are included (in case the hidden field wasn't updated)
      if (typeof getSelectedItemsFormatted === 'function') {
        data.selected_items_formatted = getSelectedItemsFormatted();
      }

      // Process and log the quote request
      const processedData = processQuoteRequest(data);

      // Submit to AppScript: choose endpoint by form source
      try {
        const formLabel = (form.dataset.form || '').toLowerCase();
        const isContactForm = formLabel.includes('contact');
        const endpoint = isContactForm && CONFIG.CONTACT_APPSCRIPT_URL ? CONFIG.CONTACT_APPSCRIPT_URL : CONFIG.GOOGLE_APPSCRIPT_URL;

        const sheetResult = await submitToAppScriptWithEndpoint(processedData, endpoint);
        if (sheetResult.success) {
          console.log('✅ Submitted to AppScript');
        } else {
          console.warn('⚠️ AppScript submission failed:', sheetResult.error);
        }
      } catch (error) {
        console.error('❌ Error submitting to AppScript:', error);
      }

      // Only the hero quote form redirects to WhatsApp; contact form does not
      const isContactForm = (form.dataset.form || '').toLowerCase().includes('contact');
      if (!isContactForm) {
        setTimeout(() => {
          try {
            const whatsappResult = redirectToWhatsApp(processedData);
            if (whatsappResult.success) {
              console.log('✅ WhatsApp redirect initiated');
            } else {
              console.warn('⚠️ WhatsApp redirect failed:', whatsappResult.error);
            }
          } catch (error) {
            console.error('❌ Error with WhatsApp redirect:', error);
          }
        }, 2000);
      }

      // Confirmation UI
      const source = form.dataset.form || 'Enquiry';
      form.innerHTML = `
        <div class="rounded-lg border border-green-200 bg-green-50 p-4">
          <div class="flex items-start gap-3">
            <i data-lucide="check-circle2" class="h-5 w-5 text-green-600"></i>
            <div class="flex-1">
              <div class="text-sm font-semibold text-slate-900">Thank you — we'll get back to you shortly.</div>
              <p class="mt-1 text-sm text-slate-700">Your ${source.toLowerCase()} has been received. We typically respond within 24 hours. If it's urgent, please call us on <a href="tel:+441922123456" class="font-medium text-blue-700 hover:text-blue-800">01922 123 456</a>.</p>
              <div class="mt-3">
                <p class="text-xs text-slate-600 mb-2">You'll be redirected to WhatsApp in a moment, or click below:</p>
                <div id="whatsapp-button-container"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add WhatsApp button to the confirmation UI
      const isContact = (form.dataset.form || '').toLowerCase().includes('contact');
      const buttonContainer = form.querySelector('#whatsapp-button-container');
      if (!isContact && buttonContainer && typeof showWhatsAppButton === 'function') {
        showWhatsAppButton(processedData, buttonContainer);
      }
      
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    });
  });
});
