package jakartaee.javascript.backend.todo;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("resources")
public class RestConfiguration extends Application {
    // Needed to enable Jakarta REST and specify path.
}
