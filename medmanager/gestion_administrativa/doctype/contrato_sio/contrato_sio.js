// Copyright (c) 2020, Brandmand and contributors
currentNivel = 'EMPRESA';
currentDocTypeNameFrm = 'Contrato SIO';

frappe.ui.form.on('Contrato SIO', {
	onload: function(frm) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameFrm = 'Contrato SIO';

		estableceContextoForm(frm, currentDocTypeNameFrm, currentNivel);

		frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));

		if(frm.doc.docstatus == 0 && frm.doc.__unsaved == 1)
		{
		 	cur_frm.clear_table("partidas");
		 	cur_frm.clear_table("subpartidas");
		}
		else
		{
			cargaPartidasNew(frm);
			clearNew(frm);
		}

		cur_frm.set_query("servicio", "partidas", function (doc, cdt, cdn) {
			return {
				filters: [
					["Catalogo de Servicios", "activo", "=", 1],
					["Catalogo de Servicios", "empresa", "=", frm.doc.empresa],
					["Catalogo de Servicios", "area", "=", "SIO"]
				]
			};

		});
	},
	refresh: function(frm) {
		var contexto = null;
		
		getContexto().then(function(resp){ 
			contexto = resp;

			frm.page.add_inner_message(contexto.GetString());

			frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));
			//frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));
		});

		cargaPartidasNew(frm);

		cur_frm.set_query("servicio", "partidas", function (doc, cdt, cdn) {
			return {
				filters: [
					["Catalogo de Servicios", "activo", "=", 1],
					["Catalogo de Servicios", "empresa", "=", frm.doc.empresa],
					["Catalogo de Servicios", "area", "=", "SIO"]
				]
			};

		});
	},
	boton_new: function(frm) {
		
		var parent = frm.doc;
		var partidas = frm.doc.partidas;

		var d = frappe.model.add_child(frm.doc, "Partida SIO", "subpartidas", 0);
		
		var partidaFound = partidas.find(function(element) { 
			return element.servicio == parent.partida_new;
		});

		if(!(partidaFound==null))
		{
			var subpartidas = [];

			$.each(frm.doc.subpartidas, function( index, element ) {
				if(element.num_partida == partidaFound.num_partida)
					subpartidas.push(element);
			});

			d.num_partida = partidaFound.num_partida;
			d.num_subpartida = subpartidas.length + 1;
			d.producto = parent.producto_new;
			d.unidad_medida = parent.unidad_medida_new;
			d.precio_venta = parent.precio_venta_new;
			d.minimo = parent.minimo_new;
			d.maximo = parent.maximo_new;
			d.importe_minimo = d.minimo * d.precio_venta;
			d.importe_máximo = d.maximo * d.precio_venta;
			d.marca = parent.marca_new;
			d.modelo = parent.modelo_new;
			d.pais = parent.pais_new;
			d.clave = parent.clave_new;
			d.parentfield = 'subpartidas';		
		}

		
		frm.refresh();
	},
	cliente: function(frm) {
		if(!(frm.doc.cliente == null))
		{
			frappe.db.get_doc('Cliente', frm.doc.cliente)
				.then(doc => {
					frm.set_value('nombre_cliente', doc.abreviacion);
					frm.toggle_display('nombre_cliente', true);
				});
		}
	},
	empresa: function(frm) {
		if(!(frm.doc.empresa == null))
		{
			frappe.db.get_doc('Empresa', frm.doc.empresa)
				.then(doc => {
					frm.set_value('nombre_empresa', doc.abreviacion);
					frm.toggle_display('nombre_empresa', true);
				});
		}
	},
});

function clearNew(frm)
{
	frm.set_value('partida_new', '');
	frm.set_value('producto_new', '');
	frm.set_value('precio_venta_new', '');
	frm.set_value('minimo_new', '');
	frm.set_value('maximo_new', '');
	frm.set_value('unidad_medida_new', '');
	frm.set_value('marca_new', '');
	frm.set_value('modelo_new', '');
	frm.set_value('pais_new', '');
	frm.set_value('clave_new', '');	
}

function cargaPartidasNew(frm)
{
	var partidas = frm.doc.partidas;

	if(!(partidas==null))
	{
		var found = partidas.find(function(element) { 
			return element.servicio != null;
		});

		if(!(found==null))
		{				
			var opciones = [];

			$.each(partidas, function( index, element ) {
				opciones.push(element.servicio);						
			});

			var partida_new = frappe.meta.get_docfield(frm.doctype, "partida_new", cur_frm.doc.name);

			partida_new.options = opciones;						
		}
	}
}


frappe.ui.form.on('Partida SIO', {
	refresh: function(frm) {
	},
	producto: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		
		if(row.producto==null)
		{
			return;
		}

		console.log(row.producto);

		//frappe.model.set_value(row.doctype, row.name, "detalle", "Producto X <br/> Precio: XXX");
	
		frm.refresh();
	},
	precio_venta: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if(!(row.precio_venta==null) && row.precio_venta!='' && row.precio_venta > 0)
		{
			frappe.model.set_value(row.doctype, row.name, "importe_minimo", (row.precio_venta*row.minimo));
			frappe.model.set_value(row.doctype, row.name, "importe_máximo", (row.precio_venta*row.maximo));
			frm.refresh();
		}
		else
		{
			frappe.msgprint("El precio de venta debe ser mayor a cero");

			frappe.model.set_value(row.doctype, row.name, "precio_venta", '');
		}
	},
	minimo: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if(!(row.minimo==null) && row.minimo!='' && row.minimo > 0)
		{
			frappe.model.set_value(row.doctype, row.name, "importe_minimo", (row.precio_venta*row.minimo));
			frm.refresh();
		}
		else
		{
			frappe.msgprint("El mínimo debe ser mayor a cero");

			frappe.model.set_value(row.doctype, row.name, "minimo", '');
		}
	},
	maximo: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if(!(row.maximo==null) && row.maximo!='' && row.maximo > 0)
		{
			frappe.model.set_value(row.doctype, row.name, "importe_máximo", (row.precio_venta*row.maximo));
			frm.refresh();
		}
		else
		{
			frappe.msgprint("El máximo debe ser mayor a cero");

			frappe.model.set_value(row.doctype, row.name, "maximo", '');
		}
	},

	subpartidas_add: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		console.log(row);

		//frm.set_df_property('Partida SIO','servicio', 'read_only', 1)

		// var servicio = frappe.meta.get_docfield(row.doctype, "servicio", cur_frm.doc.name);
		// servicio.read_only = 1;


		//frm.toggle_display(['priority', 'due_date'], frm.doc.status === 'Open');
		frm.refresh();
	}
});


frappe.ui.form.on('Servicios Contrato', {
	servicio: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		var servicio = row.servicio;

		var partidas = frm.doc.partidas;

		var found = partidas.find(function(element) { 
			return element.servicio === servicio && element.idx !== row.idx;
		  });

		if(!(found==null))
		{
			frappe.msgprint("El servicio seleccionado ya fue dado de alta");

			frappe.model.set_value(row.doctype, row.name, "servicio", '');
			frm.refresh();
		}
	},
	precio: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if(!(row.precio==null) && row.precio!='' && row.precio > 0)
		{
			frappe.model.set_value(row.doctype, row.name, "precio_iva", (row.precio*1.16));
			frm.refresh();
		}
		else
		{
			frappe.msgprint("El valor del servicio debe ser mayor a cero");

			frappe.model.set_value(row.doctype, row.name, "precio", '');
			frm.refresh();
		}
	},
	num_procedimientos: function(frm, cdt, cdn) {
		cur_frm.refresh();
	},
	partidas_add: function(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		frappe.model.set_value(row.doctype, row.name, "num_partida", row.idx);
				
		//frm.set_df_property('Partida SIO','servicio', 'read_only', 1)

		// var servicio = frappe.meta.get_docfield(row.doctype, "servicio", cur_frm.doc.name);
		// servicio.read_only = 1;

		//frm.toggle_display(['priority', 'due_date'], frm.doc.status === 'Open');
		frm.refresh();
	}
});