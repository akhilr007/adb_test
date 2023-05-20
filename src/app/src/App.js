import "./App.css";
import { useState, useEffect } from "react";

export function App() {
  const [todo, setTodo] = useState("");

  const [todoList, setTodoList] = useState([null]);

  useEffect(() => {
    async function fetchMyData() {
      try {
        const result = await fetch("http://localhost:8000/todos/");
        const data = await result.json();
        console.log(data);

        const tempList = data
          .filter((item) => item.todo !== null)
          .map((item) => item.todo);
        setTodoList(tempList);
      } catch (err) {
        console.log(err);
      }
    }
    fetchMyData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await fetch("http://localhost:8000/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: todo }),
      });
      const data = await result.json();
      console.log(data);
      setTodoList([...todoList, todo]);
    } catch (err) {
      console.log(err);
    }
    console.log(todo);
    setTodoList([...todoList, todo]);
    setTodo("");
  }

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        <ul>
          {todoList?.map((todo, index) => {
            return <li key={index}>{todo}</li>;
          })}
        </ul>
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              type="text"
              id="todo"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "5px" }}>
            <button type="submit">Add ToDo!</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
