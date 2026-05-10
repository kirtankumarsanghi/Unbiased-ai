# Alembic environment configuration
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

config = context.config

fileConfig(
    config.config_file_name
)

target_metadata = None


def run_migrations_offline():
    pass


def run_migrations_online():
    pass