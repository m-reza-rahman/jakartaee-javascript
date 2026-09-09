import React, { useCallback, useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { fetchToDos, createToDo, updateToDo, deleteToDo } from '../services/todoApi';

interface ToDoItem {
  id: number;
  description: string;
  completed?: boolean;
}

interface TodoPageProps {
  username: string;
}

function TodoPage({ username }: TodoPageProps) {
  const [items, setItems] = useState<ToDoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const loadItems = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const data = await fetchToDos(username);
      setItems(data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const description = newDescription.trim();
    if (!description) return;
    try {
      const created = await createToDo(username, description);
      if (created) setItems((prev) => [...prev, created]);
      setNewDescription('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const handleToggle = async (item: ToDoItem) => {
    const updated = { ...item, completed: !item.completed };
    try {
      await updateToDo(username, updated);
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const startEditing = (item: ToDoItem) => {
    setEditingId(item.id);
    setEditingText(item.description);
  };

  const commitEdit = async () => {
    if (!editingId) return;
    const item = items.find((it) => it.id === editingId);
    if (!item) return;
    const updated = { ...item, description: editingText.trim() };
    try {
      await updateToDo(username, updated);
      setItems((prev) => prev.map((it) => (it.id === editingId ? updated : it)));
      setEditingId(null);
      setEditingText('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteToDo(username, id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  return (
    <div className="p-3">
      <Card.Root className="todo-card shadow-1">
        <Card.Header>
          <Card.Title>{`${username || 'Anonymous'}'s To-Do List`}</Card.Title>
          <Card.Subtitle>
            <span className="text-muted">
              Add tasks, mark them done, edit inline.{' '}
              <span className="badge bg-secondary ms-2">{items.length} items</span>
            </span>
          </Card.Subtitle>
        </Card.Header>
        <Card.Content>
          <form className="p-fluid grid" onSubmit={handleAdd}>
            <div className="col-12 md:col-9">
              <InputText
                placeholder="Buy milk"
                value={newDescription}
                minLength={5}
                maxLength={110}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-12 md:col-3">
              <Button type="submit" className="w-full">
                <i className="pi pi-plus" /> Add
              </Button>
            </div>
          </form>

          {error && (
            <div className="p-message p-component p-message-error mt-3">
              <div className="p-message-wrapper">
                <span className="p-message-icon pi pi-times-circle"></span>
                <span className="p-message-text">{error}</span>
              </div>
            </div>
          )}

          {loading && <div className="text-muted mt-3">Loading...</div>}

          {!loading && items.length > 0 && (
            <ul className="list-group list-group-flush mt-3">
              {items.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <li key={item.id} className="list-group-item d-flex align-items-center gap-3">
                    <Checkbox.Root
                      checked={!!item.completed}
                      onCheckedChange={() => handleToggle(item)}
                    >
                      <Checkbox.Box>
                        <Checkbox.Indicator>
                          <i className="pi pi-check" />
                        </Checkbox.Indicator>
                      </Checkbox.Box>
                    </Checkbox.Root>

                    {!isEditing && (
                      <span
                        className={`flex-grow-1 ${item.completed ? 'text-decoration-line-through text-muted' : ''}`}
                        onDoubleClick={() => startEditing(item)}
                        role="textbox"
                      >
                        {item.description}
                      </span>
                    )}

                    {isEditing && (
                      <form
                        className="d-flex flex-grow-1 gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          commitEdit();
                        }}
                      >
                        <InputText
                          value={editingText}
                          minLength={5}
                          maxLength={110}
                          autoFocus
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)}
                        />
                        <Button
                          type="button"
                          severity="secondary"
                          variant="outlined"
                          className="p-button-outlined p-button-secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          <i className="pi pi-check" /> Save
                        </Button>
                      </form>
                    )}

                    {!isEditing && (
                      <Button
                        variant="link"
                        severity="danger"
                        className="p-button-link p-button-danger ms-auto"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="pi pi-trash" /> Remove
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {!loading && !items.length && (
            <div className="text-muted mt-3">No items yet. Add your first task above.</div>
          )}
        </Card.Content>
      </Card.Root>
    </div>
  );
}

export default TodoPage;
