package jakartaee.javascript.backend.security;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.io.Serializable;

@RequestScoped
@Path("/auth")
public class AuthResource implements Serializable {
    private static final long serialVersionUID = 1L;

    @GET
    @Path("/user")
    @Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_HTML})
    public Response getCurrentUser(@Context SecurityContext securityContext,
            @QueryParam("redirect") String redirect) {
        String username = (securityContext.getUserPrincipal() != null)
                ? securityContext.getUserPrincipal().getName()
                : ""; 

        // If redirect parameter is present, return HTML that redirects
        if ((redirect != null) && !redirect.trim().isEmpty()) { 
            String html = """
                <!DOCTYPE html>
                <html lang=\"en\">
                <head>
                    <meta charset=\"UTF-8\" />
                    <title>Authentication</title>
                </head>
                <body>
                    <noscript>Please enable JavaScript to continue.</noscript>
                    <script type=\"text/javascript\">
                        window.location.replace(decodeURIComponent(\"%s\"));
                    </script>
                    <p>Authenticated as <strong>%s</strong>. Returning to application.</p>
                </body>
                </html>
                """.formatted(redirect, username);

            return Response.ok(html, MediaType.TEXT_HTML).build(); 
        }

        return Response.ok(new UserInfo(username), MediaType.APPLICATION_JSON).build();
    }

    public static class UserInfo {
        private String username;

        public UserInfo() {}

        public UserInfo(String username) {
            this.username = username;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}
