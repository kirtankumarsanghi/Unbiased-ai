#!/bin/sh
set -e

echo "Waiting for database and applying migrations..."
ATTEMPTS=0
until alembic upgrade head; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 30 ]; then
    echo "Alembic failed after $ATTEMPTS attempts."
    exit 1
  fi
  echo "Migration attempt $ATTEMPTS failed, retrying in 2s..."
  sleep 2
done

echo "Starting API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
