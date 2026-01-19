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
    <Card className="todo-card shadow-1">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="h5 mb-0">{username || 'Anonymous'}'s To-Do List</h2>
            <small className="text-muted">Add tasks, mark them done, edit inline.</small>
          </div>
          <span className="badge bg-secondary">{items.length} items</span>
        </div>

      <form className="p-fluid grid" onSubmit={handleAdd}>
        <div className="col-12 md:col-9">
          <InputText
            placeholder="Buy milk"
            value={newDescription}
            minLength={5}
            maxLength={110}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />
        </div>
        <div className="col-12 md:col-3">
          <Button type="submit" label="Add" icon="pi pi-plus" className="w-full" />
        </div>
      </form>

        {error && <div className="p-message p-component p-message-error mt-3"><div className="p-message-wrapper"><span className="p-message-icon pi pi-times-circle"></span><span className="p-message-text">{error}</span></div></div>}

        {loading && <div className="text-muted mt-3">Loading...</div>}

        {!loading && items.length > 0 && (
          <ul className="list-group list-group-flush mt-3">
            {items.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <li key={item.id} className="list-group-item d-flex align-items-center gap-3">
                  <Checkbox checked={!!item.completed} onChange={() => handleToggle(item)} />

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
                    <form className="d-flex flex-grow-1 gap-2" onSubmit={(e) => { e.preventDefault(); commitEdit(); }}>
                      <InputText
                        value={editingText}
                        minLength={5}
                        maxLength={110}
                        autoFocus
                        onChange={(e) => setEditingText(e.target.value)}
                      />
                      <Button type="button" label="Cancel" severity="secondary" outlined onClick={cancelEdit} />
                      <Button type="submit" label="Save" icon="pi pi-check" />
                    </form>
                  )}

                  {!isEditing && (
                    <Button label="Remove" icon="pi pi-trash" link severity="danger" className="ms-auto" onClick={() => handleDelete(item.id)} />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {!loading && !items.length && (
          <div className="text-muted mt-3">No items yet. Add your first task above.</div>
        )}
    </Card>
  );
}

export default TodoPage;
