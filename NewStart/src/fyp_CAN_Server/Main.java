package fyp_CAN_Server;
import org.glassfish.tyrus.server.Server;
import javax.websocket.*;
//import javax.websocket.OnClose;
//import javax.websocket.OnMessage;
//import javax.websocket.OnOpen;
//import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

public class Main {
    public static void main(String[] args) {
        Server server = new Server("localhost", 8025, "/", null, WebSocketEndpoint.class);

        try {
            server.start();
            System.out.println("WebSocket server started.");
            Thread.sleep(Long.MAX_VALUE);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            server.stop();
        }
    }
}



