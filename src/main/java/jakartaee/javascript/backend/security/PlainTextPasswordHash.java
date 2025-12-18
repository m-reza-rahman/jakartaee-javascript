package jakartaee.javascript.backend.security;

import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.security.enterprise.identitystore.PasswordHash;

@ApplicationScoped
public class PlainTextPasswordHash implements PasswordHash {

    @Override
    public void initialize(Map<String, String> parameters) {
        // No initialization needed for plain text comparison.
    }

    @Override
    public String generate(char[] password) {
        return new String(password);
    }

    @Override
    public boolean verify(char[] password, String hashedPassword) {
        if (hashedPassword == null) {
            return false;
        }
        return new String(password).equals(hashedPassword);
    }
}
