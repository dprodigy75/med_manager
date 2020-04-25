// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt
currentNivel = 'EMPRESA';
currentDocTypeNameFrm = 'Contrato';

frappe.ui.form.on('Contrato', {
	onload: function(frm) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameFrm = 'Contrato';

		estableceContextoForm(frm, currentDocTypeNameFrm, currentNivel);

		frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));
	},
	refresh: function(frm) {
		var contexto = null;
		
		getContexto().then(function(resp){ 
			contexto = resp;

			frm.page.add_inner_message(contexto.GetString());
			frm.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioForm(frm, currentDocTypeNameFrm, currentNivel));
		});
	},
	cliente: function(frm) {
		if(!(frm.doc.cliente == null))
		{
			frappe.db.get_doc('Cliente', frm.doc.cliente)
				.then(doc => {
					frm.set_value('nom_cliente', doc.razon_social);
					frm.toggle_display('nom_cliente', true);
				});
		}
	},
	onload: function(frm) {
		if(!(frm.doc.cliente == null))
		{
			frappe.db.get_doc('Cliente', frm.doc.cliente)
				.then(doc => {
					frm.set_value('nom_cliente', doc.razon_social);
					frm.toggle_display('nom_cliente', true);
				});
		}

		//frm.toggle_enable('nom_cliente', true);
		//frm.set_df_property('nom_cliente', 'read_only', 1);		
	}
});
