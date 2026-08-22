const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['student', 'industry', 'academician', 'institution_admin']),
    // Basic fields required by all roles or specific roles can be validated here or handled in profile setup
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    institutionName: z.string().optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  })
});

module.exports = {
  registerSchema,
  loginSchema,
};
