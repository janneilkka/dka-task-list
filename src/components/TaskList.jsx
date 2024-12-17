import { useState, useEffect } from "react";

const TaskList = () => {
  // Retrieve lists from localStorage or initialize with an empty array
  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem("lists");
    return storedLists ? JSON.parse(storedLists) : [];
  });

  // State to manage the input value for new list names
  const [newListName, setNewListName] = useState("");

  // Save lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  // Function to add a new list
  const addList = () => {
    if (newListName.trim() !== "") {
      setLists([...lists, { id: Date.now(), name: newListName, todos: [] }]);
      setNewListName(""); // Clear the input field after adding a list
    }
  };

  // Function to remove a list
  const removeList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  // Function to add a new todo to a specific list
  const addTodo = (listId, todoText) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, todos: [...list.todos, { id: Date.now(), text: todoText }] } : list)));
  };

  // Function to remove a todo from a specific list
  const removeTodo = (listId, todoId) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, todos: list.todos.filter((todo) => todo.id !== todoId) } : list)));
  };

  return (
    <div>
      <h1>Todo Lists</h1>
      <input
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="New list name"
      />
      <button onClick={addList}>Add List</button>
      {lists.map((list) => (
        <div key={list.id}>
          <h2>{list.name}</h2>
          <button onClick={() => removeList(list.id)}>Remove List</button>
          <ul>
            {list.todos.map((todo) => (
              <li key={todo.id}>
                {todo.text}
                <button onClick={() => removeTodo(list.id, todo.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="New todo"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                addTodo(list.id, e.target.value);
                e.target.value = ""; // Clear the input field after adding a todo
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
