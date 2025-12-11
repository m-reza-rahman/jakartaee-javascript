package jakartaee.javascript.backend.chat;

import java.io.StringReader;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.websocket.Decoder;
import jakarta.websocket.Encoder;
import jakarta.websocket.EndpointConfig;

public class ChatMessage implements Decoder.Text<ChatMessage>, Encoder.Text<ChatMessage> {

	@NotBlank
	@Size(min = 4, max = 14, message = "User name must be between 4 and 14 characters.")
	private String user;

	@NotBlank
	@Size(min = 2, max = 255, message = "Message must be between 2 and 255 characters.")
	private String message;

	@Override
	public void init(EndpointConfig config) {
		// Nothing to do.
	}

	@Override
	public ChatMessage decode(String value) {
		try (JsonReader jsonReader = Json.createReader(new StringReader(value))) {
			JsonObject jsonObject = jsonReader.readObject();
			user = jsonObject.getString("user");
			message = jsonObject.getString("message");
		}

		return this;
	}

	@Override
	public boolean willDecode(String string) {
		return true; // Detect if it's a valid format.
	}

	@Override
	public String encode(ChatMessage chatMessage) {
		JsonObject jsonObject = Json.createObjectBuilder().add("user", chatMessage.user)
				.add("message", chatMessage.message)
				.add("timestamp", ZonedDateTime.now().format(DateTimeFormatter.ofPattern("MM/dd/yyyy h:mm:ss a z")))
				.build();

		return jsonObject.toString();
	}

	@Override
	public void destroy() {
		// Nothing to do.
	}

	@Override
	public String toString() {
		return "ChatMessage{" + "user=" + user + ", message=" + message + '}';
	}
}
