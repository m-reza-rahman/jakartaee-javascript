package jakartaee.javascript.backend.auth;

import java.io.Serializable;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@RequestScoped
@Path("/auth")
public class AuthResource implements Serializable {

	private static final long serialVersionUID = 1L;

	@GET
	@Path("/user")
	@Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_HTML})
	@RolesAllowed("javascript_user")
	public Response getCurrentUser(
			@Context SecurityContext securityContext,
			@QueryParam("redirect") String redirect) {
		String username = securityContext.getUserPrincipal() != null 
			? securityContext.getUserPrincipal().getName() 
			: "";

		// If redirect parameter is present, return HTML that redirects
		if (redirect != null && !redirect.trim().isEmpty()) {
			String html = "<!DOCTYPE html>\n" +
				"<html lang=\"en\">\n" +
				"<head>\n" +
				"  <meta charset=\"UTF-8\" />\n" +
				"  <title>Authentication</title>\n" +
				"</head>\n" +
				"<body>\n" +
				"  <noscript>Please enable JavaScript to continue.</noscript>\n" +
				"  <script type=\"text/javascript\">\n" +
				"    window.location.replace(decodeURIComponent(\"" + redirect + "\"));\n" +
				"  </script>\n" +
				"  <p>Authenticated as <strong>" + username + "</strong>. Returning to application.</p>\n" +
				"</body>\n" +
				"</html>";
			return Response.ok(html, MediaType.TEXT_HTML).build();
		}

		// Otherwise return JSON
		return Response.ok(new UserInfo(username), MediaType.APPLICATION_JSON).build();
	}

	public static class UserInfo {
		private String username;

		public UserInfo() {
		}

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
