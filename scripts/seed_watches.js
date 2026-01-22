import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding des montres...');

  const watches = [
    {
      brand: 'Rolex',
      model: 'Submariner Date',
      reference: '126610LN',
      imageUrl: 'https://images.rolex.com/submariner_126610ln.jpg',
      prices: [
        { price: 13500, source: 'Chrono24', date: new Date('2025-06-01') },
        { price: 14200, source: 'Chrono24', date: new Date('2025-09-15') },
        { price: 14850, source: 'Chrono24', date: new Date('2026-01-10') },
      ]
    },
    {
      brand: 'Patek Philippe',
      model: 'Nautilus Blue Dial',
      reference: '5711/1A-010',
      imageUrl: 'https://patek.com/nautilus_5711.jpg',
      prices: [
        { price: 110000, source: 'Collector Square', date: new Date('2025-05-01') },
        { price: 115000, source: 'Collector Square', date: new Date('2025-11-20') },
        { price: 122000, source: 'Collector Square', date: new Date('2026-01-15') },
      ]
    },
    {
      brand: 'Audemars Piguet',
      model: 'Royal Oak Selfwinding',
      reference: '15500ST',
      imageUrl: 'https://audemarspiguet.com/royaloak.jpg',
      prices: [
        { price: 42000, source: 'eBay Luxury', date: new Date('2025-07-01') },
        { price: 41500, source: 'eBay Luxury', date: new Date('2025-10-01') },
        { price: 44000, source: 'eBay Luxury', date: new Date('2026-01-05') },
      ]
    }
  ];

  for (const w of watches) {
    await prisma.watch.upsert({
      where: { reference: w.reference },
      update: {},
      create: {
        brand: w.brand,
        model: w.model,
        reference: w.reference,
        imageUrl: w.imageUrl,
        prices: {
          create: w.prices
        }
      },
    });
  }

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
