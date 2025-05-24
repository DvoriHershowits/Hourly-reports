require('dotenv').config()
const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const PORT = process.env.PORT || 3000

function createCrudRoutes(tableName) {
  const basePath = `/${tableName.toLowerCase()}`

  // CREATE - מחזיר את האייטם החדש שנוצר
  app.post(basePath, async (req, res) => {
    const { data, error } = await supabase
      .from(tableName)
      .insert([req.body])
      .select()  // ← מחזיר את האובייקט החדש
    if (error) return res.status(400).json(error)
    res.json(data)
  })

  // READ ALL
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

  // READ ONE BY ID
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

  // UPDATE BY ID - מחזיר את האייטם המעודכן
  app.put(`${basePath}/:id`, async (req, res) => {
    const id = req.params.id
    const { data, error } = await supabase
      .from(tableName)
      .update(req.body)
      .eq('id', id)
      .select() // ← מחזיר את האובייקט המעודכן
    if (error) return res.status(400).json(error)
    res.json(data)
  })

  // DELETE BY ID
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
