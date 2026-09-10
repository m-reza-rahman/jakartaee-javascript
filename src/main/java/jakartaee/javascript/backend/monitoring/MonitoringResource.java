package jakartaee.javascript.backend.monitoring;

import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ManagedScheduledExecutorService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

@Path("/monitoring")
public class MonitoringResource {
    private static final Logger logger = Logger.getLogger(MonitoringResource.class.getName());

    @Resource
    private ManagedScheduledExecutorService scheduler;

    @GET
    @Path("/memory")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void streamMemory(@Context Sse sse, @Context SseEventSink sink) {
        logger.log(Level.INFO, "SSE stream opened for memory monitoring.");

        Runnable task = new Runnable() {
            @Override
            public void run() {
                if (sink.isClosed()) {
                    logger.log(Level.INFO, "SSE stream closed, stopping memory monitoring.");
                    return;
                }

                var usedBytes = Runtime.getRuntime().totalMemory()
                        - Runtime.getRuntime().freeMemory();
                var usedMB = usedBytes / (1024.0 * 1024.0);

                var event = sse.newEventBuilder().name("memory")
                        .data(String.class, String.format(Locale.ROOT, "%.2f", usedMB)).build();

                logger.log(Level.INFO, "Broadcasting memory usage: {0} MB.", usedMB);
                sink.send(event);
                scheduler.schedule(this, 10, TimeUnit.SECONDS);
            }
        };

        task.run(); // The very first execution.
    }
}
