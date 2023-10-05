import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { User } from './src/entities/User';
import { Task } from './src/entities/Task';
import { Run } from './src/entities/Run';
import { Admin } from './src/entities/Admin';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'js_challenge',
  synchronize: true,
  logging: false,
  entities: [User, Task, Run, Admin],
  migrations: [path.join(__dirname, '/src/migrations/**/*{.js,.ts}')],
  subscribers: [path.join(__dirname, '/src/subscribers/**/*{.js,.ts}')],
});
