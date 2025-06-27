export default function validateEventForm(eventData) {
    const errors = {};
  
    if (!eventData.name?.trim()) errors.name = 'Event name is required';
    if (!eventData.dateTime) errors.dateTime = 'Event date & time is required';
    if (!eventData.location?.trim()) errors.location = 'Location is required';
  
    if (!eventData.maxCapacity || isNaN(eventData.maxCapacity) || Number(eventData.maxCapacity) <= 0) {
      errors.maxCapacity = 'Max capacity must be a positive number';
    }
  
    if (!eventData.walkInSlot || isNaN(eventData.walkInSlot) || Number(eventData.walkInSlot) < 0) {
      errors.walkInSlot = 'Walk-in slot must be 0 or more';
    }
  
    if (!eventData.closingDate) errors.closingDate = 'Pre-registration closing date/time is required';
    if (!eventData.description?.trim()) errors.description = 'Event description is required';
  
    if (!eventData.prePrice || isNaN(eventData.prePrice) || Number(eventData.prePrice) < 0) {
      errors.prePrice = 'Pre-registration price must be 0 or more';
    }
  
    if (!eventData.walkInPrice || isNaN(eventData.walkInPrice) || Number(eventData.walkInPrice) < 0) {
      errors.walkInPrice = 'Walk-in price must be 0 or more';
    }
  
    if (!eventData.shopifyProductId?.trim()) {
      errors.shopifyProductId = 'Please select a Shopify product';
    }
  
    return errors;
  }
  