import os
from pathlib import Path

# Base directories
AI_ENGINE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = AI_ENGINE_DIR.parent
DEFAULT_MODEL_PATH = os.path.join(BACKEND_DIR, "stock-prediction-model.keras")

# Forecasting Configurations
DEFAULT_LOOKBACK_DAYS = 100  # Number of past days fed into LSTM
SUPPORTED_HORIZONS = [7, 15, 30]  # Forecast days into the future
CONFIDENCE_LEVEL = 1.96  # 95% Confidence Interval multiplier (Z-score)

# Sentiment & FinBERT Configurations
# Local path — model saved via run_once.py (no internet required)
FINBERT_MODEL_NAME = str(AI_ENGINE_DIR / "finbert_model")
MAX_NEWS_ARTICLES = 10  # Number of recent news articles to analyze

# Hybrid Signal Synthesis Weights
TECHNICAL_WEIGHT = 0.65  # Weight given to LSTM directional prediction
SENTIMENT_WEIGHT = 0.35  # Weight given to FinBERT news sentiment
