package jakartaee.javascript.backend.todo;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import java.util.List;

@Repository
public interface ToDoItemRepository extends CrudRepository<ToDoItem, Long> {

    List<ToDoItem> findByUsername(String username);
}
