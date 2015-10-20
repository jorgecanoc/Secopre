package ideasw.secopre.exception;

public class EntryDistrictException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public EntryDistrictException(){
		
	}
	
	public EntryDistrictException(String message){
		super(message);
	}
	
	public EntryDistrictException(Long districtId, Long entryId, Long month, Double amount){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryId + ", mes: " + month + "con monto:" + amount );
	}
	
	public EntryDistrictException(String districtId, String entryId, String month, Double currentAmount, Double amount){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryId + ", mes: " + month + " con monto: " + amount + ". Saldo disponible: " + currentAmount);
	}
}
