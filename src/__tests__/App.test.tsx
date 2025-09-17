import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import * as api from '../services/api'
import { ToDoItem } from '../types'

vi.mock('../services/api')

const mockTodos: ToDoItem[] = [
  { id: 1, title: 'Test 1', status: 'pending' },
  { id: 2, title: 'Test 2', status: 'completed' },
]

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders todos from API', async () => {
    vi.spyOn(api, 'getTodos').mockResolvedValue(mockTodos)
    render(<App />)
    expect(await screen.findByText('Test 1')).toBeInTheDocument()
    expect(await screen.findByText('Test 2')).toBeInTheDocument()
  })

  it('adds a new todo', async () => {
    vi.spyOn(api, 'getTodos').mockResolvedValue([])
    const createMock = vi
      .spyOn(api, 'createTodo')
      .mockImplementation(async (todo) => ({ id: 3, ...todo }))
    render(<App />)

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Task' },
    })
    fireEvent.click(screen.getByText(/add/i))

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled()
      expect(screen.getByText('New Task')).toBeInTheDocument()
    })
  })

  it('deletes a todo', async () => {
    vi.spyOn(api, 'getTodos').mockResolvedValue(mockTodos)
    const deleteMock = vi.spyOn(api, 'deleteTodo').mockResolvedValue()
    render(<App />)

    const deleteButton = await screen.findByLabelText('Delete Test 1')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(1)
    })
  })
})
