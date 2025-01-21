import Joi from 'joi';
import { commonSchemas } from '../validation';

export const paymentSchemas = {
  checkout: {
    body: Joi.object({
      bookingId: commonSchemas.id.required(),
      amount: Joi.number().integer().min(0).required(),
      currency: Joi.string().valid('SGD').required(),
      customerEmail: Joi.string().email().required()
    })
  },
  id: {
    params: commonSchemas.id
  },
  update: {
    params: commonSchemas.id,
    body: Joi.object({
      status: Joi.string().valid('pending', 'completed', 'expired', 'failed'),
      metadata: Joi.object().unknown(true)
    })
  },
  query: {
    query: Joi.object({
      customerId: commonSchemas.id,
      status: Joi.string().valid('pending', 'completed', 'expired', 'failed'),
      ...commonSchemas.pagination.extract(['page', 'limit', 'sortBy', 'sortOrder'])
    })
  }
};
