/**
 * Event Form Validation Schemas
 * Zod schemas for validating care event forms
 */

import { z } from 'zod';

// Base event schema with common fields
const baseEventSchema = z.object({
  event_type: z.string().min(1, 'Event type is required'),
  event_date: z.string().min(1, 'Event date is required'),
  description: z.string().optional(),
});

// Birthday event schema
export const birthdayEventSchema = baseEventSchema.extend({
  event_type: z.literal('birthday'),
});

// Grief/Loss event schema
export const griefEventSchema = baseEventSchema.extend({
  event_type: z.literal('grief_loss'),
  grief_relationship: z.string().min(1, 'Relationship to deceased is required'),
});

// Hospital visit event schema
export const hospitalEventSchema = baseEventSchema.extend({
  event_type: z.literal('hospital_visit'),
  hospital_name: z.string().min(1, 'Hospital name is required'),
});

// Financial aid event schema
export const financialAidEventSchema = baseEventSchema.extend({
  event_type: z.literal('financial_aid'),
  aid_amount: z.number().positive('Aid amount must be greater than 0'),
  aid_type: z.string().optional(),
});

// Regular contact event schema
export const regularContactSchema = baseEventSchema.extend({
  event_type: z.literal('regular_contact'),
});

// Dynamic schema based on event type
export const createEventSchema = (eventType) => {
  switch (eventType) {
    case 'birthday':
      return birthdayEventSchema;
    case 'grief_loss':
      return griefEventSchema;
    case 'hospital_visit':
      return hospitalEventSchema;
    case 'financial_aid':
      return financialAidEventSchema;
    case 'regular_contact':
      return regularContactSchema;
    default:
      return baseEventSchema;
  }
};

/**
 * Validate event data against appropriate schema
 * @param {object} data - Event form data
 * @returns {{ success: boolean, errors?: object, data?: object }}
 */
export const validateEventData = (data) => {
  const schema = createEventSchema(data.event_type);
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: result.data };
};

// Member selection validation
export const memberSelectionSchema = z.object({
  member_ids: z.array(z.string()).min(1, 'Please select at least one member'),
});

/**
 * Validate that at least one member is selected
 * @param {string[]} memberIds - Array of member IDs
 * @returns {{ success: boolean, error?: string }}
 */
export const validateMemberSelection = (memberIds) => {
  if (!memberIds || memberIds.length === 0) {
    return { success: false, error: 'Please select at least one member' };
  }
  return { success: true };
};
