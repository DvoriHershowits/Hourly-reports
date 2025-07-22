require('dotenv').config()
const cors = require('cors');
const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const app = express()
app.use(express.json())
app.use(cors());

const supabase = createClient(supabaseUrl, supabaseKey)
const PORT = process.env.PORT || 3000

function createCrudRoutes(tableName) {
  const basePath = `/${tableName.toLowerCase()}`

  app.post(basePath, async (req, res) => {
    const { data, error } = await supabase
      .from(tableName)
      .insert([req.body])
      .select()  
    if (error) return res.status(400).json(error)
    res.json(data)
  })

  app.get(basePath, async (req, res) => {
    let query = supabase.from(tableName).select('*')

    if (tableName === 'HourlyReports') {
      query = supabase
        .from('HourlyReports')
        .select(`
          *,
          Projects(*),
          Employees(*)
        `)
    }

    const { data, error } = await query
    if (error) return res.status(400).json(error)
    res.json(data)
  })

  app.get(`${basePath}/:id`, async (req, res) => {
    const id = req.params.id
    let query = supabase.from(tableName).select('*').eq('id', id).single()

    if (tableName === 'HourlyReports') {
      query = supabase
        .from('HourlyReports')
        .select(`
          *,
          Projects(*),
          Employees(*)
        `)
        .eq('id', id)
        .single()
    }

    const { data, error } = await query
    if (error) return res.status(404).json(error)
    res.json(data)
  })

  app.put(`${basePath}/:id`, async (req, res) => {
    const id = req.params.id
    const { data, error } = await supabase
      .from(tableName)
      .update(req.body)
      .eq('id', id)
      .select() 
    if (error) return res.status(400).json(error)
    res.json(data)
  })

  app.delete(`${basePath}/:id`, async (req, res) => {
    const id = req.params.id
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    if (error) return res.status(400).json(error)
    res.json(data)
  })
}

createCrudRoutes('Projects')
createCrudRoutes('Employees')
createCrudRoutes('HourlyReports')

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
