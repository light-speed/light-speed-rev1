'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')
const {Game} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', username: 'Cody', password: '123'}),
    User.create({
      email: 'murphy@email.com',
      username: 'Murph',
      password: '123'
    }),
    User.create({
      email: 'blessed@email.com',
      username: 'Blez',
      password: 'boom'
    }),
    User.create({
      email: 'asdef@email.com',
      username: 'Kenny G',
      password: 'saxophone'
    }),
    User.create({
      email: 'asdef@email.com',
      username: 'BMG',
      password: 'saxophone'
    })
  ])

  const games = await Promise.all([
    Game.create({score: 3200, userID: 1}),
    Game.create({score: 5200, userID: 5}),
    Game.create({score: 23900, userID: 2}),
    Game.create({score: 93900, userID: 4}),
    Game.create({score: 88700, userID: 4}),
    Game.create({score: 18700, userID: 4}),
    Game.create({score: 8700, userID: 5}),
    Game.create({score: 8700, userID: 4}),
    Game.create({score: 700, userID: 4}),
    Game.create({score: 8700, userID: 3}),
    Game.create({score: 98700, userID: 4})
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
