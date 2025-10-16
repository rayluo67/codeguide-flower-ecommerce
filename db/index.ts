import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from './schema/auth';
import * as ecommerceSchema from './schema/ecommerce';

export const db = drizzle(process.env.DATABASE_URL!);

export const schema = { ...authSchema, ...ecommerceSchema };
export type Database = typeof schema;