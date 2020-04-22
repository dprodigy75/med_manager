var dialogo;

var clientes = null;
var empresas = null;
var unidades = null;

$( document ).ready(function() {
});


class Contexto {
	constructor(empresa, area, cliente, unidadMedica) {
		this.Empresa = empresa;
		this.Area = area;
		this.Cliente = cliente;
		this.UnidadMedica = unidadMedica;
	};

	GetString() {
		var cadena = '';

		if(!(this.Empresa==null) && this.Empresa!=="")
		{
			cadena += this.Empresa;
		}

		if(!(this.Area==null) && this.Area!=="")
		{
			cadena += " > " + this.Area;
		}

		if(!(this.Cliente==null) && this.Cliente!=="")
		{
			cadena += " > " + this.Cliente;
		}

		if(!(this.UnidadMedica==null) && this.UnidadMedica!=="")
		{
			cadena += " > " + this.UnidadMedica;
		}

		return cadena;
	}
}

function getContexto()
{
	var obj = localStorage.getItem('Contexto');

	if(!(obj == null) && (obj!==''))
	{
		var parsedObj = JSON.parse(obj);

		if(!(parsedObj == null))
		{
			return new Contexto(
					parsedObj.Empresa,
					parsedObj.Area,
					parsedObj.Cliente,
					parsedObj.UnidadMedica
				);
		}
	}

	return null;
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

		var obj = new Contexto(parsedObj.Empresa, parsedObj.Area, parsedObj.Cliente, parsedObj.UnidadMedica);

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
	empresa = getUnformatedOptions(empresa);

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


async function CargaUnidades(cliente)
{
	cliente = getUnformatedOptions(cliente);	
	//unidad_medica
	return await frappe.call({
		method:'frappe.client.get_list',
		args: {
			doctype: 'Unidad Medica',
			filters: {
				'activo': 1,
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
var currentDocTypeName = null;
var strCampoEmpresa = 'abreviacion';
var strCampoCliente = 'abreviacion';

function cambiaRelacionUsuarioListView(listView, currentDocTypeName, currentNivel)
{
    clearContexto();

    estableceContextoListView(listView, currentDocTypeName, currentNivel);
}


function estableceContextoListView(listview, docTypeName, nivel) {
    if(listview == null)
    {
        listview = currentListView;
	}
	
	if(docTypeName == null)
	{
		docTypeName = currentDocTypeName;
	}

	if(nivel == null)
	{
		nivel = currentNivel;
	}

    var contexto = getContexto();
   
    if (contexto == null) {
        cargaDatosSesion(nivel, estableceContextoListView);
    }
    else {
        listview.page.add_inner_message(contexto.GetString());

        var opcionesCliente = {
            "empresa": getUnformatedOptions(contexto.Empresa),
        };

        if(nivel!=="EMPRESA")
        {
            if(nivel=="CLIENTE")
            {
                if(!(contexto.Cliente==null))
                {
                    opcionesCliente.cliente = getUnformatedOptions(contexto.Cliente);
                }        
            }
            else
            {
                if(nivel=="UNIDAD_MEDICA")
                {
                    if(!(contexto.UnidadMedica==null))
                    {
                        opcionesCliente.area = contexto.Area;
                        opcionesCliente.unidad_medica = getUnformatedOptions(contexto.UnidadMedica);
                    }        
                }
            }
        }

        console.log(opcionesCliente);

        frappe.route_options = opcionesCliente;

        frappe.set_route("List", docTypeName);

        console.log(frappe.route_options);
        listview.refresh();
    }
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

                CargaClientes(primerEmpresa.name).then(function(resp){
                    clientes = resp.message;
                    
                    if(!(clientes==null))
                    {
                        var lstClientes = getFormatedOptions(clientes, strCampoCliente);

                        if(nivel === "CLIENTE")
                        {
                            return CargaDialogoClientes(lstEmpresas, lstClientes, callback);            
                        }
                        else
                        {
                            var primerCliente = clientes[0];

                            CargaUnidades(primerCliente.name).then(function(resp){
                                unidades = resp.message;

                                var lstUnidades = getFormatedOptions(unidades, 'nombre');

                                return CargaDialogo(lstEmpresas, lstClientes, lstUnidades, estableceContexto);
                            });
                        }
                    }
                });
            }
        }
	});		
}

function CargaDialogo(lstEmpresas, lstClientes, lstUnidades, callback) {

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
							var lstClientes = getFormatedOptions(clientes, 'abreviacion');

							dialogo.fields_list[1].df.options = lstClientes;

							dialogo.fields_list[1].set_formatted_input();
						}
					});					
				}
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
							var lstUnidades = getFormatedOptions(unidades, 'nombre');

							dialogo.fields_list[3].df.options = lstUnidades;

							dialogo.fields_list[3].set_formatted_input();
						}
					});					
				}
			},
			{
				label: 'Area',
				fieldname: 'area',
				fieldtype: 'Select',
				reqd: 1,
				options: [
					'SIA',
					'SIO'
				]
			},
			{
				label: 'Unidad Médica',
				fieldname: 'unidadMedica',
				fieldtype: 'Select',
				options: lstUnidades,
				reqd: 1
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			var empresa = values.empresa;
			var cliente =  values.cliente;
			var area =  values.area;
			var unidadMedica = values.unidadMedica;
			
			var contexto = new Contexto(empresa, area, cliente, unidadMedica);

			if(setContexto(contexto))
			{
				if(frappe.db.exists("Relacion Usuario", frappe.session.user))
				{
					guardaRelacion(contexto, frappe.session.user);
							
					if(!(callback==null))
					{
						callback();
					}						
				}
			}

			dialogo.hide();
		}
	});	

	dialogo.show();
}

function CargaDialogoClientes(lstEmpresas, lstClientes, callback) {

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

							dialogo.fields_list[1].df.options = lstClientes;

							dialogo.fields_list[1].set_formatted_input();
						}
					});					
				}
			},
			{
				label: 'Cliente',
				fieldname: 'cliente',
				fieldtype: 'Select',
				options: lstClientes,
				reqd: 1,
				// onchange: function(e) {	
				// }
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			var empresa = values.empresa;
			var cliente =  values.cliente;

			estableceContexto(empresa, cliente, null, null, callback);			

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
				// onchange: function(e) {
				// }
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			var empresa = values.empresa;
			
			estableceContexto(empresa, null, null, null, callback);

			dialogo.hide();
		}
	});	

	dialogo.show();
}


function estableceContexto(empresa, area, cliente, unidadMedica, callback) {
	var contexto = new Contexto(empresa, area, cliente, unidadMedica);
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
			frappe.db.set_value("Relacion Usuario", user, "empresa", getUnformatedOptions(contexto.Empresa));	
			frappe.db.set_value("Relacion Usuario", user, "area", contexto.Area);
			frappe.db.set_value("Relacion Usuario", user, "cliente", getUnformatedOptions(contexto.Cliente));
			frappe.db.set_value("Relacion Usuario", user, "unidad_medica", getUnformatedOptions(contexto.UnidadMedica));
		}catch(err)
		{
			console.log(err);
		}
	}
}

async function CargaRelacionUsuario(){
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

function getUnformatedOptions(campoDescripcion)
{
	if(!(campoDescripcion == null))
	{
		var indice = campoDescripcion.indexOf("-", 0);

		if (indice > 0) {
			return (campoDescripcion.substring(0, indice - 1)).trim();
		}
	}

	return campoDescripcion;
}
