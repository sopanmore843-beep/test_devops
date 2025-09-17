import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import cors from 'cors'

const PORT = 3000
const app = express()
app.use(cors())
app.use(express.json())

const DB_PATH = path.join(__dirname, 'db.json')

type ToDoItem = {
  id: number
  title: string
  status: 'pending' | 'completed'
}

const readData = async (): Promise<ToDoItem[]> => {
  const data = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

const writeData = async (data: ToDoItem[]) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

app.get('/api/todos', async (req, res) => {
  const todos = await readData()
  res.json(todos)
})

app.post('/api/todos', async (req, res) => {
  const todos = await readData()
  const { title, status } = req.body
  const id = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1
  const newTodo = { id, title, status }
  todos.push(newTodo)
  await writeData(todos)
  res.status(201).json(newTodo)
})

app.put('/api/todos/:id', async (req, res) => {
  const todos = await readData()
  const id = parseInt(req.params.id)
  const index = todos.findIndex((t) => t.id === id)
  if (index === -1) return res.status(404).send('Not found')
  todos[index] = { ...todos[index], ...req.body }
  await writeData(todos)
  res.json(todos[index])
})

app.delete('/api/todos/:id', async (req, res) => {
  const todos = await readData()
  const id = parseInt(req.params.id)
  const filtered = todos.filter((t) => t.id !== id)
  await writeData(filtered)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
