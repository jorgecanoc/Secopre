<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!-- captura de clave de partida -->
<div class="form-group form-md-line-input">
	<label class="col-md-2 control-label" for="formalityId">Cuenta por liquidar Certificada:</label>
	<div class="col-md-4">
			<form:input path="certifiedAccount" id="certifiedAccountId" class="form-control"></form:input>
			<div class="form-control-focus"></div>
			<span class="help-block">
				<spring:message code="application.pages.tramite.add.selectFormality"/>
			</span>
	</div>
</div>

<!-- grid de movimientos de disminucion -->
<div class="portlet box green" id="substractComponent">
	<div class="portlet-title">
		<div class="caption">
			<i class="fa fa-cogs"></i>Gastos
		</div>
		<div class="actions">
			<a href="javascript:;" class="btn green btn-sm" id="addMov"><i class="fa fa-plus"></i>Agregar Gasto </a>
		</div>
	</div>
	<div class="portlet-body">
		<div class="table-responsive">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>Llave Programatica</th>
						<th>Partida</th>
						<th>Rango meses</th>
						<th></th>
						<th>Monto Mensual</th>
					</tr>
				</thead>
				<tbody>
				
					<c:choose>
					    <c:when test="${empty requestForm.downMovements}">
					       <tr id="noMovs">
					       		<td colspan="6">No hay Registros Capturados</td>
					       <tr>
					    </c:when>
					    <c:otherwise>
					        <c:forEach items="${requestForm.downMovements}" var="mov" varStatus="i">
								<tr data-name="rowContainer" id="row${i.index}" data-rowNumber="${i.index}">
									
									<td data-name="deleteAction" class="buttonColumn">
  										<a href="javascript:;" class="btn default btn-xs red" id="rmvIdx${i.index}"><i class="fa fa-times"></i></a>
  										<a href="javascript:;" class="btn grey-cascade btn-xs default lastButton" id="infoIdx${i.index}"><i class="fa fa-info-circle"></i></a>
									</td>
									
									<td data-name="programaticKey">
										<form:select path="downMovements[${i.index}].programaticKeyId" class="form-control input-small">
											<form:option value="-1" label="Seleccione..."/>
						    				<form:options items="${programaticKeys}" />
										</form:select>
									</td>
									<td data-name="entry">
										<form:select path="downMovements[${i.index}].entryId" class="form-control input-medium">
											<form:option value="-1" label="Seleccione..."/>
						    				<form:options items="${entries}" />
										</form:select>
									</td>
									<td data-name="sliderControl">
										<div class="input-small" style="padding-top:8px;">
											<div id="downSliderControl${i.index}"></div>
										</div>
									</td>
									<td data-name="monthLabels">
										<div class="input-xsmall" style="padding-top:2px;">
											<span id="downMovements${i.index}.lower-offset"></span>-<span id="downMovements${i.index}.upper-offset"></span>
										</div>
									<td data-name="monthAmount">
										<form:input path="downMovements[${i.index}].monthAmount" class="form-control input-small numbersOnly"/>
									</td>
					
									<form:hidden path="downMovements[${i.index}].initialMonthId" class="form-control" data-name="initialMonthId"/>
									<form:hidden path="downMovements[${i.index}].totalAmount" class="form-control" data-name="totalAmount"/>
									<form:hidden path="downMovements[${i.index}].finalMonthId" class="form-control" data-name="finalMonthId"/>
									<form:hidden path="downMovements[${i.index}].removedElement" class="form-control" data-name="removedElement"/>
									<form:hidden path="downMovements[${i.index}].movementTypeId" class="form-control" data-name="movementTypeId"/>
									<form:hidden path="downMovements[${i.index}].requestDetailId" class="form-control" data-name="requestDetailId"/>
								</tr>
							</c:forEach>
					    </c:otherwise>
					</c:choose> 
				</tbody>
			</table>
		</div>
		<div>
			<div class="text-rigth">
				<div class="btn">Total:</div>
				<a href="#myModal1" role="button" class="btn green" data-toggle="modal" id="downMovementsTotal">0.00</a>
			</div>
		</div>
	</div>
</div>

<!-- row template para agregar registros -->
<template id="movementRowTemplate">
	<tr data-name="rowContainer">
	
		<td data-name="deleteAction" class="buttonColumn">
  			<a href="javascript:;" class="btn default btn-xs red" id="rowDeleteButton"><i class="fa fa-times"></i></a>
  			<a href="javascript:;" class="btn grey-cascade btn-xs default lastButton" id="rowInfoButton"><i class="fa fa-info-circle"></i></a>
		</td>
		
		
		
		<td data-name="programaticKey">
			<form:select path="upMovements" class="form-control input-small">
				<form:option value="-1" label="Seleccione..."/>
	  			<form:options items="${programaticKeys}" />
			</form:select>
		</td>
		<td data-name="entry">
			<form:select path="upMovements" class="form-control input-medium">
				<form:option value="-1" label="Seleccione..."/>
	  			<form:options items="${entries}" />
			</form:select>
		</td>
		<td data-name="sliderControl">
			<div class="input-small" style="padding-top:8px;">
				<div id="sliderControl"></div>
			</div>
		</td>
		<td data-name="monthLabels">
			<div class="input-xsmall" style="padding-top:2px;">
				<span data-name="lower-offset"></span>-<span data-name="upper-offset"></span>
			</div>
		<td data-name="monthAmount">
			<form:input path="upMovements" class="form-control input-small numbersOnly"/>
		</td>
		<form:hidden path="upMovements" class="form-control" data-name="initialMonthId"/>
		<form:hidden path="upMovements" class="form-control" data-name="finalMonthId"/>
		<form:hidden path="upMovements" class="form-control" data-name="removedElement"/>
		<form:hidden path="upMovements" class="form-control" data-name="movementTypeId"/>
		<form:hidden path="upMovements" class="form-control" data-name="requestDetailId"/>
		<form:hidden path="upMovements" class="form-control" data-name="totalAmount"/>
	</tr>
</template>