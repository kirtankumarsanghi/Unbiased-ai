# Alembic environment configuration
from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app.core.database import Base
from app.models.ai_model import AIModel  # noqa: F401
from app.models.audit import Audit  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.intervention import Intervention  # noqa: F401
from app.models.login_history import LoginHistory  # noqa: F401
from app.models.organisation import Organisation  # noqa: F401
from app.models.permission import Permission  # noqa: F401
from app.models.refresh_token import RefreshToken  # noqa: F401
from app.models.report import Report  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.session import UserSession  # noqa: F401
from app.models.user import User  # noqa: F401

config = context.config

database_url = os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", database_url)

fileConfig(
    config.config_file_name
)

target_metadata = Base.metadata


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
