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
        message_id = table.pop('message_id', False)
        pos_config_id = table.pop('pos_config_id', False)
        table_id = False
        if message_id and pos_config_id:
            domains = [['pos_config_id', '=', pos_config_id], ['pos_message_id', '=', message_id]]
            pos_lines = self.search(domains)
            if pos_lines:
                table_id = pos_lines[0].id
                self.browse(table_id).write(table)
        return table_id
