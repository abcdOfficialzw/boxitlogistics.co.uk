// Form handling logic for Boxit Logistics quote requests

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

      // Submit to Google Sheets
      try {
        const sheetResult = await submitToGoogleSheets(processedData);
        if (sheetResult.success) {
          console.log('✅ Successfully added to Google Sheets');
        } else {
          console.warn('⚠️ Failed to add to Google Sheets:', sheetResult.error);
        }
      } catch (error) {
        console.error('❌ Error submitting to Google Sheets:', error);
      }

      // Redirect to WhatsApp with prefilled message
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
      }, 2000); // Wait 2 seconds to show the confirmation message first

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
      const buttonContainer = form.querySelector('#whatsapp-button-container');
      if (buttonContainer && typeof showWhatsAppButton === 'function') {
        showWhatsAppButton(processedData, buttonContainer);
      }
      
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    });
  });
});
