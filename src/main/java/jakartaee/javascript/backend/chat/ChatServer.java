package jakartaee.javascript.backend.chat;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import jakarta.ejb.Singleton;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.websocket.EncodeException;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@Singleton
@ServerEndpoint(value = "/chat", encoders = { ChatMessage.class }, decoders = { ChatMessage.class })
public class ChatServer {

	private static final Logger logger = Logger.getLogger(ChatServer.class.getName());

	private final Set<Session> peers;

	public ChatServer() {
		peers = new HashSet<>();
	}

	@OnOpen
	public void onOpen(Session peer) {
		logger.log(Level.INFO, "Opened session: {0}", peer);
		peers.add(peer);
	}

	@OnClose
	public void onClose(Session peer) {
		logger.log(Level.INFO, "Closed session: {0}", peer);
		peers.remove(peer);
	}

	@OnMessage
	public void onMessage(@Valid ChatMessage message, Session session) {
		logger.log(Level.INFO, "Received message {0} from peer {1}", new Object[] { message, session });

		for (Session peer : peers) {
			try {
				logger.log(Level.INFO, "Broadcasting message {0} to peer {1}", new Object[] { message, peer });

				peer.getBasicRemote().sendObject(message);
			} catch (IOException | EncodeException ex) {
				logger.log(Level.SEVERE, "Error sending message", ex);
			}
		}
	}

	@OnError
	public void onError(Session session, Throwable error) {
		try {
			if (error.getCause() instanceof ConstraintViolationException) {
				// Just report the first validation problem.
				JsonObject jsonObject = Json.createObjectBuilder()
						.add("error", ((ConstraintViolationException) error.getCause()).getConstraintViolations()
								.iterator().next().getMessage())
						.build();
				session.getBasicRemote().sendText(jsonObject.toString());
			} else {
				logger.log(Level.SEVERE, null, error);
			}
		} catch (IOException ex) {
			logger.log(Level.SEVERE, null, ex);
		}
	}
}
