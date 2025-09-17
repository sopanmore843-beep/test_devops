import React, { useEffect, useState } from 'react'
import { ToDoItem } from './types'
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/api'
import ToDoList from './components/ToDoList'
import ToDoForm from './components/ToDoForm'

const App: React.FC = () => {
  const [todos, setTodos] = useState<ToDoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTodo, setEditingTodo] = useState<ToDoItem | null>(null)

  const loadTodos = async () => {
    try {
      const data = await getTodos()
      setTodos(data)
    } catch (err) {
      setError('Failed to load ToDo items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleCreate = async (todo: Omit<ToDoItem, 'id'>) => {
    const newTodo = await createTodo(todo)
    setTodos((prev) => [...prev, newTodo])
  }

  const handleUpdate = async (todo: ToDoItem) => {
    const updated = await updateTodo(todo)
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setEditingTodo(null)
  }

  const handleDelete = async (id: number) => {
    await deleteTodo(id)
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="container mx-auto max-w-xl p-4">
      <h1 className="text-2xl font-bold mb-4">ToDo App</h1>
      <ToDoForm
        onSubmit={editingTodo ? handleUpdate : handleCreate}
        existingTodo={editingTodo}
        onCancel={() => setEditingTodo(null)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ToDoList
          todos={todos}
          onEdit={setEditingTodo}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App
