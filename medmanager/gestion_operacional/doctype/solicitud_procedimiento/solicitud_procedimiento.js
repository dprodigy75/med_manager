// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Solicitud Procedimiento', {
	refresh:  function(frm) {
	
	},
	cliente: function(frm) {
		EstableceFiltroUnidad(frm, cur_frm);
	},
	tipo_procedimiento: function(frm) {

	},
	unidad_medica: function(frm) {
		EstableceAlmacen(frm,cur_frm);
	},
	onload: function(frm) {
		EstableceFiltros(frm, cur_frm);
		
		frm.set_query('medico', () => {
			return {
		 		filters: [
		 			["Doctor", "especialidad", "!=", "Anestesiología"]
		 		  ]
			}
		});

		frm.set_query('anestesiologo', () => {
			return {
				filters: {
					especialidad: 'Anestesiología'
				}
			}
		});
	}
});

frappe.ui.form.on('Producto Folio', {
	refresh: function(frm) {
	},
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		frappe.call({
			method:'frappe.client.get_list',
			args: {
				doctype: 'Producto Inventario',
				fields: [
					"name",
					"producto",
					"lote"
				],
				filters: {
					'parent': frm.doc.almacen,
					'producto': row.producto,
				},
				parent: 'Almacen',
			}, 
			callback: function(resp) { 
				if(resp==null || !(Array.isArray(resp.message)) || resp.message.length<=0)
				{
					frappe.throw("Ocurrió un error al cargar el inventario del producto")
					return;
				}

				var lotes = [];

				$.each(resp.message, function( index, value ) {
					lotes.push(value.lote);						
				});
	
				var lote = frappe.meta.get_docfield(row.doctype, "lote", cur_frm.doc.name);

				lote.options = lotes;

				//frm.refresh_field(lote);
				cur_frm.refresh();
			}
		});
	},
	cantidad: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		frappe.model.set_value(row.doctype, row.name, "costo", (row.costo_unitario*row.cantidad));
	
		var total = 0;
		cur_frm.doc.insumos.forEach(function(d) {
			total += row.costo;
		});

		frm.set_value('costo_insumos', total);

		var costo_base = frm.doc.costo;

		if(!(costo_base==null))
		{
			if(total < costo_base)
			{
				frm.set_value('indicador_costo', '#00FF00');
			}
			else
			{
				var costo_base10 = (costo_base*(1.10));
				console.log(costo_base10);
				console.log(total);
				if(costo_base10 > total)
				{
					frm.set_value('indicador_costo', '#FFFF00');
				}
				else
				{
					frm.set_value('indicador_costo', '#FF0000');
				}
			}
		}

		cur_frm.refresh();
	},
	lote: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if(row.producto==null)
		{
			return;
		}

		frappe.call({
			method:'frappe.client.get',
			args: {
				doctype: 'Producto Inventario',
				filters: {
					'parent': frm.doc.almacen,
					'producto': row.producto,
					'lote': row.lote
				},
				parent: 'Almacen'
			}, 
			callback: function(resp) { 
				if(resp==null || resp.message==null)
				{
					frappe.throw("Ocurrió un error al cargar el lote del producto")
					return;
				}
	
				frappe.model.set_value(row.doctype, row.name, "cantidad", resp.message.cantidad);
				frappe.model.set_value(row.doctype, row.name, "unidad_medida", resp.message.unidad);
				frappe.model.set_value(row.doctype, row.name, "costo_unitario", resp.message.costo);
	
				cur_frm.refresh();
			}
		});
	}
});

function EstableceAlmacen(frm, cur_frm) {
	if(!(frm.doc.unidad_medica == null))
	{
		frappe.call({
			method:'frappe.client.get',
			args: {
				doctype: 'Almacen',
				filters: {
					'unidad_medica': frm.doc.unidad_medica
				}
			}, 
			callback: function(resp) { 
				if(resp==null || resp.message==null)
				{
					frappe.throw("Ocurrió un error al cargar el almacén de la unidad médica")
					return;
				}
	
				frm.set_value('almacen', resp.message.name);
	
				cur_frm.refresh();

				EstableceFiltroInsumos(frm, cur_frm);
			}
		});

	}
}

function EstableceFiltros(frm, cur_frm) {
	EstableceFiltroCliente(frm, cur_frm);

	var contexto = getContexto();

	console.log(contexto);

	if(!(contexto.Cliente==null) && contexto.Cliente!=='')
	{
		frm.set_value('cliente', getUnformatedOptions(contexto.Cliente));
		frm.refresh_field('cliente');
		//cur_frm.refresh();
	}
}

function EstableceFiltroInsumos(frm, cur_frm) {
	cur_frm.set_query("producto", "insumos", function (doc, cdt, cdn) {
		var d = locals[cdt][cdn];
		var data = { "unidad_medica": doc.unidad_medica };
		return {
			query: "medmanager.gestion_operacional.doctype.solicitud_procedimiento.solicitud_procedimiento.productos_contrato",
			filters: {
				unidad_medica: doc.unidad_medica
			}
		};
	});
}

function EstableceFiltroServicios(frm, cur_frm) {
	var contexto = getContexto();

	cur_frm.set_query('tipo_procedimiento', function () {
		return {
			filters: [
				["Catalogo de Servicios", "activo", "=", 1],
				["Catalogo de Servicios", "empresa", "=", getUnformatedOptions(contexto.Empresa)]
			]
		};
	});
}



function EstableceFiltroCliente(frm, cur_frm) {
	var contexto = getContexto();

	cur_frm.set_query('cliente', function () {
		return {
			filters: [
				["Cliente", "activo", "=", 1],
				["Cliente", "empresa", "=", getUnformatedOptions(contexto.Empresa)]
			]
		};
	});
}
function EstableceFiltroUnidad(frm, cur_frm) {
	var contexto = getContexto();

	cur_frm.set_query('unidad_medica', function () {
		return {
			filters: [
				["Unidad Medica", "activo", "=", 1],
				["Unidad Medica", "cliente", "=", frm.doc.cliente]
			]
		};
	});

	if(!(contexto.UnidadMedica==null) && contexto.UnidadMedica!=='')
	{
		frm.set_value('unidad_medica', getUnformatedOptions(contexto.UnidadMedica));
	
		cur_frm.refresh();
	}
	else
	{
		frm.set_value('unidad_medica', null);
		frm.refresh_field('unidad_medica');
	}
}