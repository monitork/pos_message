# -*- coding: utf-8 -*-
from odoo import api, models, fields, _


class PosMessage(models.Model):
    _name = 'pos.message'
    _description = _('POS Message')

    title = fields.Char(string=_("Title"), required=True)
    message = fields.Text(string=_("Message"), required=True)
    message_time = fields.Datetime(
        string=_('Start Time'),
        default=fields.Datetime.now())
    pos_config_ids = fields.One2many(
        comodel_name='pos.message.line',
        inverse_name='pos_message_id',
        string=_('Pos'))
