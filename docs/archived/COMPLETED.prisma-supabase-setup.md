# Prisma with Supabase Configuration Guide

## Connection Configuration

### Environment Variables
```env
# Connection pooling URL (for general queries)
DATABASE_URL="postgresql://postgres.bzedrdkjoxhydyozuxyp:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

# Direct connection URL (for migrations)
DIRECT_URL="postgresql://postgres.bzedrdkjoxhydyozuxyp:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Important Connection Details
- Username format: `postgres.bzedrdkjoxhydyozuxyp`
- Pooler host: `aws-0-ap-southeast-1.pooler.supabase.com`
- Pooler port: `6543`
- Direct port: `5432`
- Database name: `postgres`
- SSL Mode: `require`

## Prisma Schema Configuration

### Basic Setup
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas  = ["public", "auth"]  // Required for Supabase
}
```

### Model Configuration
Each model must include:
1. Schema attribute
2. Map attribute for table name
```prisma
model Example {
  id    String @id @default(uuid()) @db.Uuid
  name  String

  @@map("examples")     // Table name in database
  @@schema("public")    // Schema name
}
```

## Common Issues and Solutions

### 1. Connection Issues
- Ensure SSL is enabled in Supabase dashboard
- Use correct ports (6543 for pooler, 5432 for direct)
- Include proper SSL mode in connection string

### 2. Schema Issues
- Add `multiSchema` to preview features
- Include all necessary schemas in datasource
- Add `@@schema` to all models

### 3. Authentication Issues
- Use full username format with project reference
- Ensure password is correct in environment variables
- Check if database access is enabled in Supabase

## Commands Reference

### Database Operations
```bash
# Pull database schema
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Push schema changes (be careful in production)
npx prisma db push

# Run migrations (recommended for production)
npx prisma migrate dev
npx prisma migrate deploy
```

### Development Tools
```bash
# Start Prisma Studio
npx prisma studio

# Format schema file
npx prisma format
```

## Important Notes

1. **Schema Management**
   - Always use `@@schema` attributes
   - Keep track of cross-schema references
   - Be aware of Supabase's auth schema

2. **Connection Pooling**
   - Use pooled connection for regular operations
   - Use direct connection for migrations
   - Pool has different port (6543)

3. **Security**
   - Never commit passwords to version control
   - Use environment variables
   - Enable SSL for all connections

4. **Supabase Specific**
   - Row Level Security (RLS) is not fully supported by Prisma
   - Some constraints might not be fully supported
   - Check Supabase dashboard for latest connection info

## Troubleshooting

1. If connection fails:
   - Verify SSL is enabled in Supabase
   - Check if database password is correct
   - Ensure proper ports are being used

2. If schema pull fails:
   - Verify all schemas are listed in datasource
   - Check model schema attributes
   - Ensure proper connection strings

3. If client generation fails:
   - Clear generated files
   - Verify schema syntax
   - Check preview features

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
