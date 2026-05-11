"""public analysis history

Revision ID: 20260511_0003
Revises: 20260511_0002
Create Date: 2026-05-11 14:30:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260511_0003"
down_revision: Union[str, None] = "20260511_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_table(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return inspector.has_table(table_name)


def upgrade() -> None:
    if not _has_table("public_analyses"):
        op.create_table(
            "public_analyses",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("analysis_type", sa.String(), nullable=False),
            sa.Column("input_payload", sa.JSON(), nullable=False),
            sa.Column("output_payload", sa.JSON(), nullable=False),
            sa.Column("confidence_score", sa.String(), nullable=True),
            sa.Column("risk_score", sa.String(), nullable=True),
            sa.Column("neutrality_score", sa.String(), nullable=True),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column("organisation_id", sa.Integer(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.ForeignKeyConstraint(["organisation_id"], ["organisations.id"]),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_public_analyses_id"), "public_analyses", ["id"], unique=False)
        op.create_index(op.f("ix_public_analyses_analysis_type"), "public_analyses", ["analysis_type"], unique=False)
        op.create_index(op.f("ix_public_analyses_user_id"), "public_analyses", ["user_id"], unique=False)
        op.create_index(op.f("ix_public_analyses_organisation_id"), "public_analyses", ["organisation_id"], unique=False)
        op.create_index(op.f("ix_public_analyses_created_at"), "public_analyses", ["created_at"], unique=False)


def downgrade() -> None:
    pass
