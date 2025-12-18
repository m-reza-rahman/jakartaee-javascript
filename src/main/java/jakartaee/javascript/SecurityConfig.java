package jakartaee.javascript;

import jakarta.annotation.security.DeclareRoles;
import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.security.enterprise.authentication.mechanism.http.BasicAuthenticationMechanismDefinition;
import jakarta.security.enterprise.identitystore.DatabaseIdentityStoreDefinition;

@ApplicationScoped
@DataSourceDefinition(
		name = "java:app/jdbc/JavaScriptDb", 
		className = "org.h2.jdbcx.JdbcDataSource", 
		url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1", user = "sa", password = "")
@DatabaseIdentityStoreDefinition(
	dataSourceLookup = "java:app/jdbc/JavaScriptDb", 
	callerQuery = "SELECT PASSWORD FROM JAVASCRIPT_USERS WHERE USERNAME = ?", 
	groupsQuery = "SELECT GROUP_NAME FROM JAVASCRIPT_GROUPS WHERE USERNAME = ?")
@BasicAuthenticationMechanismDefinition(realmName = "JavaScriptRealm")
@DeclareRoles({"javascript_user"})
public class SecurityConfig {
	// Security configuration.
}
