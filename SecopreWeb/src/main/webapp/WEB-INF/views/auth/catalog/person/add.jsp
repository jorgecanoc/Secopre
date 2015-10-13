<%@ include file="/WEB-INF/views/auth/common/springTags.jsp"%>

			<!-- BEGIN PAGE CONTENT-->
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue" id="form_wizard_1">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-gift"></i> <spring:message code="application.pages.admin.persons.title"/> - <span class="step-title">
								Paso 1 de 3 </span>
							</div>
							<div class="tools hidden-xs">
								<a href="javascript:;" class="collapse">
								</a>
							</div>
						</div>
						<div class="portlet-body form">
							<form action="auth/cat/person/add" class="form-horizontal" id="submit_form"  modelAttribute="submit_form" method="POST"  novalidate="novalidate">
								<div class="form-wizard">
									<div class="form-body">

										<ul class="nav nav-pills nav-justified steps">
											<li>
												<a href="#tab1" data-toggle="tab" class="step">
												<span class="number">
												1 </span>
												<span class="desc">
												<i class="fa fa-check"></i> Datos Generales </span>
												</a>
											</li>
											<li>
												<a href="#tab2" data-toggle="tab" class="step">
												<span class="number">
												2 </span>
												<span class="desc">
												<i class="fa fa-check"></i>Direccion </span>
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
												<h3 class="block">Proporcionar datos personales</h3>
												<div class="form-body">													
													
													
													<div class="form-group form-md-line-input">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.name"/>
															<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="name" name="name" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.name.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.name.help"/></span>
																<i class="icon-user"></i>
															</div>
														</div>
													</div>
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.secondName"/>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input name="secondName"  id="secondName" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.secondName.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.secondName.help"/></span>
																<i class="icon-user"></i>
															</div>
														</div>
													</div>
													
													
													<div class="form-group form-md-line-input">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.fatherLastName"/> 
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input name="fatherLastName"  id="fatherLastName" type="text"  class="form-control" placeholder='<spring:message code="application.pages.admin.persons.fatherLastName.placeholder"/>'>
																<div class="form-control-focus">
																</div>																				
 																<span class="help-block"><spring:message code="application.pages.admin.persons.fatherLastName.help"/></span> 
															    <i class="fa fa-male"></i>
															</div>
														</div>
													</div>
													
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.motherLastName"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="motherLastName" name="motherLastName" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.motherLastName.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.motherLastName.help"/></span>
																<i class="fa fa-female"></i>
															</div>
														</div>
													</div>	
															
													<div class="form-group form-md-line-input has-danger">
													<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.gender"/>
										  			<span class="required">* </span> 
												    </label>
													   <div class="col-md-4">
													      <div class="input-group">
																<span class="input-group-addon"> 
																  <i class="icon-user"></i>
																</span> 
										                            <div class="md-radio-inline">
																				<div class="md-radio">
																					<input type="radio" value="MASCULINO" class="md-radiobtn" name="gender" id="gender1">
																					<label for="gender1">
																					<span></span>
																					<span class="check"></span>
																					<span class="box"></span>
																					<spring:message code="application.pages.admin.persons.gender1"/>
																					 </label>
																				</div>
																				<div class="md-radio">
																					<input type="radio" value="FEMENINO" class="md-radiobtn" name="gender" id="gender2">
																					<label for="gender2">
																					<span></span>
																					<span class="check"></span>
																					<span class="box"></span>
																					<spring:message code="application.pages.admin.persons.gender2"/>
																					</label>
																				</div>
																			</div>
																<div class="form-control-focus"></div>
												          </div>
													   </div>
												    </div>
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.telephone"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="telephone" name="telephone" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.telephone.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.telephone.help"/></span>
																<i class="fa fa-tty"></i>
															</div>
														</div>
													</div>	
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.mobileTelepone"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="mobileTelepone" name="mobileTelepone" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.mobileTelepone.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.mobileTelepone.help"/></span>
																<i class="fa fa-phone"></i>
															</div>
														</div>
													</div>
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.twitter"/>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="twitter" name="twitter" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.twitter.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.twitter.help"/></span>
																<i class="fa fa-twitter on fa-square-o"></i>
															</div>
														</div>
													</div>	
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.facebook"/>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="facebook" name="facebook" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.facebook.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.facebook.help"/></span>
																<i class="fa fa-facebook"></i>
															</div>
														</div>
													</div>	
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.webSite"/>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="webSite" name="webSite" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.webSite.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.webSite.help"/></span>
																<i class="fa fa-home"></i>
															</div>
														</div>
													</div>	 																				
											    	</div>
											</div>

						
											<div class="tab-pane" id="tab2">
												<h3 class="block">Direcci�n</h3>
												
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.street"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="street" name="street" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.street.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.street.help"/></span>
																<i class="fa fa-home"></i>
															</div>
														</div>
													</div>	
												
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.number"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="number" name="number" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.number.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.number.help"/></span>
																<i class="fa fa-home"></i>
															</div>
														</div>
													</div>	
													
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.colony"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="colony" name="colony" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.colony.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.colony.help"/></span>
																<i class="fa fa-home"></i>
															</div>
														</div>
													</div>	
													
				   								    <div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.city"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="city" name="city" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.city.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.city.help"/></span>
																<i class="fa fa-home"></i>
															</div>
														</div>
													</div>	
													
													
													
													<div class="form-group form-md-line-input has-danger">
													<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.state"/>
										  			<span class="required">* </span> 
												    </label>
													   <div class="col-md-4">
													      <div class="input-group">
																<span class="input-group-addon"> 
																  <i class="icon-user"></i>
																</span> 
																<form:select path="address.stateDTO.id"  name="pks" class="form-control">
																   <form:option value="" label="Seleccione..."/>
					    										   <form:options items="${pks}" />
																</form:select>
																<div class="form-control-focus"></div>
												          </div>
													   </div>
												    </div>
																										
													<div class="form-group form-md-line-input has-danger">
														<label class="col-md-2 control-label" for="form_control_1"><spring:message code="application.pages.admin.persons.zipCode"/>
														<span class="required">* </span>
														</label>
														<div class="col-md-10">
															<div class="input-icon">
																<input id="zipCode" name="zipCode" type="text" class="form-control" placeholder='<spring:message code="application.pages.admin.persons.zipCode.placeholder"/>'>
																<div class="form-control-focus">
																</div>
																<span class="help-block"><spring:message code="application.pages.admin.persons.zipCode.help"/></span>
																<i class="fa fa-home"></i>
															</div>
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
												<button type="button" class="btn green button-submit" id="submitRequestForm"><spring:message code="application.pages.cat.persons.crear"/></button>
						
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
