import { PrismaClient, SeatType } from '@prisma/client'

const prisma = new PrismaClient()

const movies = [
  {
    title: 'Inception',
    slug: 'inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    banner: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailer: 'YoHD9XEInc0',
    duration: 148,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: ['English', 'Hindi'],
    rating: 8.8,
    certificate: 'UA',
    releaseDate: new Date('2010-07-16'),
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb', image: 'https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur', image: 'https://image.tmdb.org/t/p/w185/z2FA8js799xqtfiFjBTicFYdfk.jpg' },
      { name: 'Elliot Page', role: 'Ariadne', image: 'https://image.tmdb.org/t/p/original/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg' },
      { name: 'Tom Hardy', role: 'Eames', image: 'https://image.tmdb.org/t/p/w185/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg' },
      { name: 'Marion Cotillard', role: 'Mal', image: 'https://image.tmdb.org/t/p/original/u4kFDMR3PZ7judRYpXFaB6s2vS1.jpg' },
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg' },
      { name: 'Emma Thomas', role: 'Producer', image: 'https://image.tmdb.org/t/p/original/utc1PS6WVWR5tknzTJqXtnD0kBp.jpg' },
      { name: 'Hans Zimmer', role: 'Music', image: 'https://image.tmdb.org/t/p/original/6eDwzNdFZI3xm0sMym8dYytvjqd.jpg' },
    ],
  },
  {
    title: 'Interstellar',
    slug: 'interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    banner: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailer: 'zSWdZVtXT7E',
    duration: 169,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    language: ['English', 'Hindi'],
    rating: 8.6,
    certificate: 'UA',
    releaseDate: new Date('2014-11-07'),
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://image.tmdb.org/t/p/w185/sY2mwpafcwqyYS1sOySu1MENDse.jpg' },
      { name: 'Anne Hathaway', role: 'Brand', image: 'https://image.tmdb.org/t/p/original/10moU2RayCrvXzeyarO7e1xSeXY.jpg' },
      { name: 'Jessica Chastain', role: 'Murph', image: 'https://image.tmdb.org/t/p/w185/vOFrDeYXILnj747dOleaNh4jK3l.jpg' },
      { name: 'Michael Caine', role: 'Professor Brand', image: 'https://image.tmdb.org/t/p/w185/bVZRMlpjTAO2pJK6v90buFgVbSW.jpg' },
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg' },
      { name: 'Hans Zimmer', role: 'Music', image: 'https://image.tmdb.org/t/p/original/6eDwzNdFZI3xm0sMym8dYytvjqd.jpg' },
    ],
  },
  {
    title: 'The Dark Knight',
    slug: 'the-dark-knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    banner: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailer: 'EXeTwQWrcwY',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama'],
    language: ['English', 'Hindi'],
    rating: 9.0,
    certificate: 'UA',
    releaseDate: new Date('2008-07-18'),
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman', image: 'https://image.tmdb.org/t/p/original/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg' },
      { name: 'Heath Ledger', role: 'Joker', image: 'https://image.tmdb.org/t/p/w185/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent', image: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/u5JjnRMr9zKEVvOP7k3F6gdcwT6.jpg' },
      { name: 'Gary Oldman', role: 'Jim Gordon', image: 'https://image.tmdb.org/t/p/w185/2v9FVVBUrrkW2m3QOcYkuhq9A6o.jpg' },
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg' },
      { name: 'Hans Zimmer', role: 'Music', image: 'https://image.tmdb.org/t/p/original/6eDwzNdFZI3xm0sMym8dYytvjqd.jpg' },
      { name: 'James Newton Howard', role: 'Music', image: 'https://image.tmdb.org/t/p/original/qB4JgzCXCjr7NwW7UNrgBrWZDlo.jpg' },
    ],
  },
  {
    title: 'Avengers: Endgame',
    slug: 'avengers-endgame',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    banner: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailer: 'TcMBFSGVi1c',
    duration: 181,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    rating: 8.4,
    certificate: 'UA',
    releaseDate: new Date('2019-04-26'),
    cast: [
      { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man', image: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg' },
      { name: 'Chris Evans', role: 'Steve Rogers / Captain America', image: 'https://image.tmdb.org/t/p/w185/3bOGNsHlrswhyW79uvIHH1V43JI.jpg' },
      { name: 'Scarlett Johansson', role: 'Natasha Romanoff / Black Widow', image: 'https://image.tmdb.org/t/p/w185/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg' },
      { name: 'Chris Hemsworth', role: 'Thor', image: 'https://image.tmdb.org/t/p/w185/xkHHiJXraaMFXgRYspN6KVrFn17.jpg' },
      { name: 'Mark Ruffalo', role: 'Bruce Banner / Hulk', image: 'https://image.tmdb.org/t/p/original/6LL1n6NvLpiEfu3trtsUI9VJcbV.jpg' },
    ],
    crew: [
      { name: 'Anthony Russo', role: 'Director', image: 'https://image.tmdb.org/t/p/original/xbINBnWn28YygYWUJ1aSAw0xPRv.jpg' },
      { name: 'Joe Russo', role: 'Director', image: 'https://image.tmdb.org/t/p/original/o0OXjFzL10jCy89iAs7UzzSbyoK.jpg' },
      { name: 'Alan Silvestri', role: 'Music', image: 'https://image.tmdb.org/t/p/original/feUZ0Oc1MGJJbUronBbkHTmJzgy.jpg' },
    ],
  },
  {
    title: 'Parasite',
    slug: 'parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    banner: 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
    trailer: '5xH0HfJHsaY',
    duration: 132,
    genre: ['Comedy', 'Thriller', 'Drama'],
    language: ['Korean', 'English'],
    rating: 8.5,
    certificate: 'A',
    releaseDate: new Date('2019-05-30'),
    cast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek', image: 'https://image.tmdb.org/t/p/original/ks57AFrelAbogHuqmJ1NBEloSWf.jpg' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik', image: 'https://image.tmdb.org/t/p/original/nHFBbSFohzOUOvMxPVwe3Es2nJw.jpg' },
      { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo', image: 'https://image.tmdb.org/t/p/original/n7YWOoquBL9g3qEwQ2zvrQSW96L.jpg' },
      { name: 'Choi Woo-shik', role: 'Kim Ki-woo', image: 'https://image.tmdb.org/t/p/original/bIdt6LrqMpGQtGTZ1gmji6eGzTH.jpg' },
    ],
    crew: [
      { name: 'Bong Joon-ho', role: 'Director', image: 'https://image.tmdb.org/t/p/original/stwnTvZAoD8gEJEDHpDQyLCyDy5.jpg' },
      { name: 'Jung Jae-il', role: 'Music', image: 'https://image.tmdb.org/t/p/original/a1q0hsgTTUJwaq0T3W02mi1b6Q6.jpg' },
    ],
  },
  {
    title: 'Dune',
    slug: 'dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    banner: 'https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg',
    trailer: '8g18jFHCLXk',
    duration: 155,
    genre: ['Adventure', 'Sci-Fi', 'Action'],
    language: ['English', 'Hindi'],
    rating: 8.0,
    certificate: 'UA',
    releaseDate: new Date('2021-10-22'),
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://image.tmdb.org/t/p/original/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' },
      { name: 'Zendaya', role: 'Chani', image: 'https://image.tmdb.org/t/p/original/3WdOloHpjtjL96uVOhFRRCcYSwq.jpg' },
      { name: 'Oscar Isaac', role: 'Duke Leto Atreides', image: 'https://image.tmdb.org/t/p/w185/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg' },
    ],
    crew: [
      { name: 'Denis Villeneuve', role: 'Director', image: 'https://image.tmdb.org/t/p/original/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg' },
      { name: 'Hans Zimmer', role: 'Music', image: 'https://image.tmdb.org/t/p/original/6eDwzNdFZI3xm0sMym8dYytvjqd.jpg' },
    ],
  },
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']
const theaterBrands = ['PVR Cinemas', 'INOX', 'Cinepolis', 'Carnival']

async function main() {
  console.log('🌱 Starting database seed...\n')

  // Clear existing data
  console.log('🗑️  Cleaning existing data...')
  await prisma.bookingSeat.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.seatLock.deleteMany()
  await prisma.show.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.screen.deleteMany()
  await prisma.theater.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleaned\n')

  // Create movies
  console.log('🎬 Creating movies...')
  const createdMovies = await Promise.all(
    movies.map((movie) => prisma.movie.create({ data: movie }))
  )
  console.log(`✅ Created ${createdMovies.length} movies\n`)

  // Create theaters with screens and seats
  console.log('🎭 Creating theaters...')
  let theaterCount = 0
  let screenCount = 0
  let seatCount = 0
  let showCount = 0

  for (const city of cities) {
    for (const brand of theaterBrands) {
      const theater = await prisma.theater.create({
        data: {
          name: `${brand} - ${city}`,
          city,
          address: `${brand}, Central Mall, ${city}`,
        },
      })
      theaterCount++

      // Create 2-3 screens per theater
      const numScreens = Math.floor(Math.random() * 2) + 2 // 2 or 3 screens
      for (let screenNum = 1; screenNum <= numScreens; screenNum++) {
        const screen = await prisma.screen.create({
          data: {
            name: `Screen ${screenNum}`,
            theaterId: theater.id,
            totalSeats: 100,
            layout: {
              rows: 10,
              columns: 10,
              aisles: [5],
            },
          },
        })
        screenCount++

        // Generate seats
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        const seats = []

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          for (let col = 1; col <= 10; col++) {
            let seatType: SeatType = SeatType.REGULAR
            // Last 3 rows are VIP
            if (rowIndex >= 7) seatType = SeatType.VIP
            // Middle rows are Premium
            else if (rowIndex >= 4) seatType = SeatType.PREMIUM

            seats.push({
              seatNumber: `${rows[rowIndex]}${col}`,
              row: rows[rowIndex],
              column: col,
              seatType,
              screenId: screen.id,
            })
          }
        }

        await prisma.seat.createMany({ data: seats })
        seatCount += seats.length

        // Create shows for next 7 days
        const showTimes = ['10:00', '13:30', '17:00', '20:30']

        for (let day = 0; day < 7; day++) {
          // Use UTC methods to avoid timezone issues
          const now = new Date()
          const showDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + day,
            0, 0, 0, 0
          ))

          for (const time of showTimes) {
            const [hours, minutes] = time.split(':').map(Number)
            const startTime = new Date(Date.UTC(
              showDate.getUTCFullYear(),
              showDate.getUTCMonth(),
              showDate.getUTCDate(),
              hours, minutes, 0, 0
            ))

            // Randomly assign a movie to this show
            const movie =
              createdMovies[Math.floor(Math.random() * createdMovies.length)]

            const endTime = new Date(startTime)
            endTime.setMinutes(endTime.getMinutes() + movie.duration + 15) // Add 15 min break

            // Generate pricing based on seat types
            const basePrice = 150 + Math.floor(Math.random() * 50)
            const pricing = {
              REGULAR: basePrice,
              PREMIUM: basePrice + 50,
              VIP: basePrice + 150,
            }

            await prisma.show.create({
              data: {
                movieId: movie.id,
                screenId: screen.id,
                startTime,
                endTime,
                date: showDate.toISOString().split('T')[0],
                pricing,
              },
            })
            showCount++
          }
        }
      }
    }
  }

  console.log(`✅ Created ${theaterCount} theaters`)
  console.log(`✅ Created ${screenCount} screens`)
  console.log(`✅ Created ${seatCount} seats`)
  console.log(`✅ Created ${showCount} shows\n`)

  // Create sample user
  console.log('👤 Creating sample user...')
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
    },
  })
  console.log('✅ Created sample user\n')

  console.log('🎉 Database seeding completed successfully!\n')
  console.log('Summary:')
  console.log(`  📽️  Movies: ${createdMovies.length}`)
  console.log(`  🎭 Theaters: ${theaterCount}`)
  console.log(`  📺 Screens: ${screenCount}`)
  console.log(`  💺 Seats: ${seatCount}`)
  console.log(`  🎬 Shows: ${showCount}`)
  console.log(`  📅 Show dates: Next 7 days`)
  console.log(`  🏙️  Cities: ${cities.join(', ')}\n`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


