package jakartaee.javascript.backend.todo;

import java.util.List;

public interface ToDoItemRepository {

	ToDoItem create(ToDoItem item);

	void delete(ToDoItem item);

	ToDoItem find(Long id);

	List<ToDoItem> findByUsername(String username);

	void update(ToDoItem item);
}
