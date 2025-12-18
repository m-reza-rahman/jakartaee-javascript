package jakartaee.javascript;

import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.security.enterprise.authentication.mechanism.http.BasicAuthenticationMechanismDefinition;
import jakarta.security.enterprise.identitystore.DatabaseIdentityStoreDefinition;
import jakarta.security.enterprise.identitystore.Pbkdf2PasswordHash;

@ApplicationScoped
@DataSourceDefinition(
		name = "java:app/jdbc/JavaScriptDb", 
		className = "org.h2.jdbcx.JdbcDataSource", 
		url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1", user = "sa", password = "")
@DatabaseIdentityStoreDefinition(
		dataSourceLookup = "java:app/jdbc/JavaScriptDb", 
		callerQuery = "SELECT PASSWORD FROM JAVASCRIPT_USERS WHERE USERNAME = ?", 
		groupsQuery = "SELECT GROUP_NAME FROM JAVASCRIPT_GROUPS WHERE USERNAME = ?",
		hashAlgorithm = Pbkdf2PasswordHash.class,
		hashAlgorithmParameters = {
			"Pbkdf2PasswordHash.Algorithm=PBKDF2WithHmacSHA256",
			"Pbkdf2PasswordHash.Iterations=2048",
			"Pbkdf2PasswordHash.SaltSizeBytes=16",
			"Pbkdf2PasswordHash.KeySizeBytes=32"
		})
@BasicAuthenticationMechanismDefinition(realmName = "JavaScriptRealm")
public class SecurityConfig {
	// Security configuration.
}
