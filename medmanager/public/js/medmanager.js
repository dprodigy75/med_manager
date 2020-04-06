var dialogo;

var clientes = null;
var empresas = null;

$( document ).ready(function() {
	console.log( "ready!" );
	//debugger;
	//  let page = frappe.ui.make_app_page({
	//  	title: 'My Page',
	//  	parent: cur_frm.form_wrapper, // HTML DOM Element or jQuery object
	//  	single_column: true // create a page without sidebar
	// })
	
	//cur_frm.appframe.buttons.Submit.remove();


	//page.set_title_sub('Subtitle');
	//cur_frm.appframe.set_title_sub('Subtitle');
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

	if(!(obj == null))
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
	var indice = empresa.indexOf("-", 0);

	if(indice > 0)
	{
		empresa = (empresa.substring(0, indice -1)).trim();
	}

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

function CargaDialogo(lstEmpresas, lstClientes) {

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

							//dialogo.fields_list[1].set_options();
							dialogo.fields_list[1].set_formatted_input();
						}
					});					
				}
			},
			{
				label: 'Cliente',
				fieldname: 'cliente',
				fieldtype: 'Select',
				reqd: 1,
				options: lstClientes
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
			}
		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			var empresa = values.empresa;
			var cliente =  values.cliente;
			var area =  values.area;
			
			console.log(empresa);
			console.log(area);
			console.log(cliente);

			var contexto = new Contexto(empresa, area, cliente, '');

			setContexto(contexto);			

			dialogo.hide();
		}
	});	

	dialogo.show();
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
