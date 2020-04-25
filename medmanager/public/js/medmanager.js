var dialogo;

var clientes = null;
var empresas = null;
var unidades = null;

$( document ).ready(function() {
});




class Contexto {
	constructor(empresa, etiquetaEmpresa, area, etiquetaArea, cliente, etiquetaCliente, unidadMedica, etiquetaUnidadMedica) {
		this.Empresa = empresa;
		this.EtiquetaEmpresa = etiquetaEmpresa;
		this.Area = area;
		this.EtiquetaArea = etiquetaArea;
		this.Cliente = cliente;
		this.EtiquetaCliente = etiquetaCliente;
		this.UnidadMedica = unidadMedica;
		this.EtiquetaUnidadMedica = etiquetaUnidadMedica;
		this.TipoRelacion = null;
	};

	EsValido(nivel) {
		if(nivel==null)
		{
			nivel == currentNivel;
		}

		if(nivel==null)
		{
			return false;
		}

		var empresaValida = IsNotEmpty(this.Empresa);

		if(nivel=="EMPRESA")
		{
			if(empresaValida)
			{
				return true;
			}
		}

		var areaValida = IsNotEmpty(this.Area);

		if(nivel=="AREA")
		{
			if(empresaValida && areaValida)
			{
				return true;
			}
		}

		var clienteValido = IsNotEmpty(this.Cliente);

		if(nivel=="CLIENTE")
		{
			if(empresaValida && areaValida && clienteValido)
			{
				return true;
			}
		}

		var unidadMedicaValida = IsNotEmpty(this.UnidadMedica);

		if(nivel=="UNIDAD_MEDICA")
		{
			if(empresaValida && areaValida && clienteValido && unidadMedicaValida)
			{
				return true;
			}
		}

		return false;
	}

	GetString(nivel) {
		var cadena = '';

		var empresaValida = IsNotEmpty(this.Empresa);
		var areaValida = IsNotEmpty(this.Area);
		var clienteValido = IsNotEmpty(this.Cliente);
		var unidadMedicaValida = IsNotEmpty(this.UnidadMedica);

		if(nivel==null || nivel==='') {
			if(empresaValida) {
				cadena += this.Empresa + " - " + this.EtiquetaEmpresa;
			}

			if(areaValida) {
				cadena += " » " + this.EtiquetaArea;
			}

			if(clienteValido) {
				cadena += " » " + this.Cliente + " - " + this.EtiquetaCliente;
			}

			if(unidadMedicaValida) {
				cadena += " » " + this.UnidadMedica + " - " + this.EtiquetaUnidadMedica;
			}
		}
		else {
			switch (nivel) {
				case "EMPRESA":
					if(empresaValida) {
						cadena += this.Empresa + " - " + this.EtiquetaEmpresa;
					}
					break;
				case "AREA":
					if(empresaValida && areaValida)
					{
						cadena = this.Empresa + " - " + this.EtiquetaEmpresa + " » " + this.EtiquetaArea;
					}
					break;
				case "CLIENTE":
					if(empresaValida && areaValida && clienteValido)
					{
						cadena = this.Empresa + " - " + this.EtiquetaEmpresa + " » " + this.EtiquetaArea + " » " + this.Cliente + " - " + this.EtiquetaCliente;
					}
					break;
				case "UNIDAD_MEDICA":
					if(empresaValida && areaValida && clienteValido && unidadMedicaValida)
					{
						cadena = this.Empresa + " - " + this.EtiquetaEmpresa + " » " + this.EtiquetaArea + " » " + this.Cliente + " - " + this.EtiquetaCliente + " » " + this.UnidadMedica + " - " + this.EtiquetaUnidadMedica;
					}
					break;
			}
		}

		return cadena;
	}
}

async function getContexto()
{
	return cargaRelacionUsuario().then(function(resp){
		if(resp==null)
		{
			return null;
		}

		if(resp.message==null)
		{
			return null;
		}

		var relacion = resp.message;

		var obj = localStorage.getItem('Contexto');

		if(!(obj == null) && (obj!==''))
		{
			var parsedObj = JSON.parse(obj);
	
			if(!(parsedObj == null))
			{
				var contexto = new Contexto(
						parsedObj.Empresa,
						parsedObj.EtiquetaEmpresa,
						parsedObj.Area,
						parsedObj.EtiquetaArea,
						parsedObj.Cliente,
						parsedObj.EtiquetaCliente,
						parsedObj.UnidadMedica,
						parsedObj.EtiquetaUnidadMedica
					);

				contexto.TipoRelacion = relacion.tipo_relacion;

				return contexto;
			}
		}

		return null;
	});		
}

function clearContexto()
{
	localStorage.setItem('Contexto', null);
}

function setContexto(contexto)
{
	if(contexto == null)
	{
		return false;
	}

	if(contexto instanceof Contexto)
	{
		localStorage.setItem('Contexto', JSON.stringify(contexto));
		return true;
	}

	try{
		var parsedObj = JSON.parse(contexto);

		var obj = new Contexto(
			parsedObj.Empresa,
			parsedObj.EtiquetaEmpresa,
			parsedObj.Area,
			parsedObj.EtiquetaArea,
			parsedObj.Cliente,
			parsedObj.EtiquetaCliente,
			parsedObj.UnidadMedica,
			parsedObj.EtiquetaUnidadMedica
		);

		localStorage.setItem('Contexto', JSON.stringify(obj));
		
		return true;
	} catch(err)
	{
		console.log(err);
	}

	return false;
}


function ValidaRFC(cadena)
{
	var rfcValido = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/.test(cadena);

	return rfcValido;
}


async function CargaEmpresas()
{
	return await frappe.call({
		method:'frappe.client.get_list',
		args: {
			doctype: 'Empresa',
			filters: {
				'activo': 1,
			},
			fields: [
				"name",
				"abreviacion"
			],
		}
	});
}

async function CargaClientes(empresa)
{
	empresa = obtieneIdentificador(empresa);

	return await frappe.call({
		method:'frappe.client.get_list',
		args: {
			doctype: 'Cliente',
			filters: {
				'activo': 1,
				'empresa': empresa
			},
			fields: [
				"name",
				"abreviacion"
			],	
		}
	});
}


async function CargaUnidades(empresa, cliente)
{
	cliente = obtieneIdentificador(cliente);	
	//unidad_medica
	return await frappe.call({
		method:'frappe.client.get_list',
		args: {
			doctype: 'Unidad Medica',
			filters: {
				'activo': 1,
				'empresa': empresa,
				'cliente': cliente
			},
			fields: [
				"name",
				"nombre"
			],	
		}
	});
}

var currentNivel = null;
var currentListView = null;
var currentDocTypeNameLst = null;
var currentDocTypeNameFrm = null;
var strCampoEmpresa = 'abreviacion';
var strCampoCliente = 'abreviacion';
var strCampoUnidadMedica = 'nombre';

function cambiaRelacionUsuarioListView(listView, currentDocTypeNameLst, currentNivel)
{
    clearContexto();

    estableceContextoListView(listView, currentDocTypeNameLst, currentNivel);
}


function cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel)
{
    clearContexto();

    estableceContextoForm(frm, currentDocTypeNameFrm, currentNivel);
}

function estableceContextoForm(frm, docTypeName, nivel) {
    if(frm == null)
    {
        frm = cur_frm;
	}
	
	if(docTypeName == null)
	{
		docTypeName = currentDocTypeNameFrm;
	}

	if(nivel == null)
	{
		nivel = currentNivel;
	}

	var contexto = null;
	
	getContexto().then(function(resp){
		contexto = resp;   
		

		if (contexto == null || !(contexto.EsValido(nivel))) {
			cargaDatosSesion(nivel, estableceContextoForm);
		}
		else {
			frm.page.add_inner_message(contexto.GetString(nivel));

			if(nivel!=="EMPRESA")
			{
				if(nivel=="AREA")
				{
					if(!(contexto.Area==null))
					{
						frm.set_value('empresa', obtieneIdentificador(contexto.Empresa));
						frm.set_df_property('empresa', 'read_only', 1);
						frm.refresh_field('empresa');
						frm.set_value('area', obtieneIdentificador(contexto.Area));
						frm.set_df_property('area', 'read_only', 1);
						frm.refresh_field('area');
					}        
				}
				else
				{
					if(nivel=="CLIENTE")
					{
						if(!(contexto.Cliente==null))
						{
							frm.set_value('empresa', obtieneIdentificador(contexto.Empresa));
							frm.set_df_property('empresa', 'read_only', 1);
							frm.refresh_field('empresa');
							frm.set_value('area', obtieneIdentificador(contexto.Area));
							frm.set_df_property('area', 'read_only', 1);
							frm.refresh_field('area');
							frm.set_value('cliente', obtieneIdentificador(contexto.Cliente));
							frm.set_df_property('cliente', 'read_only', 1);
							frm.refresh_field('cliente');
						}        
					}
					else
					{
						if(nivel=="UNIDAD_MEDICA")
						{
							if(!(contexto.UnidadMedica==null))
							{
								frm.set_value('empresa', obtieneIdentificador(contexto.Empresa));
								frm.set_df_property('empresa', 'read_only', 1);
								frm.refresh_field('empresa');
								frm.set_value('area', obtieneIdentificador(contexto.Area));
								frm.set_df_property('area', 'read_only', 1);
								frm.refresh_field('area');
								frm.set_value('cliente', obtieneIdentificador(contexto.Cliente));
								frm.set_df_property('cliente', 'read_only', 1);
								frm.refresh_field('cliente');
								frm.set_value('unidad_medica', obtieneIdentificador(contexto.UnidadMedica));
								frm.set_df_property('unidad_medica', 'read_only', 1);
								frm.refresh_field('unidad_medica');
								frm.set_value('area', contexto.Area);
								frm.set_df_property('area', 'read_only', 1);
								frm.refresh_field('area');
							}        
						}
					}
				}
			}
			else
			{
				frm.set_value('empresa', obtieneIdentificador(contexto.Empresa));
				frm.set_df_property('empresa', 'read_only', 1);
				frm.refresh_field('empresa');
			}
		}
	});
}


function filtroCliente(frm, agregaDatos, empresa) {

	var filtros = [
		["Cliente", "activo", "=", 1]
	];

	if(!(agregaDatos==null)&&agregaDatos)
	{
		var contexto = null;
		
		getContexto().then(function(resp){ 
			contexto = resp;

			if(empresa==null)
			{
				empresa = contexto.Empresa;
			}
		
			filtros.push(["Cliente", "empresa", "=", empresa]);

			cur_frm.set_query('cliente', function () {
				return {
					filters: filtros
				};
			});
		});
	}
	else
	{
		filtros.push(["Cliente", "empresa", "=", empresa]);

		cur_frm.set_query('cliente', function () {
			return {
				filters: filtros
			};
		});
	}
}

function filtroUnidad(frm, agregaDatos, empresa, cliente) {

	var filtros = [
		["Unidad Medica", "activo", "=", 1]
	];

	if(!(agregaDatos==null) && agregaDatos)
	{
		var contexto = null;
		getContexto().then(function(resp){ 
			contexto = resp;

			if(empresa==null)
			{
				empresa = contexto.Empresa;
			}

			filtros.push(["Unidad Medica", "empresa", "=", empresa]);

			if(cliente==null)
			{
				cliente = contexto.Cliente;
			}
			
			filtros.push(["Unidad Medica", "cliente", "=", cliente]);

			cur_frm.set_query('cliente', function () {
				return {
					filters: filtros
				};
			});
		});
	}
	else
	{
		filtros.push(["Unidad Medica", "empresa", "=", empresa]);
		filtros.push(["Unidad Medica", "cliente", "=", cliente]);

		cur_frm.set_query('cliente', function () {
			return {
				filters: filtros
			};
		});
	}
}

// function filtroUnidad(frm, empresa, cliente, area) {
// 	cur_frm.set_query('unidad_medica', function () {
// 		return {
// 			filters: [
// 				["Unidad Medica", "activo", "=", 1],
// 				["Unidad Medica", "empresa", "=", empresa],
// 				["Unidad Medica", "cliente", "=", cliente]
// 			]
// 		};
// 	});



function estableceContextoListView(listview, docTypeName, nivel) {
    if(listview == null)
    {
        listview = currentListView;
	}
	
	if(docTypeName == null)
	{
		docTypeName = currentDocTypeNameLst;
	}

	if(nivel == null)
	{
		nivel = currentNivel;
	}

	var contexto = null;
		
	getContexto().then(function(resp){ 
		contexto = resp;
   
		if (contexto == null || !(contexto.EsValido(nivel))) {
			cargaDatosSesion(nivel, estableceContextoListView);
		}
		else {
			listview.page.add_inner_message(contexto.GetString());

			var opcionesCliente = {
				"empresa": obtieneIdentificador(contexto.Empresa),
			};

			if(nivel!=="EMPRESA")
			{
				opcionesCliente.area = contexto.Area;

				if(nivel=="CLIENTE")
				{
					if(IsNotEmpty(contexto.Cliente))
					{
						opcionesCliente.cliente = obtieneIdentificador(contexto.Cliente);
					}
				}
				else
				{
					if(nivel=="UNIDAD_MEDICA")
					{
						if(IsNotEmpty(contexto.UnidadMedica))
						{
							opcionesCliente.unidad_medica = obtieneIdentificador(contexto.UnidadMedica);
						}
					}
				}
			}

			console.log(opcionesCliente);

			frappe.route_options = opcionesCliente;

			frappe.set_route("List", docTypeName);

			listview.refresh();
		}
	});
}

async function cargaDatosSesion(nivel, callback)
{
	CargaEmpresas().then(function(resp){
        empresas = resp.message;

        if(!(empresas==null))
        {
            var lstEmpresas = getFormatedOptions(empresas, strCampoEmpresa);

            if(nivel === "EMPRESA")
            {
                return CargaDialogoEmpresa(lstEmpresas, callback);
            }
            else
            {
				var primerEmpresa = empresas[0];
				
				if(nivel === "AREA")
				{
					return CargaDialogoArea(lstEmpresas, callback);
				}
				else
				{
					CargaClientes(primerEmpresa.name).then(function(resp){
						clientes = resp.message;
						
						if(!(clientes==null))
						{
							var lstClientes = getFormatedOptions(clientes, strCampoCliente);

							if(nivel === "CLIENTE")
							{
								return CargaDialogoCliente(lstEmpresas, lstClientes, callback);            
							}
							else
							{
								var primerCliente = clientes[0];

								CargaUnidades(primerCliente.name).then(function(resp){
									unidades = resp.message;

									var lstUnidades = getFormatedOptions(unidades, 'nombre');

									return CargaDialogoUnidadMedica(lstEmpresas, lstClientes, lstUnidades, callback);
								});
							}
						}
					});
				}
            }
        }
	});		
}

function CargaDialogoUnidadMedica(lstEmpresas, lstClientes, lstUnidades, callback) {
	var indiceCliente = 2;
	var indiceUnidadMedica = 3;

	dialogo = new frappe.ui.Dialog({
		title: 'Seleccione los parámetros de trabajo para la pagina actual',
		fields: [
			{
				label: 'Empresa',
				fieldname: 'empresa',
				fieldtype: 'Select',
				options: lstEmpresas,
				reqd: 1,
				onchange: function(e) {

					CargaClientes(this.value).then(function(resp){						
						clientes = resp.message;				
						
						if(!(clientes==null))
						{
							var lstClientes = getFormatedOptions(clientes, strCampoCliente);

							dialogo.fields_list[indiceCliente].df.options = lstClientes;

							dialogo.fields_list[indiceCliente].set_formatted_input();
						}
					});					
				}
			},
			{
				label: 'Área',
				fieldname: 'area',
				fieldtype: 'Select',
				reqd: 1,
				options: [
					'SIA',
					'SIO'
				]
			},
			{
				label: 'Cliente',
				fieldname: 'cliente',
				fieldtype: 'Select',
				options: lstClientes,
				reqd: 1,
				onchange: function(e) {
					CargaUnidades(this.value).then(function(resp){						
						unidades = resp.message;				
						
						if(!(unidades==null))
						{
							var lstUnidades = getFormatedOptions(unidades, strCampoUnidadMedica);

							dialogo.fields_list[indiceUnidadMedica].df.options = lstUnidades;

							dialogo.fields_list[indiceUnidadMedica].set_formatted_input();
						}
					});					
				}
			},
			{
				label: 'Unidad Médica',
				fieldname: 'unidadMedica',
				fieldtype: 'Select',
				options: lstUnidades,
				reqd: 0,
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			estableceContexto(values.empresa, values.area, values.cliente, values.unidadMedica, callback);

			dialogo.hide();
		}
	});	

	dialogo.show();
}

function CargaDialogoCliente(lstEmpresas, lstClientes, callback) {
	var indiceCliente = 2;

	dialogo = new frappe.ui.Dialog({
		title: 'Seleccione los parámetros de trabajo para la pagina actual',
		fields: [
			{
				label: 'Empresa',
				fieldname: 'empresa',
				fieldtype: 'Select',
				options: lstEmpresas,
				reqd: 1,
				onchange: function(e) {
					CargaClientes(this.value).then(function(resp){						
						clientes = resp.message;				
						
						if(!(clientes==null))
						{
							var lstClientes = getFormatedOptions(clientes, strCampoCliente);

							dialogo.fields_list[indiceCliente].df.options = lstClientes;

							dialogo.fields_list[indiceCliente].set_formatted_input();
						}
					});					
				}
			},
			{
				label: 'Área',
				fieldname: 'area',
				fieldtype: 'Select',
				reqd: 1,
				options: [
					'SIA',
					'SIO'
				]
			},
			{
				label: 'Cliente',
				fieldname: 'cliente',
				fieldtype: 'Select',
				options: lstClientes,
				reqd: 1,
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			estableceContexto(values.empresa, values.area, values.cliente, null, callback);

			dialogo.hide();
		}
	});	

	dialogo.show();
}

function CargaDialogoArea(lstEmpresas, callback) {

	dialogo = new frappe.ui.Dialog({
		title: 'Seleccione los parámetros de trabajo para la pagina actual',
		fields: [
			{
				label: 'Empresa',
				fieldname: 'empresa',
				fieldtype: 'Select',
				options: lstEmpresas,
				reqd: 1,
			},
			{
				label: 'Área',
				fieldname: 'area',
				fieldtype: 'Select',
				reqd: 1,
				options: [
					'SIA',
					'SIO'
				]
			},
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			estableceContexto(values.empresa, values.area, null, null, callback);

			dialogo.hide();
		}
	});	

	dialogo.show();
}

function CargaDialogoEmpresa(lstEmpresas, callback) {

	dialogo = new frappe.ui.Dialog({
		title: 'Seleccione los parámetros de trabajo para la pagina actual',
		fields: [
			{
				label: 'Empresa',
				fieldname: 'empresa',
				fieldtype: 'Select',
				options: lstEmpresas,
				reqd: 1,
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			estableceContexto(values.empresa, null, null, null, callback);

			dialogo.hide();
		}
	});	

	dialogo.show();
}


function IsNotEmpty(valor)
{
	return (!(valor==null) && valor!=='')
}


function estableceContexto(datosEmpresa, datosArea, datosCliente, datosUnidadMedica, callback) {
	
	var contexto = new Contexto('', '', '', '');

	if(IsNotEmpty(datosEmpresa))
	{
		contexto.Empresa = obtieneIdentificador(datosEmpresa);
		contexto.EtiquetaEmpresa = obtieneEtiqueta(datosEmpresa);
	}

	if(IsNotEmpty(datosArea))
	{
		contexto.Area = obtieneIdentificador(datosArea);
		contexto.EtiquetaArea = obtieneEtiqueta(datosArea);
	}

	if(IsNotEmpty(datosCliente))
	{
		contexto.Cliente = obtieneIdentificador(datosCliente);
		contexto.EtiquetaCliente = obtieneEtiqueta(datosCliente);
	}
	
	if(IsNotEmpty(datosUnidadMedica))
	{
		contexto.UnidadMedica = obtieneIdentificador(datosUnidadMedica);
		contexto.EtiquetaUnidadMedica = obtieneEtiqueta(datosUnidadMedica);
	}

	if (setContexto(contexto)) {
		if (frappe.db.exists("Relacion Usuario", frappe.session.user)) {
			guardaRelacion(contexto, frappe.session.user);
			if (!(callback == null)) {
				callback();
			}
		}
	}
}

function guardaRelacion(contexto, user)
{
	if(!(contexto==null) || !(user==null))
	{
		try
		{
			frappe.db.set_value("Relacion Usuario", user, "empresa", contexto.Empresa);	
			frappe.db.set_value("Relacion Usuario", user, "area", contexto.Area);
			frappe.db.set_value("Relacion Usuario", user, "cliente", contexto.Cliente);
			frappe.db.set_value("Relacion Usuario", user, "unidad_medica", contexto.UnidadMedica);
		}catch(err)
		{
			console.log(err);
		}
	}
}

async function cargaRelacionUsuario(){
	return await frappe.call({
		method:'frappe.client.get',
		args: {
			doctype: 'Relacion Usuario',
			filters: {
				'usuario': frappe.session.user,
			}
		} 
	});
}

function getFormatedOptions(listaObjetos, campoDescripcion)
{
	var lstOpciones = []
	$.each(listaObjetos, function( index, value ) {
		lstOpciones.push(value.name + " - " + eval('value.' + campoDescripcion));
	});
	return lstOpciones;
}

function obtieneIdentificador(campoDescripcion)
{
	if(IsNotEmpty(campoDescripcion))
	{
		var indice = campoDescripcion.indexOf("-", 0);

		if (indice > 0) {
			return (campoDescripcion.substring(0, indice - 1)).trim();
		}
	}

	return campoDescripcion;
}

function obtieneEtiqueta(campoDescripcion)
{
	if(IsNotEmpty(campoDescripcion))
	{
		var indice = campoDescripcion.indexOf("-", 0);

		if (indice > 0) {
			return (campoDescripcion.substring(indice + 1)).trim();
		}
	}

	return campoDescripcion;
}
