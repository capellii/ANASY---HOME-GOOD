import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['admin', 'owner', 'member']).optional(),
  }),
});

// Device schemas
export const createDeviceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Device name must be at least 2 characters'),
    type: z.string().min(2, 'Device type is required'),
    room: z.string().optional(),
    protocol: z.string().optional(),
    ip_address: z.string().optional(),
    status: z.enum(['on', 'off', 'offline']).optional(),
  }),
});

export const updateDeviceStatusSchema = z.object({
  params: z.object({
    id: z.string().transform(str => str.toString()),
  }),
  body: z.object({
    status: z.enum(['on', 'off', 'offline']),
  }),
});

// Scenario schemas
export const createScenarioSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Scenario name must be at least 2 characters'),
    description: z.string().optional(),
    trigger_type: z.string().optional(),
    trigger_conditions: z.record(z.string(), z.any()).optional(),
    actions: z.record(z.string(), z.any()).optional(),
    is_active: z.boolean().optional(),
  }),
});

// Energy schemas
export const createEnergySchema = z.object({
  body: z.object({
    device_id: z.union([z.string(), z.number()]).transform(val => val.toString()),
    consumption_kwh: z.number().positive('Consumption must be positive'),
    cost: z.number().positive('Cost must be positive').optional(),
  }),
});

// Security schemas
export const createSecurityEventSchema = z.object({
  body: z.object({
    event_type: z.string().min(2, 'Event type is required'),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    device_id: z.string().uuid('Invalid device ID').optional(),
  }),
});

// Health schemas
export const createHealthMetricSchema = z.object({
  body: z.object({
    metric_type: z.string().min(2, 'Metric type is required'),
    metric_value: z.number(),
    unit: z.string().optional(),
    device_id: z.string().uuid('Invalid device ID').optional(),
  }),
});

// Event schemas
export const createEventSchema = z.object({
  body: z.object({
    event_type: z.string().min(2, 'Event type is required'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    device_id: z.string().uuid('Invalid device ID').optional(),
    scenario_id: z.string().uuid('Invalid scenario ID').optional(),
  }),
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errorMessages 
        });
      }
      next(error);
    }
  };
};
