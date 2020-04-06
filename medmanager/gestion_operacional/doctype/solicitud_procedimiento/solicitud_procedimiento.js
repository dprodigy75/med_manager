// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Solicitud Procedimiento', {
	refresh: function(frm) {
		if(!(frm.doc.unidad_medica == null))
		{
			EstableceFiltros(frm, cur_frm);
		}
	},
	unidad_medica: function(frm) {
		if(!(frm.doc.unidad_medica == null))
		{
			EstableceFiltros(frm, cur_frm);

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
				}
			});

		}
	},
	onload: function(frm) {
		
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

		// frm.set_query('anestesiologo', 'especialidades', () => {
		// 	return {
		// 		filters: {
		// 			especialidad: 'Anestesiología'
		// 		}
		// 	}
		// })
		
		// frm.set_query("anestesiologo", "especialidades", () => {
		// 	return {
		// 		filters: [
		// 			["Especialidad", "especialidad", "=", "Anestesiología"]
		// 		  ]
		// 	};
		// });

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
				frappe.model.set_value(row.doctype, row.name, "unidad", resp.message.unidad);
	
				cur_frm.refresh();
			}
		});
	}
});

function EstableceFiltros(frm, cur_frm) {
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
