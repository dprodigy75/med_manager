// Copyright (c) 2020, Brandmand and contributors
// For license information, please see license.txt

frappe.ui.form.on('Solicitud Procedimiento', {
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
		})

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
