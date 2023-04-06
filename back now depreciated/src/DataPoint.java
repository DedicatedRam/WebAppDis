public class DataPoint {
	
	//Variables
	private int ID;
	private String Name;
	private String Description;
	private String Type;
	private float XCoOrd;
	private float YCoOrd;
	
	// Constructor 
	public DataPoint(int id, String name, String desc, String type, float xcord, float ycord) {
		this.ID = id;
		this.Name = name;
		this.Description =desc;
		this.Type = type;
		this.XCoOrd = xcord;
		this.YCoOrd = ycord;
	}
	
	//Methods
	public int getID() {
		return this.ID;
	}
	public void setID(int newID) {
		this.ID = newID;
	}
	public String getName() {
		return this.Name;
	}
	public void setName(String newName) {
		this.Name = newName;
	}
	public String getDescription() {
		return this.Description;
	}
	public void setDescription(String newDescription) {
		this.Description = newDescription;
	}
	public String getType() {
		return this.Type;
	}
	public void setType(String newType) {
		this.Type = newType;
	}
	public float getXCoOrd() {
		return this.XCoOrd;
	}
	public void setXCoOrd(float newXCoOrd) {
		this.XCoOrd = newXCoOrd;
	}
	public float getYCoOrd() {
		return this.YCoOrd;
	}
	public void setYCoOrd(float newYCoOrd) {
		this.YCoOrd = newYCoOrd;
	}
}
