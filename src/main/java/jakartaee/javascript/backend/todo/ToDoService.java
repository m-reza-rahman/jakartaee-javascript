package jakartaee.javascript.backend.todo;

import java.util.List;

public interface ToDoService {

    ToDoItem addToDoItem(String username, ToDoItem item);

    List<ToDoItem> findToDoItemsByUsername(String username);

    void removeToDoItem(String username, Long id);

    void updateToDoItem(String username, ToDoItem item);
}
