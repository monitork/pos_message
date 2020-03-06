from odoo import fields, models, _


class PosConfig(models.Model):
    _inherit = 'pos.config'

    pos_message_id = fields.Many2one(comodel_name='pos.message', string=_('Message'))
