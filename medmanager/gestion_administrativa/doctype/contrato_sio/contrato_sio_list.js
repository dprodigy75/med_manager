currentNivel = 'EMPRESA';
currentDocTypeNameLst = 'Contrato SIO';

frappe.listview_settings['Contrato SIO'] = {
    onload: function(listview) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameLst = 'Contrato SIO';
		currentListView = listview;
		
        frappe.provide('frappe.model');

        estableceContextoListView(currentListView, currentDocTypeNameLst, currentNivel);

        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeNameLst, currentNivel));
    },
};
