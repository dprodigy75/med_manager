var dialogo;
var empresa;
var cliente;
var area;
var unidad_medica;

var clientes = null;
var empresas = null;

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
				"nombre"
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
				"razon_social"
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
							var lstClientes = getFormatedOptions(clientes, 'razon_social');

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
			empresa = values.empresa;
			cliente =  values.cliente;
			area =  values.area;
			
			console.log(empresa);
			console.log(area);
			console.log(cliente);

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

