package jakartaee.javascript.backend.todo;

import jakarta.enterprise.context.Dependent;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@Dependent
public class DefaultToDoItemRepository implements ToDoItemRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ToDoItem create(ToDoItem item) {
        entityManager.persist(item);

        return item;
    }

    @Override
    public ToDoItem find(Long id) {
        return entityManager.find(ToDoItem.class, id);
    }

    @Override
    public List<ToDoItem> findByUsername(String username) {
        return entityManager.createNamedQuery("ToDoItem.findByUsername", ToDoItem.class)
                .setParameter("username", username).getResultList();
    }

    @Override
    public void update(ToDoItem item) {
        entityManager.merge(item);
    }

    @Override
    public void delete(ToDoItem item) {
        entityManager.remove(item);
    }
}
