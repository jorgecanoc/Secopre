<%@ include file="/WEB-INF/views/auth/common/springTags.jsp"%>

			<!-- BEGIN PAGE CONTENT INNER -->
			<div class="row">
				<div class="col-md-12">
					<!-- BEGIN EXAMPLE TABLE PORTLET-->
					<div class="portlet box grey-cascade">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-globe"></i><spring:message code="application.pages.catalog.position.table.title"/>
							</div>
							<div class="tools">
								<a href="javascript:;" class="collapse">
								</a>
								<a href="javascript:;" class="reload">
								</a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="row">
									<div class="col-md-6">
										<div class="btn-group">
											<button id="sample_editable_1_new" class="btn green">
											<spring:message code="application.add"/> <i class="fa fa-plus"></i>
											</button>
										</div>
									</div>
									<div class="col-md-6">
										<div class="btn-group pull-right">
											<button class="btn dropdown-toggle" data-toggle="dropdown"><spring:message code="application.tools"/><i class="fa fa-angle-down"></i>
											</button>
											<ul class="dropdown-menu pull-right">
												<li>
													<a href="javascript:;"><spring:message code="application.print"/></a>
												</li>
												<li>
													<a href="javascript:;"><spring:message code="application.export.pdf"/></a>
												</li>
												<li>
													<a href="javascript:;"><spring:message code="application.export.excel"/></a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<table class="table table-striped table-bordered table-hover" id="PositionTable">
							<thead>
							<tr>
								<th class="table-checkbox">
									<input type="checkbox" class="group-checkable" data-set="#positionTable .checkboxes"/>
								</th>
								<th><spring:message code="application.pages.catalog.position.name"/></th>
								<th><spring:message code="application.pages.catalog.position.description"/></th>
								<th><spring:message code="application.active"/></th>
								<th><spring:message code="application.actions"/></th>
							</tr>
							</thead>
							<tbody>
							<c:forEach items="${positionList}" var="positionItem">
								<tr class="odd gradeX">
									<td>
										<input type="checkbox" class="checkboxes" value="1"/>
									</td>
									<td>${positionItem.name}</td>
									<td>
										 ${positionItem.description}
									</td>
									<td>
										 ${positionItem.activo}
									</td>
									<td>
<%-- 										<a href="#" onclick="sendRequestJQ('auth/cat/position/edit?id=${positionItem.id}' ,'dashboard','editPositionCat()');"> --%>
<%-- 												<span class="label label-sm label-success"> <spring:message code="application.edit"/> </span> --%>
<!-- 										</a> -->
										
										<button id="btn_edit"  type="button" class="btn edit-xs btn-success btn-xs" onclick="sendRequestJQ('auth/cat/position/edit?id=${positionItem.id}' ,'dashboard','editPositionCat()');">
										 <i class="fa fa-edit xs"></i>
										</button>
										
										<button id="btndelete"  type="button" class="btn delete btn-danger btn-xs" onclick="borrarRegistro('auth/cat/position/delete?id=${positionItem.id}','dashboard','initPositionList()');"   >
										<i class="fa fa-trash"></i> 
										</button>
										
<%-- 										<a href="#" class="btn delete" onclick="sendRequestJQ('auth/cat/position/delete?id=${positionItem.id}' ,'dashboard','initPositionList()');"> --%>
<%-- 												<span class="label label-xs label-danger"> <spring:message code="application.delete"/> </span> --%>
												
<!-- 										</a> -->
										
									</td>
								</tr>							
							</c:forEach>
							</tbody>
							</table>
						</div>
					</div>
					<!-- END EXAMPLE TABLE PORTLET-->
				</div>
			</div>