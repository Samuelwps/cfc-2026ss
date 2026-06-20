const { sql } = require('@vercel/postgres')

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS songs (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      lyrics TEXT NOT NULL,
      date TIMESTAMP WITH TIME ZONE DEFAULT now(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `
}

function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    request.on('error', reject)
  })
}

async function handler(request, response) {
  const method = request.method

  try {
    await ensureSchema()

    if (method === 'GET') {
      const songs = await sql`SELECT id, title, category, lyrics, date FROM songs ORDER BY date DESC;`
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ songs: songs.rows }))
      return
    }

    if (method === 'POST') {
      const body = await parseJsonBody(request)
      const { title, category, lyrics } = body

      if (!title || !category || !lyrics) {
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ error: 'Missing required fields' }))
        return
      }

      await sql`
        INSERT INTO songs (title, category, lyrics, date)
        VALUES (${title}, ${category}, ${lyrics}, now())
      `

      const songs = await sql`SELECT id, title, category, lyrics, date FROM songs ORDER BY date DESC;`
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ songs: songs.rows }))
      return
    }

    if (method === 'DELETE') {
      const id = request.url.split('id=')[1]

      if (!id) {
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ error: 'Missing id' }))
        return
      }

      await sql`DELETE FROM songs WHERE id = ${id}`

      const songs = await sql`SELECT id, title, category, lyrics, date FROM songs ORDER BY date DESC;`
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ songs: songs.rows }))
      return
    }

    response.statusCode = 405
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ error: 'Method not allowed' }))
  } catch (error) {
    response.statusCode = 500
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ error: 'Database error', details: error.message }))
  }
}

module.exports = handler
