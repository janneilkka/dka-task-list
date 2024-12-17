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

  // State to manage the editing list and its new name
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");

  // State to manage the modal visibility and the list to be deleted
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  // State to manage which list is currently open
  const [openListId, setOpenListId] = useState(null);

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

  // Function to start editing a list
  const startEditing = (listId, currentName) => {
    setEditingListId(listId);
    setEditingListName(currentName);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingListId(null);
    setEditingListName("");
  };

  // Function to save the edited list name
  const saveEditing = (listId) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, name: editingListName } : list)));
    cancelEditing();
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
      <button onClick={addList}>Add List</button>
      {lists.map((list) => (
        <div key={list.id}>
          <div
            onClick={() => toggleListVisibility(list.id)}
            style={{ cursor: "pointer" }}
          >
            <h2>{list.name}</h2>
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
                  <button onClick={() => saveEditing(list.id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => startEditing(list.id, list.name)}>Edit</button>
                  <button onClick={() => openDeleteModal(list.id)}>Remove List</button>
                </div>
              )}
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
