import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export interface ValidationOptions {
  abortEarly?: boolean;
  stripUnknown?: boolean;
  allowUnknown?: boolean;
}

const defaultOptions: ValidationOptions = {
  abortEarly: false,
  stripUnknown: true,
  allowUnknown: true
};

export function validateRequest(schema: ValidationSchema, options: ValidationOptions = defaultOptions) {
  return async function validate(
    req: NextApiRequest,
    res: NextApiResponse,
    next: Function
  ) {
    try {
      if (schema.body) {
        req.body = await schema.body.validateAsync(req.body, options);
      }

      if (schema.query) {
        req.query = await schema.query.validateAsync(req.query, options);
      }

      if (schema.params) {
        req.query = await schema.params.validateAsync(req.query, options);
      }

      return next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        const details = error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }));

        logger.warn('Request validation failed', { error: details });

        throw new ApiError(
          'Request validation failed',
          'VALIDATION_ERROR',
          { details }
        );
      }

      throw error;
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid(),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(100),
  phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/),
  date: Joi.date().iso(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Booking validation schemas
export const bookingSchemas = {
  create: Joi.object({
    customerId: commonSchemas.id.required(),
    serviceId: commonSchemas.id.required(),
    date: commonSchemas.date.required(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled').default('pending'),
    notes: Joi.string().max(500)
  }),
  update: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
    notes: Joi.string().max(500)
  }),
  query: Joi.object({
    customerId: commonSchemas.id,
    serviceId: commonSchemas.id,
    status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    ...commonSchemas.pagination.extract(['page', 'limit', 'sortBy', 'sortOrder'])
  })
};

// Service validation schemas
export const serviceSchemas = {
  create: Joi.object({
    name: Joi.string().required().max(100),
    description: Joi.string().required().max(1000),
    duration: Joi.number().required().min(1),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    availability: Joi.object({
      days: Joi.array().items(Joi.number().min(0).max(6)).required(),
      startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    })
  }),
  update: Joi.object({
    name: Joi.string().max(100),
    description: Joi.string().max(1000),
    duration: Joi.number().min(1),
    price: Joi.number().min(0),
    category: Joi.string(),
    availability: Joi.object({
      days: Joi.array().items(Joi.number().min(0).max(6)),
      startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    })
  }),
  query: Joi.object({
    category: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    duration: Joi.number().min(1),
    ...commonSchemas.pagination.extract(['page', 'limit', 'sortBy', 'sortOrder'])
  })
}; 