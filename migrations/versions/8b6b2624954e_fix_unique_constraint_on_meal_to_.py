"""fix unique constraint on meal to include date

Revision ID: 8b6b2624954e
Revises: 
Create Date: 2020-04-02 19:08:00.193993

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b6b2624954e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uniq_user_meal', 'meal', type_='unique')
    op.create_unique_constraint('uniq_user_meal', 'meal', ['name', 'user_id', 'date'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uniq_user_meal', 'meal', type_='unique')
    op.create_unique_constraint('uniq_user_meal', 'meal', ['name', 'user_id'])
    # ### end Alembic commands ###