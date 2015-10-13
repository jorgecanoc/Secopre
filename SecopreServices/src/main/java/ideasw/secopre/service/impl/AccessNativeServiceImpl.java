package ideasw.secopre.service.impl;

import ideasw.secopre.dto.Authorization;
import ideasw.secopre.dto.Formality;
import ideasw.secopre.dto.Inbox;
import ideasw.secopre.dto.Movement;
import ideasw.secopre.dto.Request;
import ideasw.secopre.dto.RequestConfig;
import ideasw.secopre.dto.RequestHistory;
import ideasw.secopre.dto.WorkFlowConfig;
import ideasw.secopre.enums.Month;
import ideasw.secopre.enums.WorkFlowCode;
import ideasw.secopre.model.Entry;
import ideasw.secopre.model.ProgrammaticKey;
import ideasw.secopre.model.security.User;
import ideasw.secopre.service.AccessNativeService;
import ideasw.secopre.service.BaseService;
import ideasw.secopre.service.impl.mapper.FormalityMapper;
import ideasw.secopre.service.impl.mapper.InboxMapper;
import ideasw.secopre.service.impl.mapper.RequestConfigMapper;
import ideasw.secopre.service.impl.mapper.RequestHistoryMapper;
import ideasw.secopre.service.impl.mapper.RequestMapper;
import ideasw.secopre.service.impl.mapper.MovementMapper;
import ideasw.secopre.service.impl.mapper.WorkFlowConfigMapper;
import ideasw.secopre.sql.QueryContainer;
import ideasw.secopre.sql.SQLConstants;
import sun.util.calendar.BaseCalendar.Date;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Service;

@Service
public class AccessNativeServiceImpl extends AccessNativeServiceBaseImpl implements AccessNativeService{

	@Autowired
	QueryContainer queryContainer;

	@Autowired
	public BaseService baseService;
	
	@Override
	/*
	 * Obtiene todos los tramites disponibles que puede iniciar el usuario
	 * */
	public List<Formality> getFormalityAvailableByUser(User user) {
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("userId", user.getId());	
		return this.queryForList(Formality.class, queryContainer.getSQL(SQLConstants.GET_FORMALITY_FROM_USER_ID), namedParameters, new FormalityMapper());
	}

	/*
	 * Proceso para inicio de tramite, inserta en REQUEST, REQUEST_CONFIG, REQUEST_HISTORY
	 * */
	public Long startFormality(Request request, Long userId) {
		
		this.insertOrUpdateRequest(request);
		
		this.insertOrUpdateRequestDetail(request);

		Formality formality = this.getFormalityById(request.getFormalityId());
		this.insertRequestConfig(request.getRequestId(), formality);
		
		this.invokeNextStage(request.getRequestId(), WorkFlowCode.SOLCOMP.name() , -1L,  userId, request.getComments());
		
		return request.getRequestId();
	}
	
	/*
	 * Proceso para obtener el listado de tramites en proceso por usuario
	 * */
	public List<Inbox> getInboxByUserId(Long userId){
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("userId", userId);	
		return this.queryForList(Inbox.class, queryContainer.getSQL(SQLConstants.GET_FORMALITY_INBOX), namedParameters, new InboxMapper());
	}
	
	public List<RequestHistory> getRequestHistory(Long requestId){
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId);	
		return this.queryForList(RequestHistory.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_HISTORY), namedParameters, new RequestHistoryMapper());
	}
	
	
	public void invokeNextStage(Request request, Long userId){
		this.invokeNextStage(request.getRequestId(), request.getNextStageValueCode(), request.getStageConfigId(), userId, request.getComments());
	}
	
	public int updateRequestUploadedFile(Long requestId, String uploadedFilePath){
		SqlParameterSource namedParameters = new MapSqlParameterSource()
		.addValue("requestId", requestId)
		.addValue("uploadedFilePath", uploadedFilePath);
		return this.insertOrUpdate(queryContainer.getSQL(SQLConstants.UPDATE_UPLOADED_FILE_IN_REQUEST), namedParameters);
	}
	
	
	/*
	 * Proceso para avanzar un tramite de etapa
	 * */
	private void invokeNextStage(Long requestId, String valueCode, Long stageConfigId,  Long userId, String comments){
			
		int consecutive = this.getNextConsecutive(requestId);
	
		if(consecutive == 1){
			WorkFlowConfig transition = this.getRequestFirstWorkFlowConfig(requestId, valueCode).get(0);
			this.insertTransition(requestId, transition, consecutive, userId, comments);
		}else{
			WorkFlowConfig transition = this.getRequestWorkFlowConfig(requestId, valueCode, stageConfigId).get(0);
			this.inactivateActiveStage(requestId);
			this.insertTransition(requestId, transition, consecutive, userId, comments);
		}
	}
	
	
	/*----------------------------------------------------------------------------------------------------------
	 * 	Procesos internos del service
	 * ---------------------------------------------------------------------------------------------------------*/
	
	private List<WorkFlowConfig> getRequestFirstWorkFlowConfig(Long requestId, String wfConfigCode) {
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId).addValue("wfConfigCode", wfConfigCode);	
		return this.queryForList(WorkFlowConfig.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_FIRST_WORKFLOW_CONFIG), namedParameters, new WorkFlowConfigMapper());
	}
	
	private List<WorkFlowConfig> getRequestWorkFlowConfig(Long requestId, String wfConfigCode, Long stageConfigId) {
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId).addValue("wfConfigCode", wfConfigCode).addValue("stageConfigId", stageConfigId);	
		return this.queryForList(WorkFlowConfig.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_WORKFLOW_CONFIG), namedParameters, new WorkFlowConfigMapper());
	}
	
	private int inactivateActiveStage(Long requestId){
		SqlParameterSource params = new MapSqlParameterSource().addValue("requestId", requestId);
		return this.insertOrUpdate(queryContainer.getSQL(SQLConstants.INACTIVATE_ACTIVE_STAGE), params);
	}
	
	private int getNextConsecutive(Long requestId){
		SqlParameterSource params = new MapSqlParameterSource().addValue("requestId", requestId);
		return this.queryForObject(Integer.class, queryContainer.getSQL(SQLConstants.GET_NEXT_CONSECUTIVE), params);
	}
	
	public Long getRequestNextConsecutive(){
		SqlParameterSource params = new MapSqlParameterSource();
		return this.queryForObject(Long.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_NEXT_CONSECUTIVE), params);
	}
	
	private int canUserAuthorize(Long authorizationId, Long stageConfigId, Long userId){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("authorizationId", authorizationId)
				.addValue("stageConfigId", stageConfigId)
				.addValue("userId", userId);
		return this.queryForObject(Integer.class, queryContainer.getSQL(SQLConstants.CAN_USER_AUTHORIZE), params);
	}
	
	private int isAuthorizationSuperUser(Long authorizationId, Long userId){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("authorizationId", authorizationId)
				.addValue("userId", userId);
		return this.queryForObject(Integer.class, queryContainer.getSQL(SQLConstants.IS_USER_AUTHORIZATION_SUPERUSER), params);
	}
	
	private int hasMoreSignatures(Long requestId, Long stageConfigId){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("requestId", requestId)
				.addValue("stageConfigId", stageConfigId);
		return this.queryForObject(Integer.class, queryContainer.getSQL(SQLConstants.HAS_MORE_SIGNATURES), params);
	}
	
	
	private int insertRequestConfig(Long requestId, Formality formality){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("requestId", requestId)
				.addValue("formalityId", formality.getFormalityId())
				.addValue("workFlowId", formality.getWorkFlowId())
				.addValue("authorizationId", formality.getAuthorizationId());
		
		return this.insertOrUpdate(queryContainer.getSQL(SQLConstants.INSERT_REQUEST_CONFIG), params);
	}
	
	private Formality getFormalityById(Long formalityId){		
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("formalityId", formalityId);
		List<Formality> list = this.queryForList(Formality.class, queryContainer.getSQL(SQLConstants.GET_FORMALITY_BY_ID), namedParameters, new FormalityMapper());
		return list.get(0);
	}
	

	private Long insertRequest(Request request){
		return this.insertAndReturnId(Request.TABLE_NAME, Request.PRIMARY_KEY, request.getParams());
	}
	
	private int insertOrUpdateRequest(Request request){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("requestId", request.getRequestId())
				.addValue("folio", request.getFolio())
				.addValue("districtId", request.getDistrictId())
				.addValue("justification", request.getJustification())
				.addValue("movementTypeId", request.getMovementTypeId())
				.addValue("resourcePath", request.getResourcePath());
		return this.insertOrUpdate(queryContainer.getSQL(SQLConstants.INSERT_OR_UPDATE_REQUEST), params);
	}
	
	public int insertOrUpdateRequestDetail(Request request){

		Request baseRequest = this.getRequestById(request.getRequestId());
		baseRequest.setMovementTypeId(request.getMovementTypeId());
		
		this.insertOrUpdateRequest(baseRequest);
		
		int clean = this.cleanRequestDetail(request.getRequestId());
		
		this.insertMovementList(request.getUpMovements(), request.getRequestId());
		this.insertMovementList(request.getDownMovements(), request.getRequestId());
		
		return 0;
	}

	private int cleanRequestDetail(Long requestId){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("requestId", requestId);
		return this.insertOrUpdate(queryContainer.getSQL(SQLConstants.CLEAN_REQUEST_DETAIL), params);
	}
	private void insertMovementList(List<Movement> list, Long requestId){
				
		for(Movement m : list){
			
			//si no es un elemento eliminado
			if(m.getRemovedElement() == 0){
				//inserta de nuevo el registro
				Long id =  this.insertAndReturnId(Movement.TABLE_NAME, Movement.PRIMARY_KEY, m.getParams(requestId));
				m.setRequestDetailId(id);
			}
		}
	}
	
	private int insertTransition(Long requestId, WorkFlowConfig config, int consecutive, Long userId, String comments){
		SqlParameterSource params = new MapSqlParameterSource()
				.addValue("requestId", requestId)
				.addValue("consecutive", consecutive)
				.addValue("workFlowConfigId",config.getWorkFlowConfigId())
				.addValue("userId", userId)
				.addValue("comments", comments);
		
		return this.insertOrUpdate(queryContainer.getSQL(SQLConstants.INSERT_REQUEST_HISTORY), params);
	}

	@Override
	public Request getRequestById(Long requestId) {
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId);
		List<Request> list = this.queryForList(Request.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_BY_ID), namedParameters, new RequestMapper());
		Request r =  list.get(0);
		return r;
	}
	
	public Request getRequestAndDetailById(Long requestId) {
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId);
		List<Request> list = this.queryForList(Request.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_BY_ID), namedParameters, new RequestMapper());
		Request r =  list.get(0);
		r.setMovements(this.getRequestDetailByRequestId(requestId));
		return r;
	}

	public List<Movement> getRequestDetailByRequestId(Long requestId){
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId);
		List<Movement> list = this.queryForList(Movement.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_DETAIL), namedParameters, new MovementMapper());	
		return list;
	}
	
	public RequestConfig getRequestConfigById(Long requestId){
		SqlParameterSource namedParameters = new MapSqlParameterSource().addValue("requestId", requestId);
		List<RequestConfig> list = this.queryForList(RequestConfig.class, queryContainer.getSQL(SQLConstants.GET_REQUEST_CONFIG_BY_ID), namedParameters, new RequestConfigMapper());
		return list.get(0);
	}


	@Override
	public Authorization getAuthorization(Request request, User user) {
		Authorization authorization = new Authorization();
		//se obtiene el requestConfig y se agrega codigo a authorizacion
		RequestConfig config = this.getRequestConfigById(request.getRequestId());
		Formality formality = this.getFormalityById(config.getFormalityId());
		
		authorization.setFormalityCode(formality.getCode());
		
		//se valida si el usuario puede autorizar la etapa
		authorization.setCanUserAuthorize((this.canUserAuthorize(formality.getAuthorizationId(), request.getStageConfigId(), user.getId())) > 0);
		
		//se valida si el usuario tiene el rol de superusuario configurado para el grupo de authorizacion
		authorization.setSuperUser(this.isAuthorizationSuperUser(formality.getAuthorizationId(), user.getId()) > 0);
		
		//se valida si la etapa tiene mas firmas o es la ultima firma
		authorization.setMoreSignatures(this.hasMoreSignatures(request.getRequestId(), request.getStageConfigId()) > 0);
		
		return authorization;
	}

	@Override
	public Map<Long, String> getProgramaticKeysMap() {
		int year = Calendar.getInstance().get(Calendar.YEAR);
		List<ProgrammaticKey> l = baseService.findByProperty(ProgrammaticKey.class, "year", year);
		Map<Long, String> map = new HashMap<Long, String>();
		for(ProgrammaticKey k : l){
			map.put(k.getId(), k.getCode());
		}
		return map;
	}

	@Override
	public List<Entry> getEntries(Long programaticKey) {
		List<Entry> l = new ArrayList<Entry>();
		l = baseService.findByProperty(Entry.class, "programmaticKey", baseService.findById(ProgrammaticKey.class, programaticKey));
		return l;
	}

	@Override
	public Map<Long, String> getEntriesMap(Long programaticKey) {
		List<Entry> l = new ArrayList<Entry>();
		if(programaticKey.longValue() > 0){
			l = baseService.findByProperty(Entry.class, "programmaticKey", baseService.findById(ProgrammaticKey.class, programaticKey));
		}else{
			l = baseService.findAll(Entry.class);
		}
		Map<Long, String> map = new HashMap<Long, String>();
		for (Entry e : l){
			map.put(e.getId(), e.getName());
		}
		return map;
	}

	@Override
	public Map<Long, String> getMonthsMap() {
		Map<Long, String> map = new HashMap<Long, String>();
		for (Month mes : Month.values()){
			map.put(mes.getId(), mes.name());
		}
		return map;
	}

}
