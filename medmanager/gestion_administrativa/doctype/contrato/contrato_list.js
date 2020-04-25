currentNivel = 'EMPRESA';
currentDocTypeNameLst = 'Contrato';

frappe.listview_settings['Contrato'] = {
    onload: function(listview) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameLst = 'Contrato';
		currentListView = listview;
		
        frappe.provide('frappe.model');

        estableceContextoListView(currentListView, currentDocTypeNameLst, currentNivel);

        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeNameLst, currentNivel));
    },
};
