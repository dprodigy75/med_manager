# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": 'Gestion Administrativa',
			"label": _("Gestion Administrativa"),
			"color": '#FFAEDB',
			"icon": "octicon octicon-git-compare",
			"type": 'module'			
		},
		{
			"module_name": "Compras",
			"label": _("Compras"),
			"color": "#FdF5A7",
			"icon": "octicon octicon-calendar",
			"type": "module"
		},
		{
			"module_name": "Inventario",
			"label": _("Inventario"),
			"color": "#0fF5A7",
			"icon": "octicon octicon-calendar",
			"type": "module"
		},
		{
			"module_name": "Gestion Operacional",
			"label": _("Gestion Operacional"),
			"color": "#aaF5A7",
			"icon": "octicon octicon-calendar",
			"type": "module"
		}
	]
