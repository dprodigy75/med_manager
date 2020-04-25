// Copyright (c) 2020, Brandmand and contributors
currentNivel = 'EMPRESA';
currentDocTypeNameFrm = 'Cliente';

frappe.ui.form.on('Cliente', {
	onload: function(frm) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameFrm = 'Cliente';

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
	rfc: function(frm) {
		// var rfcValido = ValidaRFC(frm.doc.rfc);

		// if(rfcValido !== true)
		// {
		// 	frappe.msgprint(__("El formato del RFC no es válido"));
		// }
		validaRFC(frm);
	},
	validate: function(frm) {
		// var rfcValido = ValidaRFC(frm.doc.rfc);

		// if(rfcValido !== true)
		// {
		// 	frappe.msgprint(__("El formato del RFC no es válido"));
		// 	frappe.validated = false;
		// }
		validaRFC(frm);
	}
});

function EstableceFiltrosSesion()
{

}

function validaRFC(frm)
{
	var rfcValido = ValidaRFC(frm.doc.rfc);

	if(rfcValido !== true)
	{
		frappe.msgprint(__("El formato del RFC no es válido"));
		frappe.validated = false;
	}
}

// function ValidaRFC(cadena)
// {
// 	var rfcValido = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/.test(cadena);

// 	return rfcValido;
// }