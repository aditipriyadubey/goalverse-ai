import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GoalVerse AI database...');

  await prisma.crowdReading.deleteMany();
  await prisma.gate.deleteMany();
  await prisma.pointOfInterest.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.lostFoundReport.deleteMany();
  await prisma.incidentReport.deleteMany();
  await prisma.ecoLog.deleteMany();

  const gates = await Promise.all(
    [
      { name: 'Gate 1', zone: 'North', capacity: 8000, wheelchairAccessible: true },
      { name: 'Gate 2', zone: 'North', capacity: 8000, wheelchairAccessible: true },
      { name: 'Gate 3', zone: 'East', capacity: 6000, wheelchairAccessible: true },
      { name: 'Gate 4', zone: 'East', capacity: 6000, wheelchairAccessible: false },
      { name: 'Gate 5', zone: 'South', capacity: 7000, wheelchairAccessible: true },
      { name: 'Gate 6', zone: 'West', capacity: 7000, wheelchairAccessible: true },
    ].map((g) => prisma.gate.create({ data: g })),
  );

  for (const gate of gates) {
    await prisma.crowdReading.create({
      data: {
        gateId: gate.id,
        density: Math.random(),
        level: 'green',
      },
    });
  }

  await prisma.pointOfInterest.createMany({
    data: [
      { name: 'Washroom Block A', category: 'washroom', zone: 'North', x: 20, y: 15, wheelchairAccessible: true },
      { name: 'Washroom Block C', category: 'washroom', zone: 'East', x: 70, y: 30, wheelchairAccessible: true },
      { name: 'Halal Food Court (East Concourse)', category: 'food', zone: 'East', x: 75, y: 40, halal: true, wheelchairAccessible: true },
      { name: 'Official Merchandise Store', category: 'merchandise', zone: 'South', x: 50, y: 85, wheelchairAccessible: true },
      { name: 'Medical Station 1', category: 'medical', zone: 'North', x: 25, y: 20, wheelchairAccessible: true },
      { name: 'Medical Station 2', category: 'medical', zone: 'West', x: 15, y: 60, wheelchairAccessible: true },
      { name: 'Quiet Zone North', category: 'quiet_zone', zone: 'North', x: 30, y: 10, wheelchairAccessible: true },
      { name: 'Family Zone South', category: 'family_zone', zone: 'South', x: 55, y: 90, wheelchairAccessible: true },
      { name: 'Accessible Seating Ramp B', category: 'seat_block', zone: 'East', x: 65, y: 35, wheelchairAccessible: true },
    ],
  });

  console.log(`Seeded ${gates.length} gates and points of interest.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
