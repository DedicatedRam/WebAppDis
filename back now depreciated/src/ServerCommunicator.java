import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

public class ServerCommunicator {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5555);
        System.out.println("Server running on port 5555");

        while (true) {
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connected from: " + clientSocket.getInetAddress());

            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

            Map<String, String> requestHeaders = new HashMap<>();
            String line;
            System.out.println(in.readLine());
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                String[] header = line.split(":", 2);
                requestHeaders.put(header[0].trim(), header[1].trim());
                System.out.println(header[0]);
                System.out.println(header[1]);
            }
            //System.out.println(requestHeaders);
            
            if (!requestHeaders.containsKey("Authorization") || 
                !requestHeaders.get("Authorization").equals("secret_token")) {
            	System.out.println("if hit");
                out.println("HTTP/1.1 401 Unauthorized");
                out.println("WWW-Authenticate: Basic realm=\"Authentication Required\"");
                out.println();
                out.flush();
                continue;
            }

            String requestMethod = in.readLine().split(" ")[0];
            System.out.println("Received request: " + requestMethod);

            if (requestMethod.equals("OPTIONS")) {
            	System.out.println("options hit");
                out.println("HTTP/1.1 200 OK");
                out.println("Access-Control-Allow-Origin: *");
                out.println("Access-Control-Allow-Methods: GET, POST, OPTIONS");
                out.println("Access-Control-Allow-Headers: Authorization");
                out.println();
                out.flush();
            } else {
            	System.out.println("else hit");
                out.println("HTTP/1.1 400 Bad Request");
                out.println("Content-Type: text/plain");
                out.println();
                out.println("Only OPTIONS request is supported.");
                out.flush();
            }
        }
    }
}
