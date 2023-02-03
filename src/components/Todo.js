import { useEffect, useState } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

//const API = 'http://localhost:5000'

const Todo = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const resp = await fetch("http://localhost:50000/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((error) => console.log(error));

      setLoading(false);
      setTodos(resp);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch("http://localhost:50000/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos([...todos, todo]);

    setTitle("");
    setTime("");
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(`http://localhost:50000/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:50000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  if (loading) {
    return <p className="looding">Carregando</p>;
  }

  return (
    <div className="conteiner">
      <div className="header">
        <h1>Todo-React</h1>
      </div>
      <div className="form">
        <h2>Insira sua Proxima Tarefa:</h2>
        <form className="content-form" onSubmit={handleSubmit}>
          <div className="inputs">
            <input
              type="text"
              id="tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
            <span>Titulo da Tarefa</span>
          </div>

          <div className="inputs">
            <input
              type="text"
              id="time"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
            <span>Tempo</span>
          </div>

          <button>Criar Tarefa</button>
        </form>
      </div>
      <div className="list">
        <h2>Lista de Tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}

        {todos.map((todo) => (
          <div key={todo.id} className="todo">
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
