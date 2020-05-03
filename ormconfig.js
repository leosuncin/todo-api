const prod = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';

module.exports = {
  type: test ? 'sqlite' : 'postgres',
  url: !test ? process.env.DATABASE_URL : undefined,
  database: test ? ':memory:' : undefined,
  entities: [prod ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [prod ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  cli: {
    migrationsDir: prod ? 'dist/migrations' : 'src/migrations',
  },
  synchronize: test,
};
