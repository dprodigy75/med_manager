//Local a cada listview
currentNivel = 'EMPRESA';
currentDocTypeName = 'Cliente';

frappe.listview_settings['Cliente'] = {
    onload: function(listview) {
		currentNivel = 'EMPRESA';
		currentDocTypeName = 'Cliente';
		currentListView = listview;
		
        frappe.provide('frappe.model');

        estableceContextoListView(listview, currentDocTypeName, currentNivel);

        listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeName, currentNivel));        
    },
};
