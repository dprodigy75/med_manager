currentNivel = 'EMPRESA';
currentDocTypeNameLst = 'Contrato SIA';

frappe.listview_settings['Contrato SIA'] = {
    onload: function(listview) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameLst = 'Contrato SIA';
		currentListView = listview;
		
        frappe.provide('frappe.model');

        estableceContextoListView(currentListView, currentDocTypeNameLst, currentNivel);

        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeNameLst, currentNivel));
    },
};
