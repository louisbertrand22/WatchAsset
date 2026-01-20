// WatchAsset/prisma.config.js
require('dotenv').config();

module.exports = {
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
};