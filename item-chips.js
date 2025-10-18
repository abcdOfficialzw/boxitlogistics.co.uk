// Item selection chips functionality for Boxit Logistics

// Items data array - easily modify this to add/remove items
const ITEMS_DATA = [
  { name: 'Washing Machine', icon: 'washing-machine' },
  { name: 'Tumble Dryer', icon: 'wind' },
  { name: 'American Fridge Freezer', icon: 'refrigerator' },
  { name: 'Double Door Fridge', icon: 'refrigerator' },
  { name: 'Freezer', icon: 'snowflake' },
  { name: 'Chest of Drawers', icon: 'archive' },
  { name: 'Bedside Table', icon: 'table' },
  { name: 'Carpets', icon: 'square' }
];

// Global state for selected items
let selectedItems = {};

// Function to update the hidden form field with selected items
function updateSelectedItemsDisplay() {
  const selectedItemsArray = Object.entries(selectedItems).map(([item, quantity]) => {
    return quantity > 1 ? `${item} (x${quantity})` : item;
  });
  document.getElementById('selected_items').value = selectedItemsArray.join(', ');
}

// Function to update the visual appearance of a chip
function updateChipDisplay(chip, itemName, quantity) {
  const itemText = chip.querySelector('.item-text');
  
  if (quantity > 0) {
    // Selected state
    itemText.textContent = quantity > 1 ? `${itemName} (x${quantity})` : itemName;
    chip.classList.remove('border-slate-300', 'bg-white', 'text-slate-700');
    chip.classList.add('border-brand-orange', 'bg-brand-orange', 'text-white');
    
    // Add X button if not already present
    if (!chip.querySelector('.remove-item')) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-item ml-1 hover:bg-brand-orange-dark rounded-full p-0.5 transition-colors';
      removeBtn.innerHTML = '<i data-lucide="x" class="h-3 w-3"></i>';
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        resetChip(chip, itemName);
      });
      chip.appendChild(removeBtn);
      
      // Reinitialize lucide icons for the new element
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
      }
    }
  } else {
    // Unselected state
    itemText.textContent = itemName;
    chip.classList.remove('border-brand-orange', 'bg-brand-orange', 'text-white');
    chip.classList.add('border-slate-300', 'bg-white', 'text-slate-700');
    
    // Remove X button
    const removeBtn = chip.querySelector('.remove-item');
    if (removeBtn) {
      removeBtn.remove();
    }
  }
}

// Function to reset a chip to unselected state
function resetChip(chip, itemName) {
  chip.dataset.quantity = '0';
  delete selectedItems[itemName];
  updateChipDisplay(chip, itemName, 0);
  updateSelectedItemsDisplay();
}

// Function to get the current selected items (for use by other modules)
function getSelectedItems() {
  return { ...selectedItems }; // Return a copy to prevent external modification
}

// Function to get selected items as formatted string
function getSelectedItemsString() {
  const selectedItemsArray = Object.entries(selectedItems).map(([item, quantity]) => {
    return quantity > 1 ? `${item} (x${quantity})` : item;
  });
  return selectedItemsArray.join(', ');
}

// Function to get selected items in the format "bed x2, Sofa x4, Wardrobe x1"
function getSelectedItemsFormatted() {
  const selectedItemsArray = Object.entries(selectedItems).map(([item, quantity]) => {
    return quantity > 1 ? `${item} x${quantity}` : item;
  });
  return selectedItemsArray.join(', ');
}

// Function to render item chips dynamically
function renderItemChips() {
  const container = document.getElementById('items-container');
  if (!container) return;
  
  // Clear existing chips
  container.innerHTML = '';
  
  // Create chips from data
  ITEMS_DATA.forEach(function(item) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'item-chip inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange hover:bg-brand-cream hover:text-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-colors';
    chip.dataset.item = item.name;
    chip.dataset.icon = item.icon;
    chip.dataset.quantity = '0';
    
    chip.innerHTML = `
      <i data-lucide="${item.icon}" class="h-3.5 w-3.5"></i>
      <span class="item-text">${item.name}</span>
    `;
    
    container.appendChild(chip);
  });
  
  // Reinitialize lucide icons for the new elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }
}

// Initialize item chips functionality
function initializeItemChips() {
  // First render the chips
  renderItemChips();
  
  // Then add event listeners
  document.querySelectorAll('.item-chip').forEach(function(chip) {
    chip.addEventListener('click', function(e) {
      // Don't trigger if clicking the X button
      if (e.target.closest('.remove-item')) {
        return;
      }
      
      const itemName = this.dataset.item;
      let quantity = parseInt(this.dataset.quantity) || 0;
      
      // Increase quantity
      quantity++;
      this.dataset.quantity = quantity;
      
      // Update selected items
      selectedItems[itemName] = quantity;
      
      // Update chip display
      updateChipDisplay(this, itemName, quantity);
      
      // Update form data
      updateSelectedItemsDisplay();
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeItemChips();
});
