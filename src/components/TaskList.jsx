import { useState, useEffect } from "react";
import Modal from "./Modal";

const TaskList = () => {
  // Retrieve lists from localStorage or initialize with an empty array
  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem("lists");
    return storedLists ? JSON.parse(storedLists) : [];
  });

  // State to manage the input value for new list names
  const [newListName, setNewListName] = useState("");

  // State to manage the input value for new list descriptions
  const [newListDescription, setNewListDescription] = useState("");

  // State to manage the editing list and its new name and description
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [editingListDescription, setEditingListDescription] = useState("");

  // State to manage the modal visibility and the list to be deleted
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  // State to manage which list is currently open
  const [openListId, setOpenListId] = useState(null);

  // State to manage the new todo text and description
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");

  // State to manage the editing todo and its new text and description
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");
  const [editingTodoDescription, setEditingTodoDescription] = useState("");

  // Save lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  // Function to add a new list
  const addList = () => {
    if (newListName.trim() !== "") {
      setLists([...lists, { id: Date.now(), name: newListName, description: newListDescription, todos: [] }]);
      setNewListName(""); // Clear the input field after adding a list
      setNewListDescription(""); // Clear the description field after adding a list
    }
  };

  // Function to remove a list
  const removeList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  // Function to add a new todo to a specific list
  const addTodo = (listId) => {
    if (newTodoText.trim() !== "" || newTodoDescription.trim() !== "") {
      setLists(lists.map((list) => (list.id === listId ? { ...list, todos: [...list.todos, { id: Date.now(), text: newTodoText, description: newTodoDescription }] } : list)));
      setNewTodoText(""); // Clear the input field after adding a todo
      setNewTodoDescription(""); // Clear the description field after adding a todo
    }
  };

  // Function to remove a todo from a specific list
  const removeTodo = (listId, todoId) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, todos: list.todos.filter((todo) => todo.id !== todoId) } : list)));
  };

  // Function to start editing a list
  const startEditing = (listId, currentName, currentDescription) => {
    setEditingListId(listId);
    setEditingListName(currentName);
    setEditingListDescription(currentDescription);
  };

  // Function to cancel editing a list
  const cancelEditing = () => {
    setEditingListId(null);
    setEditingListName("");
    setEditingListDescription("");
  };

  // Function to save the edited list name and description
  const saveEditing = (listId) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, name: editingListName, description: editingListDescription } : list)));
    cancelEditing();
  };

  // Function to start editing a todo
  const startEditingTodo = (todoId, currentText, currentDescription) => {
    setEditingTodoId(todoId);
    setEditingTodoText(currentText);
    setEditingTodoDescription(currentDescription);
  };

  // Function to cancel editing a todo
  const cancelEditingTodo = () => {
    setEditingTodoId(null);
    setEditingTodoText("");
    setEditingTodoDescription("");
  };

  // Function to save the edited todo text and description
  const saveEditingTodo = (listId, todoId) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.map((todo) => (todo.id === todoId ? { ...todo, text: editingTodoText, description: editingTodoDescription } : todo)),
            }
          : list
      )
    );
    cancelEditingTodo();
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (listId) => {
    setListToDelete(listId);
    setIsModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setListToDelete(null);
    setIsModalOpen(false);
  };

  // Function to confirm the deletion of a list
  const confirmDelete = () => {
    if (listToDelete !== null) {
      removeList(listToDelete);
      closeDeleteModal();
    }
  };

  // Function to toggle the visibility of a list
  const toggleListVisibility = (listId) => {
    setOpenListId(openListId === listId ? null : listId);
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
      <input
        type="text"
        value={newListDescription}
        onChange={(e) => setNewListDescription(e.target.value)}
        placeholder="New list description"
      />
      <button onClick={addList}>Add List</button>
      {lists.map((list) => (
        <div key={list.id}>
          <div
            onClick={() => toggleListVisibility(list.id)}
            style={{ cursor: "pointer" }}
          >
            <h2>{list.name}</h2>
            <p>{list.description}</p>
          </div>
          {openListId === list.id && (
            <div>
              {editingListId === list.id ? (
                <div>
                  <input
                    type="text"
                    value={editingListName}
                    onChange={(e) => setEditingListName(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editingListDescription}
                    onChange={(e) => setEditingListDescription(e.target.value)}
                  />
                  <button onClick={() => saveEditing(list.id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => startEditing(list.id, list.name, list.description)}>Edit</button>
                  <button onClick={() => openDeleteModal(list.id)}>Remove List</button>
                </div>
              )}
              <ul>
                {list.todos.map((todo) => (
                  <li key={todo.id}>
                    {editingTodoId === todo.id ? (
                      <div>
                        <input
                          type="text"
                          value={editingTodoText}
                          onChange={(e) => setEditingTodoText(e.target.value)}
                        />
                        <input
                          type="text"
                          value={editingTodoDescription}
                          onChange={(e) => setEditingTodoDescription(e.target.value)}
                        />
                        <button onClick={() => saveEditingTodo(list.id, todo.id)}>Save</button>
                        <button onClick={cancelEditingTodo}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <p>{todo.text}</p>
                        <p>{todo.description}</p>
                        <button onClick={() => startEditingTodo(todo.id, todo.text, todo.description)}>Edit</button>
                        <button onClick={() => removeTodo(list.id, todo.id)}>Remove</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="New todo"
              />
              <input
                type="text"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                placeholder="New todo description"
              />
              <button onClick={() => addTodo(list.id)}>Save Todo</button>
            </div>
          )}
        </div>
      ))}
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TaskList;
