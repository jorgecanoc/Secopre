	<%@ include file="/WEB-INF/views/auth/common/springTags.jsp"%>
			
			<div class="row" style="display: inline;">
				<div class="col-md-12">
					<!-- BEGIN SAMPLE FORM PORTLET-->
					<div class="portlet light">
						<div class="portlet-title">
							<div class="caption font-green-haze">
								<i class="icon-settings font-green-haze"></i>
								<span class="caption-subject bold uppercase">Estatus de sus Tr�mites</span>
							</div>
							<div class="actions">
								<a class="btn btn-circle btn-icon-only btn-default fullscreen" href="javascript:;" data-original-title="" title="">
								</a>
							</div>
						</div>
						
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="row">
									<div class="col-md-6">
									</div>
									<div class="col-md-6">
										<div class="btn-group pull-right">
											<button class="btn dropdown-toggle" data-toggle="dropdown"><spring:message code="application.tools"/><i class="fa fa-angle-down"></i>
											</button>
											<ul class="dropdown-menu pull-right">
												<li>
													<a href="javascript:;"><spring:message code="application.export.excel"/></a>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="row" style="margin-top:10px;">
									<div class="col-md-12">
										<div class="btn-group">
											<input type="text" id="formalityDateSearch" placeholder="Buscar..." class="form-control input-medium">
										</div>
									</div>
								</div>
							</div>
						<div>	
					
							<table class="table table-striped table-bordered table-hover" id="formalityList">
							<thead>
							<tr>
								<th style="visible:false;">id</th>
								<th>Solicitud</th>
								<th>Justificaci�n</th>
								<th>Distrito</th>
								<th>Tr�mite</th>
								<th>Importe</th>
								<th>Fecha Creaci�n</th>
								<th>Siguiente Etapa</th>
								<th>Opciones</th>
							</tr>
							</thead>
							<tbody>
								<c:forEach items="${inboxList}" var="inboxItem">
									<tr class="odd gradeX">
										<td style="visible:false;">${inboxItem.requestId}</td>
										<td>${inboxItem.folio}</td>
										<td>${inboxItem.justification}</td>
										<td>${inboxItem.districtDescription}</td>
										<td>${inboxItem.formalityDescription}</td>
										<td>${inboxItem.totalAmountStr}</td>
										<td>${inboxItem.creationDateStr}</td>
										<td>${inboxItem.nextDescription}</td>
										<td>
											<c:if test="${inboxItem.isOperated == true}">
												<a href="#" onclick="openResourceNative('wf/download/format/${inboxItem.requestId}','dashboard','()','GET');">
													Descargar Formato
												</a>
											</c:if>
										</td>
									</tr>							
								</c:forEach>
							</tbody>
							</table>
						</div>
					</div>
					<!-- END SAMPLE FORM PORTLET-->
				</div>
			</div>
