import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Auto-initialize the table if it does not exist
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS flyer_products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        discount INT NOT NULL,
        image TEXT NOT NULL,
        is_highlighted BOOLEAN DEFAULT FALSE,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (err: any) {
    console.error('Error initializing Neon table:', err);
  }

  // GET: Fetch all saved products
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM flyer_products ORDER BY created_at DESC`;
      const mapped = result.map((row: any) => ({
        id: row.id,
        name: row.name,
        price: row.price,
        unit: row.unit,
        discount: row.discount,
        image: row.image,
        isHighlighted: !!row.is_highlighted,
        category: row.category
      }));
      res.status(200).json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } 
  
  // POST: Add or update a product
  else if (req.method === 'POST') {
    try {
      const { id, name, price, unit, discount, image, isHighlighted, category } = req.body;
      if (!name || !price) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
      }

      await sql`
        INSERT INTO flyer_products (id, name, price, unit, discount, image, is_highlighted, category)
        VALUES (${id}, ${name}, ${price}, ${unit}, ${discount || 0}, ${image}, ${!!isHighlighted}, ${category})
        ON CONFLICT (id) DO UPDATE 
        SET name = EXCLUDED.name, 
            price = EXCLUDED.price, 
            unit = EXCLUDED.unit, 
            discount = EXCLUDED.discount, 
            image = EXCLUDED.image, 
            is_highlighted = EXCLUDED.is_highlighted, 
            category = EXCLUDED.category
      `;

      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } 
  
  // DELETE: Remove product from database
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID de producto requerido' });
      }
      await sql`DELETE FROM flyer_products WHERE id = ${id}`;
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
