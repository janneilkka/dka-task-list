import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Plus } from "react-feather";
import Modal from "./Modal";

const TaskList = () => {
  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem("lists");
    return storedLists ? JSON.parse(storedLists) : [];
  });

  const [newListName, setNewListName] = useState("");
  const [newListNameError, setNewListNameError] = useState("");

  const [newListDescription, setNewListDescription] = useState("");

  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [editingListDescription, setEditingListDescription] = useState("");
  const [editingListNameError, setEditingListNameError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const [openListId, setOpenListId] = useState(null);

  const [newTodoText, setNewTodoText] = useState("");

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");

  const [isAddingNewList, setIsAddingNewList] = useState(false);

  const [todoFilter, setTodoFilter] = useState("all");

  const filterTodos = (todos) => {
    if (todoFilter === "all") return todos;
    return todos.filter((todo) => todo.status === todoFilter);
  };

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  const validateListName = (name, setError) => {
    const regex = /^[\p{L}\p{N} ]{1,60}$/u;
    if (!regex.test(name)) {
      setError("List name can only contain letters and numbers, and must be 60 characters or less.");
      return false;
    }
    setError("");
    return true;
  };

  const isDuplicateListName = (name, listId = null) => {
    return lists.some((list) => list.name === name && list.id !== listId);
  };

  const addList = () => {
    if (validateListName(newListName, setNewListNameError)) {
      if (isDuplicateListName(newListName)) {
        setNewListNameError("List name already exists. Please choose another name.");
        return;
      }
      setLists([...lists, { id: Date.now(), name: newListName, description: newListDescription, todos: [] }]);
      setNewListName("");
      setNewListDescription("");
      setIsAddingNewList(false);
    }
  };

  const removeList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  const addTodo = (listId) => {
    if (newTodoText.trim() !== "") {
      setLists(lists.map((list) => (list.id === listId ? { ...list, todos: [...list.todos, { id: Date.now(), text: newTodoText, status: "todo" }] } : list)));
      setNewTodoText("");
    }
  };

  const removeTodo = (listId, todoId) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, todos: list.todos.filter((todo) => todo.id !== todoId) } : list)));
  };

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

  const startEditing = (listId, currentName, currentDescription) => {
    setEditingListId(listId);
    setEditingListName(currentName);
    setEditingListDescription(currentDescription);
    setEditingListNameError("");
  };

  const cancelEditing = () => {
    setEditingListId(null);
    setEditingListName("");
    setEditingListDescription("");
    setEditingListNameError("");
  };

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

  const startEditingTodo = (todoId, currentText) => {
    setEditingTodoId(todoId);
    setEditingTodoText(currentText);
  };

  const cancelEditingTodo = () => {
    setEditingTodoId(null);
    setEditingTodoText("");
  };

  const saveEditingTodo = (listId, todoId) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              todos: list.todos.map((todo) => (todo.id === todoId ? { ...todo, text: editingTodoText } : todo)),
            }
          : list
      )
    );
    cancelEditingTodo();
  };

  const openDeleteModal = (listId) => {
    setListToDelete(listId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setListToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (listToDelete !== null) {
      removeList(listToDelete);
      setOpenListId(null);
      closeDeleteModal();
    }
  };

  const toggleListVisibility = (listId) => {
    setOpenListId(openListId === listId ? null : listId);
  };

  return (
    <div>
      <header className="header">
        <h1>Todo Lists</h1>
        {isAddingNewList ? (
          <div className="input-fields">
            <div className="input-labels">
              <label htmlFor="new-list-name">Name of new list:</label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="E.g. Cooking"
                id="new-list-name"
              />
              {newListNameError && (
                <label
                  htmlFor="edit-list-name"
                  style={{ color: "#ff5b5b" }}
                >
                  {newListNameError}
                </label>
              )}
            </div>
            <div className="input-labels">
              <label htmlFor="new-list-description">Description of new list:</label>
              <input
                type="text"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                placeholder="E.g. Recipes to try out"
                id="new-list-description"
              />
            </div>
            <button onClick={addList}>Add List</button>
          </div>
        ) : (
          <button onClick={() => setIsAddingNewList(true)}>
            Make a new list
            <Plus
              color="#ffffff"
              size="16"
              style={{ marginLeft: "4px" }}
            />
          </button>
        )}
      </header>
      <main>
        <div className="task-list">
          {lists.length === 0 ? (
            <p style={{ fontStyle: "italic" }}>Make your first list by clicking the &quot;Make a new list&quot; -button</p>
          ) : (
            lists.map((list) => (
              <div
                key={list.id}
                className={`list-item ${openListId === list.id ? "open" : "closed"}`}
                style={{ display: openListId && openListId !== list.id ? "none" : "" }}
              >
                <div className="list-name-section">
                  {openListId === list.id && (
                    <div style={{ display: "flex" }}>
                      <button
                        onClick={() => toggleListVisibility(list.id)}
                        className="button-link"
                      >
                        <ArrowLeft
                          color="#ffffff"
                          size="16"
                          style={{ marginRight: "4px" }}
                        />
                        Back to all lists
                      </button>
                    </div>
                  )}
                  <h2>{list.name}</h2>
                  <p>{list.description}</p>
                  {openListId !== list.id && <button onClick={() => toggleListVisibility(list.id)}>Open list</button>}
                </div>
                {openListId === list.id && (
                  <div>
                    {editingListId === list.id ? (
                      <div className="input-fields">
                        <div className="input-labels">
                          <label htmlFor="edit-list-name">Edit list name:</label>
                          <input
                            type="text"
                            value={editingListName}
                            onChange={(e) => setEditingListName(e.target.value)}
                            id="edit-list-name"
                          />
                          {editingListNameError && (
                            <label
                              htmlFor="edit-list-name"
                              style={{ color: "#ff5b5b" }}
                            >
                              {editingListNameError}
                            </label>
                          )}
                        </div>
                        <div className="input-labels">
                          <label htmlFor="edit-list-description">Edit list description:</label>
                          <input
                            type="text"
                            value={editingListDescription}
                            onChange={(e) => setEditingListDescription(e.target.value)}
                            id="edit-list-description"
                          />
                        </div>
                        <button onClick={() => saveEditing(list.id)}>Save</button>
                        <button onClick={cancelEditing}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button onClick={() => startEditing(list.id, list.name, list.description)}>Edit name</button>
                        <button onClick={() => openDeleteModal(list.id)}>Remove list</button>
                      </div>
                    )}
                    <div className="input-fields">
                      <div className="input-labels">
                        <label htmlFor="add-task">Add new task to this list:</label>
                        <input
                          type="text"
                          value={newTodoText}
                          onChange={(e) => setNewTodoText(e.target.value)}
                          placeholder="New todo"
                          id="add-task"
                        />
                      </div>
                      <button onClick={() => addTodo(list.id)}>Add task</button>
                    </div>
                    <label htmlFor="filter-buttons">
                      <h3>Filter the tasks in this list:</h3>
                    </label>
                    <select
                      className="filter-buttons"
                      name="filter-buttons"
                      id="filter-buttons"
                      value={todoFilter}
                      onChange={(e) => setTodoFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="todo">Todo</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </select>
                    <ul className="task-list-content">
                      {filterTodos(list.todos).map((todo) => (
                        <li
                          key={todo.id}
                          className="task"
                        >
                          {editingTodoId === todo.id ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <div className="input-fields">
                                <div className="input-labels">
                                  <label htmlFor="edit-task">Edit task name:</label>
                                  <input
                                    type="text"
                                    value={editingTodoText}
                                    onChange={(e) => setEditingTodoText(e.target.value)}
                                    id="edit-task"
                                  />
                                </div>
                              </div>
                              <button onClick={() => saveEditingTodo(list.id, todo.id)}>Save</button>
                              <button onClick={cancelEditingTodo}>Cancel</button>
                            </div>
                          ) : (
                            <div>
                              <div className="task-content">
                                <p>{todo.text}</p>
                              </div>
                              <div className="task-controls">
                                <div className="input-fields">
                                  <div className="input-labels">
                                    <label htmlFor="status-selector">Status of task:</label>
                                    <select
                                      value={todo.status}
                                      onChange={(e) => changeTodoStatus(list.id, todo.id, e.target.value)}
                                      className="filter-buttons"
                                      id="status-selector"
                                    >
                                      <option
                                        value=""
                                        disabled
                                      >
                                        Select status
                                      </option>
                                      <option value="todo">Todo</option>
                                      <option value="doing">Doing</option>
                                      <option value="done">Done</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  className="button-secondary"
                                  onClick={() => startEditingTodo(todo.id, todo.text)}
                                >
                                  Edit task
                                </button>
                                <button
                                  className="button-link"
                                  onClick={() => removeTodo(list.id, todo.id)}
                                >
                                  Delete task
                                  <Trash2
                                    color="#ffffff"
                                    size="16"
                                    style={{ marginLeft: "4px" }}
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TaskList;
