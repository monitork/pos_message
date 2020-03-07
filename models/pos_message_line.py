# -*- coding: utf-8 -*-
from odoo import api, models, fields, _


class PosMessageLine(models.Model):
    _name = 'pos.message.line'
    _description = _('POS Message Line')

    is_read = fields.Boolean(string=_('Read'))
    pos_config_id = fields.Many2one(
        'pos.config',
        string=_('POS'))
    pos_message_id = fields.Many2one(
        'pos.message',
        string=_('Message'))

    @api.model
    def create_from_ui(self, table):
        # Update dữ liệu từ api
        table_id = table.pop('id', False)
        if table_id:
            self.browse(table_id).write(table)
        return table_id
