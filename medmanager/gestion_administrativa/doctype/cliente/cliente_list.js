//Local a cada listview
currentNivel = 'EMPRESA';
currentDocTypeNameLst = 'Cliente';

frappe.listview_settings['Cliente'] = {
    onload: function(listview) {
		currentNivel = 'EMPRESA';
		currentDocTypeNameLst = 'Cliente';
		currentListView = listview;
		
        frappe.provide('frappe.model');

        estableceContextoListView(currentListView, currentDocTypeNameLst, currentNivel);

        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeNameLst, currentNivel));
    },
};
