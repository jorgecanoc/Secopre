<%@ include file="/WEB-INF/views/auth/common/springTags.jsp"%>

			<!-- BEGIN PAGE CONTENT-->
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue" id="form_wizard_1">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-gift"></i> <spring:message code="application.pages.param.dueDate.title"/> - <span class="step-title">
								Paso 1 de 2 </span>
							</div>
							<div class="tools hidden-xs">
								<a href="javascript:;" class="collapse">
								</a>
							</div>
						</div>
						<div class="portlet-body form">
							<form action="auth/param/dueDate/add?id=${dueDate.id}" class="form-horizontal" id="submit_form"  modelAttribute="submit_form" method="POST"  novalidate="novalidate">
								<div class="form-wizard">
									<div class="form-body">

										<ul class="nav nav-pills nav-justified steps">
											<li>
												<a href="#tab1" data-toggle="tab" class="step">
												<span class="number">
												1 </span>
												<span class="desc">
												<i class="fa fa-check"></i> Captura de Fecha de Corte </span>
												</a>
											</li>
											<li>
												<a href="#tab2" data-toggle="tab" class="step">
												<span class="number">
												2 </span>
												<span class="desc">
												<i class="fa fa-check"></i>Confirmaci�n </span>
												</a>
											</li>
											
										</ul>
										
										<div id="bar" class="progress progress-striped" role="progressbar">
											<div class="progress-bar progress-bar-success">
											</div>
										</div>
									
										<div class="tab-content">
										<!-- Se incluyen los DIV de alertamiento en formularios -->
											<%@ include file="/WEB-INF/views/auth/common/alertForm.jsp"%>

											<div class="tab-pane active" id="tab1">
												<h3 class="block">Proporcionar Informaci�n de Fecha de Corte</h3>
												<div class="form-body">													
																									
													<div class="form-group form-md">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.param.dueDate.dueDate"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-4">
<!-- 															<div class="input-icon"> -->
                                                                <div data-date-format="dd/mm/yyyy" class="input-group date date-picker">
																 <div class="input-group-addon">
															        <span class="fa fa-calendar"></span>
															    </div>
																<input name="dueDateStr"  id="dueDateStr"  type="text" value="${dueDate.dueDateStr}" class="form-control">
																<div class="form-control-focus">
																</div>
																</div>
																<span id="datepicker-error" class="help-block help-block-error"></span>
																<span class="help-block">
																<spring:message code="application.pages.param.dueDate.dueDate.help"/>
																</span>														
														</div>
													</div>	
																	
													<div class="form-group form-md">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.param.dueDate.maxBlockDate"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-4">
<!-- 															<div class="input-icon"> -->
                                                                <div data-date-format="dd/mm/yyyy" class="input-group date date-picker">
																 <div class="input-group-addon">
															        <span class="fa fa-calendar"></span>
															    </div>
																<input name="maxBlockDateStr"  id="maxBlockDateStr"  type="text" value="${dueDate.maxBlockDateStr}" class="form-control">
																<div class="form-control-focus">
																</div>
																</div>
																<span id="datepicker-error" class="help-block help-block-error"></span>
																<span class="help-block">
																<spring:message code="application.pages.param.dueDate.maxBlockDate.help"/>
																</span>														
														</div>
													</div>																				       																				
										        </div>
											</div>

						
											<div class="tab-pane" id="tab2">
												<h3 class="block">Confirmaci�n</h3>
	
												
									            <h4 class="form-section">Fecha de Corte</h4>
									            <div class="form-group">
										            <label class="control-label col-md-3"><spring:message
													code="application.pages.param.dueDate.dueDate" />
													</label>
										            <div class="col-md-4">
											           <p class="form-control-static" data-display="dueDateStr"></p>
										            </div>
									            </div>
									            <div class="form-group">
										           <label class="control-label col-md-3"><spring:message
													  code="application.pages.param.dueDate.maxBlockDate" />
											       </label>
										           <div class="col-md-4">
											         <p class="form-control-static" data-display="maxBlockDateStr"></p>
										           </div>
									            </div>							
													
																								
											</div>
										</div>
									</div>
									<div class="form-actions">
										<div class="row">
											<div class="col-md-offset-3 col-md-9">
												<a href="javascript:;" class="btn default button-previous">
												<i class="m-icon-swapleft"></i> <spring:message code="application.back"/> </a>
												<a href="javascript:;" class="btn blue button-next">
												<spring:message code="application.next"/> <i class="m-icon-swapright m-icon-white"></i>
												</a>
												<button type="button" class="btn green button-submit" id="submitRequestForm"><spring:message code="application.pages.param.dueDate.crear"/></button>
						
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