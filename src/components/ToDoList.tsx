import React from 'react'
import { ToDoItem } from '../types'

type Props = {
  todos: ToDoItem[]
  onEdit: (todo: ToDoItem) => void
  onDelete: (id: number) => void
}

const ToDoList: React.FC<Props> = ({ todos, onEdit, onDelete }) => {
  if (todos.length === 0) return <p>No ToDo items.</p>

  return (
    <ul>
      {todos.map((todo, index) => (
        <li
          key={todo.id}
          className={`flex justify-between items-center px-4 py-2 ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
          }`}
        >
          <div>
            <p className="font-semibold">{todo.title}</p>
            <p className="text-sm text-gray-600">{todo.status}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="text-blue-600"
              onClick={() => onEdit(todo)}
              aria-label={`Edit ${todo.title}`}
            >
              Edit
            </button>
            <button
              className="text-red-600"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete ${todo.title}`}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ToDoList
