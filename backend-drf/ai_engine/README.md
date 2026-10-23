# AI Engine: Multi-Day Forecasting & FinBERT News Sentiment Analysis

This module extends the **Stock Prediction Portal** with advanced AI/ML capabilities tailored for Data Science, Machine Learning, and Quant Engineering interviews.

---

## 🚀 Key Features

1. **Multi-Day Autoregressive Future Forecasting (`forecasting.py`)**
   - Autoregressive multi-step rollout using the trained LSTM model.
   - Dynamic 95% confidence interval cone ($CI = \hat{y}_t \pm Z \cdot \sigma \cdot \sqrt{t}$) modeling uncertainty expansion over time.
   - Future business calendar mapping (skipping weekends/holidays).

2. **FinBERT NLP News Sentiment Analysis (`sentiment_analyzer.py`)**
   - Real-time financial news headline scraping via Yahoo Finance.
   - Transformer-based sentiment classification using **`ProsusAI/finbert`** (Financial domain-specific BERT).
   - Headline-level polarity weights (-1.0 Bearish to +1.0 Bullish).

3. **Multimodal Hybrid Signal Synthesizer**
   - Weighted fusion of **Technical ML momentum (65%)** and **Market News NLP sentiment (35%)**.
   - Produces actionable recommendations: `STRONG BUY`, `BUY`, `HOLD`, `SELL`, `STRONG SELL` with explicit confidence and reasoning.

---

## 📦 Prerequisites & Environment Setup

To run FinBERT with PyTorch and HuggingFace Transformers, install the following dependencies in your virtual environment:

```bash
# Activate your virtual environment
.\env\Scripts\activate

# Install PyTorch (CPU version is sufficient for inference) and HuggingFace Transformers
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers
```

*(Note: The module includes a fallback rule-based classifier if Transformers is not yet installed, ensuring the application never crashes).*

---

## 🧠 Interview Talking Points & Architecture

### 1. Multi-Step Time-Series Forecasting Strategy
* **Recursive / Autoregressive Rollout**: At each step $t$, the predicted value $\hat{y}_t$ is appended back into the rolling input tensor to predict $\hat{y}_{t+1}$.
* **Error Propagation**: Discuss in interviews how recursive rollouts accumulate variance over longer horizons (why 7-day is more accurate than 30-day).
* **Uncertainty Bounds**: The standard deviation of log returns $\sigma$ is scaled by $\sqrt{t}$ based on the Wiener process / Brownian motion assumption.

### 2. FinBERT vs Generic Sentiment Models
* Standard models (like VADER or generic BERT) misclassify financial terms (e.g., *"Operating expenses increased"* might sound positive due to "increase", but is financially negative).
* **FinBERT** is pre-trained on the Financial PhraseBank and financial filings, understanding market context.

### 3. Multimodal Signal Fusion
* Fuses dense numerical time-series signals with unstructured textual market sentiment into a calibrated composite decision metric.
