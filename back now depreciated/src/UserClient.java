
public class UserClient {
	
	// Variables
	private int ID;
	private String UserName;
	private String FName;
	private String LName;
	private String HashedPassword;
	
	public UserClient(int id, String username, String fname, String lname, String hashpass) {
		this.ID = id;
		this.UserName = username;
		this.FName = fname;
		this.LName = lname;
		this.HashedPassword = hashpass;
	}
	
	//Methods
	public int getID() {
		return this.ID;
	}
	public void setID(int newID) {
		this.ID = newID;
	}
	public String getUserName() {
		return this.UserName;
	}
	public void setUserName(String newUserName) {
		this.UserName = newUserName;
	}
	public String getFName() {
		return this.FName;
	}
	public void setFName(String newFName) {
		this.FName = newFName;
	}
	public String getLName() {
		return this.LName;
	}
	public void setLName(String newLName) {
		this.LName = newLName;
	}
	public String getHashPass() {
		return this.HashedPassword;
	}
	public void setHashPass(String newHashPass) {
		this.HashedPassword = newHashPass;
	}
	
}
