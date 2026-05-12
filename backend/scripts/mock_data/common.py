from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[2] # Goes up 3 levels

sys.path.insert(0, str(BACKEND_DIR))    # Make python interpreter search for app in BACKEND
from app.core.config import settings

PROJECT_ROOT = BACKEND_DIR.parent 
SCRIPT_DIR = Path(__file__).parent

ENV_PATH = PROJECT_ROOT / ".env"
OUTPUTS_DIR = SCRIPT_DIR / "outputs"
OUTPUT_FILE = settings.mock_data_path