package jakartaee.javascript.backend.todo;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import java.io.Serializable;
import java.util.List;

@ApplicationScoped
@Path("/todo/{username}")
public class ToDoResource implements Serializable {
    private static final long serialVersionUID = 1L;

    @Inject
    private ToDoService service;

    @POST
    @Consumes({"application/json"})
    @Produces({"application/json"})
    public ToDoItem create(
            @PathParam("username")
            @NotEmpty
            @Size(min = 4, max = 14, message = "User name must be between 4 and 14 characters.")
            String username,
            @Valid ToDoItem item) {
        return service.addToDoItem(username,item);
    }

    @PUT
    @Path("{id}")
    @Consumes({"application/json"})
    public void edit(
            @PathParam("username")
            @NotEmpty
            @Size(min = 4, max = 14, message = "User name must be between 4 and 14 characters.")
            String username,
            @PathParam("id") Long id,
            @Valid ToDoItem item) {
        item.setId(id);
        service.updateToDoItem(username, item);
    }

    @DELETE
    @Path("{id}")
    public void remove(
            @PathParam("username")
            @NotEmpty
            @Size(min = 4, max = 14, message = "User name must be between 4 and 14 characters.")
            String username,
            @PathParam("id") Long id) {
        service.removeToDoItem(username, id);
    }

    @GET
    @Produces({"application/json"})
    public List<ToDoItem> getAll(
            @PathParam("username")
            @NotEmpty
            @Size(min = 4, max = 14, message = "User name must be between 4 and 14 characters.")
            String username) {
        return service.findToDoItemsByUsername(username);
    }
}
