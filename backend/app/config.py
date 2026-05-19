from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_SYNC: str = ""
    SECRET_KEY: str = "dev-secret-key"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
