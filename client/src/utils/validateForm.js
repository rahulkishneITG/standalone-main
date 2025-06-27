export default function validateEventForm(eventData) {
    const errors = {};
    const now = new Date();
    const eventDateTime = new Date(eventData.dateTime);
    const closingDateTime = new Date(eventData.closingDate);
  
    // Event Name
    if (!eventData.name?.trim()) {
      errors.name = 'Event name is required';
    } else if (eventData.name.trim().length < 3) {
      errors.name = 'Event name must be at least 3 characters';
    }
  
    // Event Date
    if (!eventData.dateTime) {
      errors.dateTime = 'Event date & time is required';
    } else if (eventDateTime <= now) {
      errors.dateTime = 'Event date must be in the future';
    }
  
    // Closing Date
    if (!eventData.closingDate) {
      errors.closingDate = 'Pre-registration closing date/time is required';
    } else if (closingDateTime <= now) {
      errors.closingDate = 'Closing date must be in the future';
    } else if (closingDateTime > eventDateTime) {
      errors.closingDate = 'Closing date/time cannot be after the event date/time';
    }
  
    // Location
    if (!eventData.location?.trim()) {
      errors.location = 'Location is required';
    }
  
    // Max Capacity & Walk-in Slots
    const maxCap = Number(eventData.maxCapacity);
    const walkIn = Number(eventData.walkInSlot);
  
    if (eventData.maxCapacity === '') {
      errors.maxCapacity = 'Max capacity is required';
    } else if (isNaN(maxCap) || maxCap <= 10) {
      errors.maxCapacity = 'Max capacity must be greater than 10';
    }
  
    if (eventData.walkInSlot === '') {
      errors.walkInSlot = 'Walk-in slots is required';
    } else if (isNaN(walkIn) || walkIn < 0) {
      errors.walkInSlot = 'Walk-in slots must be 0 or more';
    } else if (walkIn > maxCap) {
      errors.walkInSlot = 'Walk-in slots cannot exceed max capacity';
    }
  
    // Description
    if (!eventData.description?.trim()) {
      errors.description = 'Event description is required';
    }
  
    // Pre-registration Price
    if (eventData.prePrice === '') {
      errors.prePrice = 'Pre-registration price is required';
    } else {
      const pre = Number(eventData.prePrice);
      if (isNaN(pre) || pre < 0) {
        errors.prePrice = 'Pre-registration price must be 0 or more';
      }
    }
  
    // Walk-in Price
    if (eventData.walkInPrice === '') {
      errors.walkInPrice = 'Walk-in price is required';
    } else {
      const walk = Number(eventData.walkInPrice);
      if (isNaN(walk) || walk < 0) {
        errors.walkInPrice = 'Walk-in price must be 0 or more';
      }
    }
  
    // Shopify Product ID
    if (!eventData.shopifyProductId?.trim()) {
      errors.shopifyProductId = 'Please select a Shopify product';
    }
  
    return errors;
  }
  