# Auth Database Setup

## 1. Create PostgreSQL role and database

Run this as a PostgreSQL superuser (for example in `psql`):

```sql
CREATE ROLE inkbranch_app WITH LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE inkbranch OWNER inkbranch_app;
```

If you need explicit privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE inkbranch TO inkbranch_app;
```

## 2. Configure local environment

Update `.env`:

```env
DATABASE_URL="postgresql://inkbranch_app:CHANGE_ME_STRONG_PASSWORD@localhost:5432/inkbranch?schema=public"
SESSION_MAX_AGE_DAYS="30"
```

## 3. Apply schema with Prisma

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init_auth
```

## 4. Start the app

```bash
npm run dev
```

## Notes

- New signups are automatically assigned the `READER` role.
- Roles available: `READER`, `AUTHOR`, `ADMIN`.
- A starter SQL preview of the auth schema is in `prisma/sql/0001_init_auth.sql`.

To promote a user role later:

```sql
UPDATE "User" SET "role" = 'AUTHOR' WHERE "email" = 'author@example.com';
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@example.com';
```
