	<%@ include file="/WEB-INF/views/auth/common/springTags.jsp"%>

<!-- BEGIN PAGE CONTENT-->
<div class="row">
	<div class="col-md-12">
		<div class="portlet box blue" id="form_wizard_1">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-gift"></i>
					<spring:message code="application.pages.admin.roles.title" />
					 <span class="step-title"> Paso 1 de 3 </span>
				</div>
				<div class="tools hidden-xs">
					<a href="javascript:;" class="collapse"> </a>
				</div>
			</div>
			<div class="portlet-body form">
				<form action="auth/adm/role/add?id=${role.id}" class="form-horizontal" id="submit_form"
					method="POST" novalidate="novalidate">
					<div class="form-wizard">
						<div class="form-body">
							<ul class="nav nav-pills nav-justified steps">
								<li><a href="#tab1" data-toggle="tab" class="step"> <span
										class="number"> 1 </span> <span class="desc"> <i
											class="fa fa-check"></i> Captura de Roles
									</span>
								</a></li>
														
								<li><a href="#tab2" data-toggle="tab" class="step active">
										<span class="number"> 2 </span> <span class="desc"> <i
											class="fa fa-check"></i>Permisos
									</span>
								</a></li>
								
								<li><a href="#tab3" data-toggle="tab" class="step"> <span
										class="number"> 3 </span> <span class="desc"> <i
											class="fa fa-check"></i> Confirmación
									</span>
								</a></li>
								

							</ul>
							<div id="bar" class="progress progress-striped"
								role="progressbar">
								<div class="progress-bar progress-bar-success"></div>
							</div>
							<div class="tab-content">
								<!-- Se incluyen los DIV de alertamiento en formularios -->
								<%@ include file="/WEB-INF/views/auth/common/alertForm.jsp"%>

								<div class="tab-pane active" id="tab1">
									<h3 class="block">Proporcionar datos del Rol</h3>
									<div class="form-body">
									
							        <div class="form-group form-md-line-input has-danger">
									   <label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.roles.name"/>
									   <span class="required">* </span>
									   </label>
									   <div class="col-md-10">
									      <div class="input-icon">
										     <input id="name" name="name" type="text" class="form-control"  value="${role.name}"   placeholder='<spring:message code="application.pages.admin.roles.name.placeholder"/>'>
											    <div class="form-control-focus">
												</div>
												<span id="name-error" class="help-block help-block-error"> <spring:message code="application.pages.admin.roles.name.help"/>  </span>															
 												<i class="icon-user"></i> 
											 </div>
									     </div>
									</div>	
									
									
									<div class="form-group form-md-line-input has-danger">
									   <label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.roles.rolename"/>
									   <span class="required">* </span>
									   </label>
									   <div class="col-md-10">
									      <div class="input-icon">
										     <input id="rolename" name="rolename" type="text" class="form-control"  value="${role.rolename}"   placeholder='<spring:message code="application.pages.admin.roles.rolename.placeholder"/>'>
											    <div class="form-control-focus">
												</div>
												<span id="rolename-error" class="help-block help-block-error"> <spring:message code="application.pages.admin.roles.rolename.help"/>  </span>															
 												<i class="icon-user"></i> 
											 </div>
									     </div>
									</div>	
									
		
									
									<div class="form-group form-md-line-input has-danger">
									   <label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.roles.description"/>
									   <span class="required">* </span>
									   </label>
									   <div class="col-md-10">
									      <div class="input-icon">
										     <input id="description" name="description" type="text" class="form-control"  value="${role.description}"   placeholder='<spring:message code="application.pages.admin.roles.description.placeholder"/>'>
											    <div class="form-control-focus">
												</div>
												<span id="description-error" class="help-block help-block-error"> <spring:message code="application.pages.admin.roles.description.help"/>  </span>															
 												<i class="icon-user"></i> 
											 </div>
									     </div>
									</div>	
									
									
																	
									</div>
								</div>
								
								<div class="tab-pane" id="tab2">
									<h3 class="block">Seleccione los Permisos</h3>
									<div class="form-group">
										<label class="control-label col-md-3">Permisos<span
											class="required"> * </span>
										</label>
										<div class="col-md-4">
											<select multiple="multiple" class="multi-select" id="perms" name="perms" style="position: absolute" >
												<c:forEach items="${perms}" var="permission">
													<option value="${permission.id}">${permission.name} </option>
												</c:forEach>
											</select>											
										</div>
									</div>
									<div class="form-group">&nbsp;</div>
									
									<div class="row">
															<div class="col-md-offset-3 col-md-9">		
														    <a href="#" id='select-all' class="btn select">
															<i class="m-icon-swapright"></i> Agregar Todos </a>
															
															<a href="#" id='deselect-all' class="btn select">
															<i class="m-icon-swapleft"></i> Quitar Todos </a>
													        </div>
									</div>	
								</div>	
								
							  
									  

								<div class="tab-pane" id="tab3">
									<h3 class="block">Confirmación</h3>
									<h4 class="form-section">Rol</h4>
									<div class="form-group">
										<label class="control-label col-md-3"><spring:message
													code="application.pages.admin.roles.rolename" /></label>
										<div class="col-md-4">
											<p class="form-control-static" data-display="rolename"></p>
										</div>

									</div>	
									
									<div class="form-group">
										<label class="control-label col-md-3"><spring:message
													code="application.pages.admin.roles.name" /></label>
										<div class="col-md-4">
											<p class="form-control-static" data-display="name"></p>
										</div>

									</div>	
									
									
									<div class="form-group">
										<label class="control-label col-md-3"><spring:message
													code="application.pages.admin.roles.description" /></label>
										<div class="col-md-4">
											<p class="form-control-static" data-display=description></p>
										</div>

									</div>	
									
									<h4 class="form-section">Permisos</h4>
									<div class="form-group">
										<label class="control-label col-md-3">Permisos:</label>
										<div class="col-md-4">
											<p class="form-control-static" data-display="perms"></p>
										</div>
									</div>
									
								</div>
							</div>
						</div>
						<div class="form-actions">
							<div class="row">
								<div class="col-md-offset-3 col-md-9">

										      <c:choose>
											     <c:when test="${role.id!=null}">
											        <a href="javascript:initRoleList();" class="btn red" >
													   <spring:message code="application.cancel"/> <i class="fa fa-times"></i>
													   </a>  
												 </c:when>   
									             <c:otherwise>		
											           <a href="javascript:showList('Role');" class="btn red" >
													   <spring:message code="application.cancel"/> <i class="fa fa-times"></i>
													   </a>  	
									             </c:otherwise>
									          </c:choose>
									<a href="javascript:;" class="btn default button-previous">
										<i class="m-icon-swapleft"></i> <spring:message code="application.back"/>
									</a> <a href="javascript:;" class="btn blue button-next">
										<spring:message code="application.next"/> <i class="m-icon-swapright m-icon-white"></i>
									</a> 
									<button type="button" class="btn green button-submit" id="submitRequestForm"><spring:message code="application.pages.admin.roles.crear"/></button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<!-- END PAGE CONTENT-->
	

