import java.io.*;
import java.net.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;

  


// Server class
class Server {
	
	// server variables
	private Vector<ClientHandler> activeClients = new Vector<>(); 
	private static Vector<UserClient> allClients = new Vector<>();
	private static Vector<DataPoint> dataPoints = new Vector<>();
	
	// public static void readUserSaveData() {
    //     try (BufferedReader br = new BufferedReader(new FileReader("savedUsers.txt"))) {
    //         String line;
    //         while ((line = br.readLine()) != null) {
    //             String[] values = line.split(",");
    //             UserClient savedUser = new UserClient(Integer.parseInt(values[0]), values[1], values[2], values[3], values[4]);
    //             allClients.add(savedUser);
    //             System.out.println("User " + Integer.parseInt(values[0]) + " "+ values[1]+  " retreived and rendered");
    //         }
    //         readDataPointSaveData();
    //     } catch (FileNotFoundException e1) {
	// 		System.out.println("File not found");
	// 		e1.printStackTrace();
	// 	} catch (IOException e1) {
	// 		System.out.println("IO Error");
	// 		e1.printStackTrace();
	// 	}
	// }
	// public static void readDataPointSaveData() {
	// 	try (BufferedReader br = new BufferedReader(new FileReader("savedDataPoints.txt"))) {
    //         String line;
    //         while ((line = br.readLine()) != null) {
    //             String[] values = line.split(",");
    //             DataPoint savedDP = new DataPoint(Integer.parseInt(values[0]), values[1], values[2], values[3], Float.parseFloat(values[4]), Float.parseFloat(values[5]));
    //             dataPoints.add(savedDP);
    //             System.out.println("Data point " + Integer.parseInt(values[0]) + " "+ values[1]+  " retrived and rendered");
    //         }
    //     } catch (FileNotFoundException e1) {
	// 		System.out.println("File not found");
	// 		e1.printStackTrace();
	// 	} catch (IOException e1) {
	// 		System.out.println("IO Error");
	// 		e1.printStackTrace();
	// 	}
	// }
    
	public Object toJSON() {
        JSONArray arr = new JSONArray();
        JSONObject obj = new JSONObject();
        return obj;
    }

	public static void main(String[] args)
    {
        ServerSocket server = null;
        //readUserSaveData();
        
  
        try {
  
            // server is listening on port 1234
            server = new ServerSocket(8080);
            server.setReuseAddress(true);
  
            // running infinite loop for getting
            // client request
            while (true) {
  
                // socket object to receive incoming client
                // requests
                Socket client = server.accept();
  
                // Displaying that new client is connected
                // to server
                System.out.println("New client connected" + client.getInetAddress().getHostAddress());
                // create a new thread object
                ClientHandler clientSock = new ClientHandler(client);
                System.out.println(client);
                // This thread will handle the client
                // separately
                new Thread(clientSock).start();
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            if (server != null) {
                try {
                    server.close();
                }
                catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    // ClientHandler class
    private static class ClientHandler implements Runnable {
        private final Socket clientSocket;
        //private PrintWriter toClient;
        DataOutputStream toClient;
        private BufferedReader fromClient;
        private UserClient thisClient;
    	private HashMap<String, String> connectionHead =  new HashMap<String, String>();
    	
  
        // Constructor
        public ClientHandler(Socket socket) throws IOException
        {
	            this.clientSocket = socket;
	            //toClient = new PrintWriter(clientSocket.getOutputStream(), true);
	            fromClient = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                toClient = new DataOutputStream(clientSocket.getOutputStream());
        }
        
        public HashMap<String, String> parseHttpHeader(String h) {
            HashMap<String, String> fields = new HashMap<String, String>();
            String[] rows = h.split("\n");
            System.out.println(rows[1]);
            if (rows.length > 1) {           	
                fields.put("Prototcol", rows[0]);
                Pattern pattern = Pattern.compile("^([^:]+): (.+)$");
                for (int i = 1; i < rows.length; i++) {
                    Matcher matcher = pattern.matcher(rows[i]);
                    while (matcher.find()) {
                        if (matcher.groupCount() == 2) {
                            fields.put(matcher.group(1), matcher.group(2));
                        }
                    }
                }
            }
            return fields;
        }
        
        public void messageRecieved(String message) throws IOException, NoSuchAlgorithmException {
            System.out.println("request \n " + message);
        	if (connectionHead.size() == 0) {
                connectionHead = parseHttpHeader(message);
                handshakeResponse();
            } else {
                System.out.println(message);
            }
        }
        
        public byte[] SHA1Hash(byte[] bytes) {
            MessageDigest md;

            try {
                md = MessageDigest.getInstance("SHA-1");
            } catch (NoSuchAlgorithmException e) {
                return null;
            }

            md.update(bytes);
            return md.digest();
        }

        public byte[] base64Encode(byte[] bytes) {
            byte[] encodedBytes = Base64.getEncoder().encode(bytes);
            return encodedBytes;
        }
        
        public void handshakeResponse() throws IOException, NoSuchAlgorithmException {
        	String secWebSocketKey, secWebSocketAccept, GUID, template, merged, toSend;
            secWebSocketKey = connectionHead.get("Sec-WebSocket-Key");
            GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
            template = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n";
            
            merged = secWebSocketKey + GUID;
            byte[] asBytes = merged.getBytes();
            byte[] sha1 = SHA1Hash(asBytes);
            byte[] base64 = base64Encode(sha1);
            secWebSocketAccept = new String(base64);


            toSend = String.format(template, secWebSocketAccept);
            System.out.println("response \n " +toSend);
            
            try {
                toClient.writeBytes(toSend);
            //toClient.write(toSend, 0, toSend.length());
            }
            catch (Exception e) {
            	e.printStackTrace();
            }
			toClient.flush();
			requestListener();
        }
        public void requestListener() throws IOException {

        	System.out.println("Listening...");
        	toClient.writeBytes("Im listening");
        	String line;
        	String message = "";
        	String decode ="";
        	while(true) {
            while ((line = fromClient.readLine()) != null) {
            	try {
            		System.out.println(line);
            		message += line + "\n";
            		decode = new String(Base64.getDecoder().decode(line.getBytes()));
            		System.out.println(decode);
            		String _class = "";
            		JSONObject json = new JSONObject();
            		try {
            			JSONParser parser = new JSONParser();
            			json = (JSONObject) parser.parse(decode);
            			_class = (String) json.get("_class");
            		}catch(NoSuchElementException e) {
            			System.out.println(e);
            		}catch(Exception e) {
            			System.out.println(e);
            		}
            		
            		//  Add switch case here to get all request types
            		if(_class.equals("logout")) {
            			this.clientSocket.close();
            			break;
            			// This is where the user logs out 
            		}
            		else {
            			
            		}
            		// Other requests go here 
            		
            	} catch (IOException e) {
            		e.printStackTrace();
            	}
            }

        }
        }
        
        public void connectionEst() {
        	
        	
        	
        	        
        	
        }
        

  
        public void run()
        {
            String message = "";
            try {
                String line;
                while ((line = fromClient.readLine()) != null  && !line.isEmpty()) {
                		message += line + "\n";
                }
                messageRecieved(message);
            }
            catch (IOException | NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
//            finally {
//                try {
//                    if (out != null) {
//                        out.close();
//                    }
//                    if (in != null) {
//                        in.close();
//                        clientSocket.close();
//                    }
//                }
//                catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
        }
    }
}