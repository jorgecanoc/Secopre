package ideasw.secopre.dto;

import java.util.Date;

public class Rectification {

	private Long requestId;
	private String folio;
	private String justification;
	private String formalityDescription;
	private Date creationDate;
	private Double totalAmount;
	private String userName;
	private boolean hasRectification;
	private String rectificationFolio;
	public Long getRequestId() {
		return requestId;
	}
	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}
	public String getFolio() {
		return folio;
	}
	public void setFolio(String folio) {
		this.folio = folio;
	}
	public String getJustification() {
		return justification;
	}
	public void setJustification(String justification) {
		this.justification = justification;
	}
	public String getFormalityDescription() {
		return formalityDescription;
	}
	public void setFormalityDescription(String formalityDescription) {
		this.formalityDescription = formalityDescription;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public Double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public boolean getHasRectification() {
		return hasRectification;
	}
	public void setHasRectification(boolean hasRectification) {
		this.hasRectification = hasRectification;
	}
	public String getRectificationFolio() {
		return rectificationFolio;
	}
	public void setRectificationFolio(String rectificationFolio) {
		this.rectificationFolio = rectificationFolio;
	}
}
