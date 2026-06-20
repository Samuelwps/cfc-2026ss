const { sql } = require('@vercel/postgres')

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      file_data BYTEA,
      mime_type TEXT DEFAULT 'application/pdf',
      date TIMESTAMP WITH TIME ZONE DEFAULT now(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `
}

function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk.toString()
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
      const documents = await sql`SELECT id, name, category, date FROM documents ORDER BY date DESC;`
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ documents: documents.rows }))
      return
    }

    if (method === 'POST') {
      const body = await parseJsonBody(request)
      const { name, category, base64Data } = body

      if (!name || !category || !base64Data) {
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ error: 'Missing required fields' }))
        return
      }

      const bufferData = Buffer.from(base64Data, 'base64')

      await sql`
        INSERT INTO documents (name, category, file_data, mime_type, date)
        VALUES (${name}, ${category}, ${bufferData}, 'application/pdf', now())
      `

      const documents = await sql`SELECT id, name, category, date FROM documents ORDER BY date DESC;`
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ documents: documents.rows }))
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

      await sql`DELETE FROM documents WHERE id = ${id}`

      const documents = await sql`SELECT id, name, category, date FROM documents ORDER BY date DESC;`
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ documents: documents.rows }))
      return
    }

    if (method === 'GET' && request.url.includes('download')) {
      const id = request.url.split('id=')[1]

      if (!id) {
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ error: 'Missing id' }))
        return
      }

      const doc = await sql`SELECT file_data, name FROM documents WHERE id = ${id}`

      if (doc.rows.length === 0) {
        response.statusCode = 404
        response.end('Document not found')
        return
      }

      response.statusCode = 200
      response.setHeader('Content-Type', 'application/pdf')
      response.setHeader('Content-Disposition', `attachment; filename="${doc.rows[0].name}"`)
      response.end(Buffer.from(doc.rows[0].file_data))
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

