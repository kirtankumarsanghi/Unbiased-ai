# Core config
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str

    APP_VERSION: str

    APP_ENV: str = "development"

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    REDIS_URL: str

    CELERY_BROKER_URL: str | None = None
    CELERY_RESULT_BACKEND: str | None = None

    FRONTEND_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    COOKIE_SECURE: bool = False
    SESSION_TTL_SECONDS: int = 1800
    REMEMBER_ME_TTL_SECONDS: int = 2592000
    REFRESH_TOKEN_TTL_SECONDS: int = 2592000
    CSRF_COOKIE_NAME: str = "csrf_token"
    SESSION_COOKIE_NAME: str = "session_id"
    REFRESH_COOKIE_NAME: str = "refresh_token"
    DEFAULT_ADMIN_NAME: str = "Platform Admin"
    DEFAULT_ADMIN_EMAIL: str = "admin@equiaudit.com"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@123"
    DEFAULT_ADMIN_ROLE: str = "SUPER_ADMIN"
    DEV_AUTH_AUTO_PROVISION: bool = False
    DEV_AUTH_ACCEPT_ANY_PASSWORD: bool = False
    DEV_AUTH_RELAXED_PASSWORD_POLICY: bool = False
    AUTO_PROVISION_ROLE: str = "ANALYST"
    AUTO_PROVISION_EMAIL_DOMAINS: str = "gmail.com,outlook.com,yahoo.com,equiaudit.ai,equiaudit.com"

    @property
    def frontend_origins(self) -> list[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGINS.split(",") if origin.strip()]

    @property
    def celery_broker(self) -> str:
        return self.CELERY_BROKER_URL or f"{self.REDIS_URL}/0"

    @property
    def celery_result_backend(self) -> str:
        return self.CELERY_RESULT_BACKEND or f"{self.REDIS_URL}/0"

    @property
    def is_dev(self) -> bool:
        return self.APP_ENV.lower() in {"dev", "development", "local"}

    @property
    def dev_auth_auto_provision(self) -> bool:
        return self.is_dev and self.DEV_AUTH_AUTO_PROVISION

    @property
    def dev_auth_accept_any_password(self) -> bool:
        return self.is_dev and self.DEV_AUTH_ACCEPT_ANY_PASSWORD

    @property
    def dev_auth_relaxed_password_policy(self) -> bool:
        return self.is_dev and self.DEV_AUTH_RELAXED_PASSWORD_POLICY

    @property
    def auto_provision_email_domains(self) -> set[str]:
        return {
            domain.strip().lower()
            for domain in self.AUTO_PROVISION_EMAIL_DOMAINS.split(",")
            if domain.strip()
        }

    class Config:
        env_file = ".env"


settings = Settings()
