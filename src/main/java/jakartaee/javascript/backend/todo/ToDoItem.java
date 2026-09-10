package jakartaee.javascript.backend.todo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "todo_item")
public class ToDoItem implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private Long id;

    private String username;

    @NotEmpty
    @Size(min = 5, max = 110, message = "Item description must be between 5 and 110 characters.")
    private String description;

    private boolean completed;

    protected ToDoItem() {
        // Default constructor
    }

    public ToDoItem(String username, String description, boolean completed) {
        this.username = username;
        this.description = description;
        this.completed = completed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public boolean equals(Object object) {
        return object instanceof ToDoItem other && Objects.equals(id, other.id);
    }

    @Override
    public String toString() {
        return "ToDoItem[ id=" + id + " username=" + username + " desciption=" + description
                + " completed=" + completed + " ]";
    }
}
