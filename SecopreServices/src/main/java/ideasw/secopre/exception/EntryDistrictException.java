package ideasw.secopre.exception;

import ideasw.secopre.utils.number.NumberUtils;

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
	
	public EntryDistrictException(Long districtId, Long entryId, Long month){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryId + ", mes: " + month + ". Verifique.");
	}
	
	public EntryDistrictException(String districtId, String entryId, String month){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryId + ", mes: " + month + ". Verifique.");
	}
	
	public EntryDistrictException(Long districtId, Long entryId, Long month, Double amount){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryId + ", mes: " + month + "con monto:" + NumberUtils.round(amount, 2));
	}
	
	public EntryDistrictException(String districtId, String entryId, String month, Double currentAmount, Double amount){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryId + ", mes: " + month + " con monto: " + NumberUtils.round(amount, 2) + ". Saldo disponible: " + NumberUtils.round(currentAmount, 2));
	}
	
	public EntryDistrictException(String districtId, String entryCode, String entryId, String month, Double currentAmount, Double amount){
		super("Error al tratar de afectar distrito: " + districtId + ", partida: " + entryCode + " - "+ entryId + ", mes: " + month + " con monto: " + NumberUtils.round(amount, 2) + ". Saldo disponible: " + NumberUtils.round(currentAmount, 2));
	}
}
