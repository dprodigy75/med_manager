//Local a cada listview
//currentNivel = 'UNIDAD_MEDICA';
currentDocTypeNameLst = 'Almacen';

frappe.listview_settings['Almacen'] = {
    onload: function(listview) {
		//currentNivel = 'UNIDAD_MEDICA';
		
		cargaRelacionUsuario().then(function(resp){ 
			var relacionUsuario = resp.message;

			if(relacionUsuario.tipo_relacion=="Administrador")
			{
				currentNivel = 'AREA';	
			}
			else
			{
				currentNivel = 'UNIDAD_MEDICA';
			}
			
			currentDocTypeNameLst = 'Almacen';
			currentListView = listview;
			
			frappe.provide('frappe.model');
	
			estableceContextoListView(currentListView, currentDocTypeNameLst, currentNivel);
	
			listview.page.add_inner_button('Cambiar', () =>  cambiaRelacionUsuarioListView(currentListView, currentDocTypeNameLst, currentNivel));

		});


    },
};