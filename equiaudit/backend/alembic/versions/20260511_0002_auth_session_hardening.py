"""auth session hardening schema

Revision ID: 20260511_0002
Revises: 20260511_0001
Create Date: 2026-05-11 10:30:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260511_0002"
down_revision: Union[str, None] = "20260511_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_table(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return inspector.has_table(table_name)


def _has_column(table_name: str, column_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if not inspector.has_table(table_name):
        return False
    columns = [c["name"] for c in inspector.get_columns(table_name)]
    return column_name in columns


def upgrade() -> None:
    if _has_table("users"):
        if not _has_column("users", "organisation_id"):
            op.add_column("users", sa.Column("organisation_id", sa.Integer(), nullable=True))
        if not _has_column("users", "email_verified"):
            op.add_column("users", sa.Column("email_verified", sa.Boolean(), nullable=True))
        if not _has_column("users", "is_active"):
            op.add_column("users", sa.Column("is_active", sa.Boolean(), nullable=True))
        if not _has_column("users", "created_at"):
            op.add_column(
                "users",
                sa.Column(
                    "created_at",
                    sa.DateTime(timezone=True),
                    server_default=sa.text("CURRENT_TIMESTAMP"),
                    nullable=True,
                ),
            )

    if not _has_table("organisations"):
        op.create_table(
            "organisations",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=True),
            sa.Column("slug", sa.String(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_organisations_id"), "organisations", ["id"], unique=False)
        op.create_index(op.f("ix_organisations_name"), "organisations", ["name"], unique=True)
        op.create_index(op.f("ix_organisations_slug"), "organisations", ["slug"], unique=True)

    if not _has_table("roles"):
        op.create_table(
            "roles",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=True),
            sa.Column("description", sa.String(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_roles_id"), "roles", ["id"], unique=False)
        op.create_index(op.f("ix_roles_name"), "roles", ["name"], unique=True)

    if not _has_table("permissions"):
        op.create_table(
            "permissions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("code", sa.String(), nullable=True),
            sa.Column("description", sa.String(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_permissions_id"), "permissions", ["id"], unique=False)
        op.create_index(op.f("ix_permissions_code"), "permissions", ["code"], unique=True)

    if not _has_table("user_sessions"):
        op.create_table(
            "user_sessions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("session_id", sa.String(), nullable=True),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column("csrf_token", sa.String(), nullable=True),
            sa.Column("device_info", sa.String(), nullable=True),
            sa.Column("ip_address", sa.String(), nullable=True),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("revoked", sa.Boolean(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_user_sessions_id"), "user_sessions", ["id"], unique=False)
        op.create_index(op.f("ix_user_sessions_session_id"), "user_sessions", ["session_id"], unique=True)
        op.create_index(op.f("ix_user_sessions_user_id"), "user_sessions", ["user_id"], unique=False)
        op.create_index(op.f("ix_user_sessions_expires_at"), "user_sessions", ["expires_at"], unique=False)

    if not _has_table("refresh_tokens"):
        op.create_table(
            "refresh_tokens",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("token_hash", sa.String(), nullable=True),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column("session_id", sa.String(), nullable=True),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("rotated_from", sa.String(), nullable=True),
            sa.Column("revoked", sa.Boolean(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_refresh_tokens_id"), "refresh_tokens", ["id"], unique=False)
        op.create_index(op.f("ix_refresh_tokens_token_hash"), "refresh_tokens", ["token_hash"], unique=True)
        op.create_index(op.f("ix_refresh_tokens_user_id"), "refresh_tokens", ["user_id"], unique=False)
        op.create_index(op.f("ix_refresh_tokens_session_id"), "refresh_tokens", ["session_id"], unique=False)
        op.create_index(op.f("ix_refresh_tokens_expires_at"), "refresh_tokens", ["expires_at"], unique=False)

    if not _has_table("login_history"):
        op.create_table(
            "login_history",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column("email", sa.String(), nullable=True),
            sa.Column("success", sa.Boolean(), nullable=True),
            sa.Column("ip_address", sa.String(), nullable=True),
            sa.Column("user_agent", sa.String(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=True,
            ),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_login_history_id"), "login_history", ["id"], unique=False)
        op.create_index(op.f("ix_login_history_user_id"), "login_history", ["user_id"], unique=False)
        op.create_index(op.f("ix_login_history_email"), "login_history", ["email"], unique=False)

    if _has_table("ai_models"):
        if not _has_column("ai_models", "dataset_path"):
            op.add_column("ai_models", sa.Column("dataset_path", sa.String(), nullable=True))
        if not _has_column("ai_models", "dataset_rows"):
            op.add_column("ai_models", sa.Column("dataset_rows", sa.Integer(), nullable=True))
        if not _has_column("ai_models", "created_at"):
            op.add_column(
                "ai_models",
                sa.Column(
                    "created_at",
                    sa.DateTime(timezone=True),
                    server_default=sa.text("CURRENT_TIMESTAMP"),
                    nullable=True,
                ),
            )

    if _has_table("audits"):
        if not _has_column("audits", "model_id"):
            op.add_column("audits", sa.Column("model_id", sa.Integer(), nullable=True))
        if not _has_column("audits", "created_at"):
            op.add_column(
                "audits",
                sa.Column(
                    "created_at",
                    sa.DateTime(timezone=True),
                    server_default=sa.text("CURRENT_TIMESTAMP"),
                    nullable=True,
                ),
            )
        if not _has_column("audits", "model_name"):
            pass

    if _has_table("reports"):
        if not _has_column("reports", "title"):
            op.add_column("reports", sa.Column("title", sa.String(), nullable=True))
        if not _has_column("reports", "content"):
            op.add_column("reports", sa.Column("content", sa.String(), nullable=True))
        if not _has_column("reports", "generated_at"):
            op.add_column(
                "reports",
                sa.Column(
                    "generated_at",
                    sa.DateTime(timezone=True),
                    server_default=sa.text("CURRENT_TIMESTAMP"),
                    nullable=True,
                ),
            )

    if _has_table("interventions"):
        if not _has_column("interventions", "fairness_gain"):
            op.add_column("interventions", sa.Column("fairness_gain", sa.String(), nullable=True))
        if not _has_column("interventions", "accuracy_tradeoff"):
            op.add_column("interventions", sa.Column("accuracy_tradeoff", sa.String(), nullable=True))
        if not _has_column("interventions", "processing_time"):
            op.add_column("interventions", sa.Column("processing_time", sa.String(), nullable=True))

    if _has_table("audit_logs"):
        if not _has_column("audit_logs", "created_at"):
            op.add_column(
                "audit_logs",
                sa.Column(
                    "created_at",
                    sa.DateTime(timezone=True),
                    server_default=sa.text("CURRENT_TIMESTAMP"),
                    nullable=True,
                ),
            )


def downgrade() -> None:
    pass
