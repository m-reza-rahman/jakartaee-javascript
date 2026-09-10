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
import jakarta.ws.rs.core.UriInfo;
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;

@RequestScoped
@Path("/auth")
public class AuthResource implements Serializable {
    private static final long serialVersionUID = 1L;

    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUser(@Context SecurityContext securityContext,
            @Context UriInfo uriInfo,
            @QueryParam("redirect") String redirect) {
        String username = (securityContext.getUserPrincipal() != null)
                ? securityContext.getUserPrincipal().getName()
                : "";

        if (redirect != null && !redirect.isBlank()) {
            URI target = sameOriginRedirect(redirect, uriInfo);
            if (target == null) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            return Response.seeOther(target).build();
        }

        return Response.ok(new UserInfo(username), MediaType.APPLICATION_JSON).build();
    }

    // Accept only same-origin targets: relative paths starting with a single '/', or absolute URIs whose
    // scheme/host/port match the current request. Rejects protocol-relative, javascript:, data:, etc.
    private static URI sameOriginRedirect(String candidate, UriInfo uriInfo) {
        if (candidate.startsWith("//") || candidate.startsWith("/\\") || candidate.startsWith("\\")) {
            return null;
        }
        URI target;
        try {
            target = new URI(candidate);
        } catch (URISyntaxException ex) {
            return null;
        }
        String scheme = target.getScheme();
        if (scheme == null) {
            return candidate.startsWith("/") ? target : null;
        }
        URI request = uriInfo.getRequestUri();
        String host = target.getHost();
        return scheme.equalsIgnoreCase(request.getScheme())
                && host != null
                && host.equalsIgnoreCase(request.getHost())
                && target.getPort() == request.getPort() ? target : null;
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
