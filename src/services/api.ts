import axios from 'axios'
import { ToDoItem } from '../types'

const BASE_URL = '/api/todos'

export const getTodos = async (): Promise<ToDoItem[]> => {
  const res = await axios.get(BASE_URL)
  return res.data
}

export const createTodo = async (
  todo: Omit<ToDoItem, 'id'>
): Promise<ToDoItem> => {
  const res = await axios.post(BASE_URL, todo)
  return res.data
}

export const updateTodo = async (todo: ToDoItem): Promise<ToDoItem> => {
  const res = await axios.put(`${BASE_URL}/${todo.id}`, todo)
  return res.data
}

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`)
}
