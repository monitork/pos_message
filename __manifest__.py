# -*- coding: utf-8 -*-
{
    'name': 'POS Message',
    'summary': """Manager sent message for all pos""",
    'version': '12.0.1.0',
    'description': """Allow admin or manager sent message to pos....""",
    'author': 'Toai Nguyen',
    'company': 'OdooTek',
    'website': 'https://odootek.com',
    'category': 'Point of Sale',
    'depends': ['base', 'point_of_sale'],
    'license': 'AGPL-3',
    'data': [
        # SECURITY
        'security/ir.model.access.csv',
        # Assets AND VIEW
        'views/assets.xml',
        'views/pod_message_view.xml'
    ],
    'demo': [],
    'qweb': [],
    'installable': True,
    'auto_install': False,
}
