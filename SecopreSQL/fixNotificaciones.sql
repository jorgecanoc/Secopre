/*
	-- A* ALTER A TABLA DE NOTIFICACIONES
	-- B* AJUSTE A TRIGGER PARA BAJAR EL REQUEST_ID
*/

-- A* 
ALTER TABLE secopre.NOTIFICATION ADD(
	REQUEST_ID BIGINT(20)
);

-- B*
DROP TRIGGER IF EXISTS createNotification;
DELIMITER $$
CREATE TRIGGER createNotification AFTER INSERT ON secopre.REQUEST_HISTORY
  FOR EACH ROW
    BEGIN
	   
	  DECLARE creator BIGINT(10);
	  DECLARE request_id BIGINT(10);
	  DECLARE transition BIGINT(10);
	  DECLARE request_owner BIGINT(10);
	  DECLARE message varchar(1000);
	  DECLARE role_count INTEGER(10);
	  
	  /*datos para notificaciones persistentes*/
	  DECLARE v_username VARCHAR(1000);
	  DECLARE v_folio VARCHAR(1000);
	  DECLARE stage VARCHAR(1000);
	  
	  SET creator = NEW.USER_ID;
	  SET request_id = NEW.REQUEST_ID;
	  SET transition = NEW.WORKFLOW_CONFIG_ID;
	  SET message = '';
	    
	  SELECT RH.USER_ID INTO request_owner
	    FROM secopre.REQUEST_HISTORY RH
	   WHERE RH.REQUEST_ID = request_id
	     AND CONSECUTIVE = 1;
	     
	  /* se obtiene el folio */
	  	SELECT FOLIO INTO v_folio FROM secopre.REQUEST WHERE ID = request_id;
	  	
	  	/* se obtiene la etapa */
	  	SELECT S.DESCRIPTION 
	  	  INTO stage
		  FROM secopre.STAGE_CONFIG SC,
		  	   secopre.STAGE S,
		  	   secopre.WORKFLOW_CONFIG WC
		 WHERE SC.STAGE_ID = S.ID
		   AND SC.ID = WC.NEXT_STAGE_CONFIG
		   AND WC.ID = transition;
	  
	  /*si el que avanzo el folio no es el dueño, se le avisa al dueño que su folio se avanzó */
	  IF creator <> request_owner THEN
	  
	  	/* se obtiene el usuario */
	  	SELECT USERNAME INTO v_username FROM secopre.USER WHERE ID = creator;
	  	
	  	SET message = CONCAT('El usuario ', v_username, ' avanzo su folio ', v_folio, ' a la etapa: ', stage);
	  
	  	 INSERT INTO secopre.NOTIFICATION
	      (USER_ID, TYPE, MESSAGE, STATUS, TRANSITION_ID, REQUEST_ID)
	      VALUES
	      (request_owner, 1, message, 1, transition, request_id);
	  	
	  END IF;
	  
	  /*si el usuario que esta avanzando el rol, no tiene acceso a la siguiente etapa, notifica que esta soltando un folio*/
	  SELECT COUNT(*) ROL_COUNT 
	      INTO role_count
		  FROM secopre.STAGE_CONFIG_ROLE SCR,
		 	   secopre.WORKFLOW_CONFIG WC,
		 	   secopre.USER_ROLE UR
		 WHERE WC.NEXT_STAGE_CONFIG = SCR.STAGE_CONFIG_ID
		   AND WC.ID = transition
		   AND SCR.ROLE_ID = UR.ROLE_ID
		   AND UR.USER_ID = creator;
	  
      /* creo una notificacion por cada rol */
 	  IF role_count <= 0 THEN
 	  
 	  	SET message = IFNULL(CONCAT('Folio ', COALESCE(v_folio,''), ' avanzado a etapa: ', COALESCE(stage,'')), 'NULO NO SE PORQUE');
 	  
 	  	INSERT INTO secopre.NOTIFICATION
	      (USER_ID, TYPE, MESSAGE, STATUS, TRANSITION_ID, REQUEST_ID)
	      VALUES
	      (-1, 2, message, 1, transition, request_id);
 	  
 	  END IF;
      
    END$$
DELIMITER ;