import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/todos`);
      setTodos(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/todos`, { text: newTodo });
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(`${API_URL}/api/todos/${id}`, { completed: !completed });
      setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(todo._id, todo.completed)}>{todo.text}</span>
            <button className="delete" onClick={() => deleteTodo(todo._id)} disabled={loading}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
