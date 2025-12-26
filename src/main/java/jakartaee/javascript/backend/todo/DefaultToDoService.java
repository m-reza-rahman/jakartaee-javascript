package jakartaee.javascript.backend.todo;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Stateless
public class DefaultToDoService implements ToDoService {

    private static final Logger logger = Logger.getLogger(DefaultToDoService.class.getName());

    @Inject
    private ToDoItemRepository repository;

    @Override
    public ToDoItem addToDoItem(String username, ToDoItem item) {
        item.setUsername(username);

        logger.log(Level.INFO, "Adding item: {0}", item);

        return repository.create(item);
    }

    @Override
    public void updateToDoItem(String username, ToDoItem item){
        item.setUsername(username);

        logger.log(Level.INFO, "Updating item: {0}", item);

        repository.update(item);
    }

    @Override
    public void removeToDoItem(String username, Long id) {
        ToDoItem item = repository.find(id);

        logger.log(Level.INFO, "Removing item: {0}", item);

        repository.delete(item);
    }

    @Override
    public List<ToDoItem> findToDoItemsByUsername(String username) {
        logger.log(Level.INFO, "Getting all items for: {0}", username);

        return repository.findByUsername(username);
    }
}
