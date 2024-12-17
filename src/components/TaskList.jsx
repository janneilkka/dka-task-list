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
  const [newListNameError, setNewListNameError] = useState("");

  // State to manage the input value for new list descriptions
  const [newListDescription, setNewListDescription] = useState("");

  // State to manage the editing list and its new name and description
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [editingListDescription, setEditingListDescription] = useState("");
  const [editingListNameError, setEditingListNameError] = useState("");

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

  // State to manage the visibility of the new list input fields
  const [isAddingNewList, setIsAddingNewList] = useState(false);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  // Function to validate the list name
  const validateListName = (name, setError) => {
    const regex = /^[\p{L}\p{N}]{1,60}$/u;
    if (!regex.test(name)) {
      setError("List name can only contain letters and numbers, and must be 60 characters or less.");
      return false;
    }
    setError("");
    return true;
  };

  // Function to check for duplicate list names
  const isDuplicateListName = (name, listId = null) => {
    return lists.some((list) => list.name === name && list.id !== listId);
  };

  // Function to add a new list
  const addList = () => {
    if (validateListName(newListName, setNewListNameError)) {
      if (isDuplicateListName(newListName)) {
        setNewListNameError("List name already exists. Please choose another name.");
        return;
      }
      setLists([...lists, { id: Date.now(), name: newListName, description: newListDescription, todos: [] }]);
      setNewListName(""); // Clear the input field after adding a list
      setNewListDescription(""); // Clear the description field after adding a list
      setIsAddingNewList(false); // Hide the input fields and show the "Make a new list" button
    }
  };

  // Function to remove a list
  const removeList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  // Function to add a new todo to a specific list
  const addTodo = (listId) => {
    if (newTodoText.trim() !== "" || newTodoDescription.trim() !== "") {
      setLists(lists.map((list) => (list.id === listId ? { ...list, todos: [...list.todos, { id: Date.now(), text: newTodoText, description: newTodoDescription, status: "todo" }] } : list)));
      setNewTodoText(""); // Clear the input field after adding a todo
      setNewTodoDescription(""); // Clear the description field after adding a todo
    }
  };

  // Function to remove a todo from a specific list
  const removeTodo = (listId, todoId) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, todos: list.todos.filter((todo) => todo.id !== todoId) } : list)));
  };

  // Function to change the status of a todo
  const changeTodoStatus = (listId, todoId, status) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.map((todo) => (todo.id === todoId ? { ...todo, status } : todo)),
            }
          : list
      )
    );
  };

  // Function to start editing a list
  const startEditing = (listId, currentName, currentDescription) => {
    setEditingListId(listId);
    setEditingListName(currentName);
    setEditingListDescription(currentDescription);
    setEditingListNameError("");
  };

  // Function to cancel editing a list
  const cancelEditing = () => {
    setEditingListId(null);
    setEditingListName("");
    setEditingListDescription("");
    setEditingListNameError("");
  };

  // Function to save the edited list name and description
  const saveEditing = (listId) => {
    if (validateListName(editingListName, setEditingListNameError)) {
      if (isDuplicateListName(editingListName, listId)) {
        setEditingListNameError("List name already exists.");
        return;
      }
      setLists(lists.map((list) => (list.id === listId ? { ...list, name: editingListName, description: editingListDescription } : list)));
      cancelEditing();
    }
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
      {isAddingNewList ? (
        <div>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
          />
          {newListNameError && <p style={{ color: "red" }}>{newListNameError}</p>}
          <input
            type="text"
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            placeholder="New list description"
          />
          <button
            className="btn"
            onClick={addList}
          >
            Add List
          </button>
        </div>
      ) : (
        <button
          className="btn"
          onClick={() => setIsAddingNewList(true)}
        >
          Make a new list
        </button>
      )}
      <div className="task-list">
        {lists.map((list) => (
          <div key={list.id}>
            <div
              className="task"
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
                    {editingListNameError && <p style={{ color: "red" }}>{editingListNameError}</p>}
                    <input
                      type="text"
                      value={editingListDescription}
                      onChange={(e) => setEditingListDescription(e.target.value)}
                    />
                    <button
                      className="btn"
                      onClick={() => saveEditing(list.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="btn"
                      onClick={() => startEditing(list.id, list.name, list.description)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => openDeleteModal(list.id)}
                    >
                      Remove List
                    </button>
                  </div>
                )}
                <ul>
                  {list.todos.map((todo) => (
                    <li key={todo.id}>
                      {editingTodoId === todo.id ? (
                        <div className="todo-item">
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
                          <button
                            className="btn"
                            onClick={() => saveEditingTodo(list.id, todo.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn"
                            onClick={cancelEditingTodo}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p>{todo.text}</p>
                          <p>{todo.description}</p>
                          <p>Status: {todo.status}</p>
                          <button
                            className="btn"
                            onClick={() => startEditingTodo(todo.id, todo.text, todo.description)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn"
                            onClick={() => removeTodo(list.id, todo.id)}
                          >
                            Remove
                          </button>
                          <button
                            className="btn"
                            onClick={() => changeTodoStatus(list.id, todo.id, "todo")}
                          >
                            Todo
                          </button>
                          <button
                            className="btn"
                            onClick={() => changeTodoStatus(list.id, todo.id, "doing")}
                          >
                            Doing
                          </button>
                          <button
                            className="btn"
                            onClick={() => changeTodoStatus(list.id, todo.id, "done")}
                          >
                            Done
                          </button>
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
                <button
                  className="btn"
                  onClick={() => addTodo(list.id)}
                >
                  Save Todo
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TaskList;
