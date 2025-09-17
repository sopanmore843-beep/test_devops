import React, { useState, useEffect } from 'react'
import { ToDoItem } from '../types'

type Props = {
  onSubmit: (todo: ToDoItem | Omit<ToDoItem, 'id'>) => void
  existingTodo?: ToDoItem | null
  onCancel?: () => void
}

const ToDoForm: React.FC<Props> = ({ onSubmit, existingTodo, onCancel }) => {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<'pending' | 'completed'>('pending')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title)
      setStatus(existingTodo.status)
    } else {
      setTitle('')
      setStatus('pending')
    }
  }, [existingTodo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    setError(null)
    const todo = existingTodo
      ? { ...existingTodo, title, status }
      : { title, status }
    onSubmit(todo)
    if (!existingTodo) {
      setTitle('')
      setStatus('pending')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div>
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full border px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status" className="block font-medium">
          Status
        </label>
        <select
          id="status"
          className="w-full border px-2 py-1"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'pending' | 'completed')
          }
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <button type="submit" className="bg-blue-500 text-white px-3 py-1">
          {existingTodo ? 'Update' : 'Add'}
        </button>
        {existingTodo && onCancel && (
          <button
            type="button"
            className="bg-gray-300 px-3 py-1"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ToDoForm
