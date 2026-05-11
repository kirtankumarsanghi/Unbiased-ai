"""initial core schema

Revision ID: 20260511_0001
Revises:
Create Date: 2026-05-11 00:00:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260511_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_table(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return inspector.has_table(table_name)


def upgrade() -> None:
    if not _has_table("ai_models"):
        op.create_table(
            "ai_models",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=True),
            sa.Column("status", sa.String(), nullable=True),
            sa.Column("bias_index", sa.Float(), nullable=True),
            sa.Column("throughput", sa.String(), nullable=True),
            sa.Column("data_drift", sa.Float(), nullable=True),
            sa.Column("dataset_path", sa.String(), nullable=True),
            sa.Column("dataset_rows", sa.Integer(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_ai_models_id"), "ai_models", ["id"], unique=False)

    if not _has_table("audits"):
        op.create_table(
            "audits",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("model_id", sa.Integer(), nullable=True),
            sa.Column("demographic_parity", sa.Float(), nullable=True),
            sa.Column("equalized_odds", sa.Float(), nullable=True),
            sa.Column("disparate_impact", sa.Float(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_audits_id"), "audits", ["id"], unique=False)
        op.create_index(op.f("ix_audits_model_id"), "audits", ["model_id"], unique=False)

    if not _has_table("reports"):
        op.create_table(
            "reports",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(), nullable=True),
            sa.Column("status", sa.String(), nullable=True),
            sa.Column("content", sa.String(), nullable=True),
            sa.Column(
                "generated_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_reports_id"), "reports", ["id"], unique=False)

    if not _has_table("interventions"):
        op.create_table(
            "interventions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=True),
            sa.Column("status", sa.String(), nullable=True),
            sa.Column("fairness_gain", sa.String(), nullable=True),
            sa.Column("accuracy_tradeoff", sa.String(), nullable=True),
            sa.Column("processing_time", sa.String(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_interventions_id"), "interventions", ["id"], unique=False)

    if not _has_table("audit_logs"):
        op.create_table(
            "audit_logs",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("level", sa.String(), nullable=True),
            sa.Column("message", sa.String(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_audit_logs_id"), "audit_logs", ["id"], unique=False)

    if not _has_table("users"):
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=True),
            sa.Column("email", sa.String(), nullable=True),
            sa.Column("password", sa.String(), nullable=True),
            sa.Column("role", sa.String(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
        op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing = set(inspector.get_table_names())

    if "users" in existing:
        op.drop_index(op.f("ix_users_id"), table_name="users")
        op.drop_index(op.f("ix_users_email"), table_name="users")
        op.drop_table("users")

    if "audit_logs" in existing:
        op.drop_index(op.f("ix_audit_logs_id"), table_name="audit_logs")
        op.drop_table("audit_logs")

    if "interventions" in existing:
        op.drop_index(op.f("ix_interventions_id"), table_name="interventions")
        op.drop_table("interventions")

    if "reports" in existing:
        op.drop_index(op.f("ix_reports_id"), table_name="reports")
        op.drop_table("reports")

    if "audits" in existing:
        op.drop_index(op.f("ix_audits_model_id"), table_name="audits")
        op.drop_index(op.f("ix_audits_id"), table_name="audits")
        op.drop_table("audits")

    if "ai_models" in existing:
        op.drop_index(op.f("ix_ai_models_id"), table_name="ai_models")
        op.drop_table("ai_models")
