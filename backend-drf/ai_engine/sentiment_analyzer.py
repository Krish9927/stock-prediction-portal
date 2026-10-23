import logging
from typing import List, Dict, Any
import yfinance as yf

from .config import (
    FINBERT_MODEL_NAME,
    MAX_NEWS_ARTICLES,
    TECHNICAL_WEIGHT,
    SENTIMENT_WEIGHT,
)

logger = logging.getLogger(__name__)


class NewsSentimentAnalyzer:
    """
    Financial NLP Sentiment Analyzer leveraging FinBERT (Financial BERT)
    to classify financial headlines into Positive, Negative, and Neutral polarities
    and fuse sentiment signals with Technical ML forecasts.
    """

    def __init__(self, model_name: str = FINBERT_MODEL_NAME):
        self.model_name = model_name
        self._pipeline = None

    def _get_pipeline(self):
        """Lazy load the HuggingFace transformers pipeline on demand."""
        if self._pipeline is None:
            try:
                from transformers import pipeline
                logger.info(f"Loading FinBERT model '{self.model_name}'...")
                self._pipeline = pipeline("sentiment-analysis", model=self.model_name, tokenizer=self.model_name)
            except Exception as e:
                logger.warning(f"Could not load FinBERT via transformers ({e}). Falling back to heuristic classifier.")
                self._pipeline = "fallback"
        return self._pipeline

    def fetch_ticker_news(self, ticker: str, max_articles: int = MAX_NEWS_ARTICLES) -> List[Dict[str, Any]]:
        """Fetch recent financial news headlines for a stock ticker.
        
        Strategy:
        1. Try yfinance Ticker.news (fast, structured)
        2. Fallback to Yahoo Finance RSS feed (reliable, no auth needed)
        """
        articles = self._fetch_via_yfinance(ticker, max_articles)
        if not articles:
            logger.info(f"yfinance news empty for {ticker}, trying RSS fallback...")
            articles = self._fetch_via_rss(ticker, max_articles)
        if not articles:
            logger.info(f"Yahoo RSS empty for {ticker}, trying Google RSS fallback...")
            articles = self._fetch_via_google_rss(ticker, max_articles)
        return articles

    def _fetch_via_yfinance(self, ticker: str, max_articles: int) -> List[Dict[str, Any]]:
        """Primary: yfinance Ticker.news"""
        try:
            t = yf.Ticker(ticker)
            raw_news = t.news or []
            articles = []
            for item in raw_news[:max_articles]:
                # Handle both old and new yfinance news schema
                content = item.get("content", {}) if "content" in item else item
                title = content.get("title") or item.get("title", "")
                publisher = (
                    content.get("provider", {}).get("displayName")
                    or item.get("publisher", "Market News")
                )
                link = (
                    content.get("canonicalUrl", {}).get("url")
                    or item.get("link", "")
                )
                pub_date = content.get("pubDate") or item.get("providerPublishTime", "")
                if title:
                    articles.append({
                        "title": title,
                        "publisher": publisher,
                        "link": link,
                        "published_at": pub_date,
                    })
            return articles
        except Exception as e:
            logger.warning(f"yfinance news fetch failed for {ticker}: {e}")
            return []

    def _fetch_via_rss(self, ticker: str, max_articles: int) -> List[Dict[str, Any]]:
        """Fallback: Yahoo Finance RSS feed — no crumb/cookie required."""
        import re
        import requests

        url = f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={ticker}&region=US&lang=en-US"
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            xml = resp.text

            # Simple regex-based XML parsing (no extra lib needed)
            items = re.findall(r"<item>(.*?)</item>", xml, re.DOTALL)
            articles = []
            for item in items[:max_articles]:
                title_match = re.search(r"<title><!\[CDATA\[(.*?)\]\]></title>", item)
                if not title_match:
                    title_match = re.search(r"<title>(.*?)</title>", item)
                link_match = re.search(r"<link>(.*?)</link>", item)
                pub_match = re.search(r"<pubDate>(.*?)</pubDate>", item)
                source_match = re.search(r"<source[^>]*>(.*?)</source>", item)

                title = title_match.group(1).strip() if title_match else ""
                if title:
                    articles.append({
                        "title": title,
                        "publisher": source_match.group(1).strip() if source_match else "Yahoo Finance",
                        "link": link_match.group(1).strip() if link_match else "",
                        "published_at": pub_match.group(1).strip() if pub_match else "",
                    })
            logger.info(f"RSS fallback fetched {len(articles)} articles for {ticker}")
            return articles
        except Exception as e:
            logger.error(f"RSS fallback also failed for {ticker}: {e}")
            return []

    def _fetch_via_google_rss(self, ticker: str, max_articles: int) -> List[Dict[str, Any]]:
        """Second fallback: Google News RSS — very reliable, no auth."""
        import re
        import requests

        query = f"{ticker} stock"
        url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        headers = {"User-Agent": "Mozilla/5.0"}
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            xml = resp.text

            items = re.findall(r"<item>(.*?)</item>", xml, re.DOTALL)
            articles = []
            for item in items[:max_articles]:
                title_match = re.search(r"<title>(.*?)</title>", item)
                link_match = re.search(r"<link>(.*?)</link>", item, re.DOTALL)
                pub_match = re.search(r"<pubDate>(.*?)</pubDate>", item)
                source_match = re.search(r"<source[^>]*>(.*?)</source>", item)

                raw_title = title_match.group(1).strip() if title_match else ""
                # Google News appends " - Source Name" to title, strip it
                title = re.sub(r"\s*-\s*[^-]+$", "", raw_title).strip()

                if title:
                    articles.append({
                        "title": title,
                        "publisher": source_match.group(1).strip() if source_match else "Google News",
                        "link": link_match.group(1).strip() if link_match else "",
                        "published_at": pub_match.group(1).strip() if pub_match else "",
                    })
            logger.info(f"Google RSS fetched {len(articles)} articles for {ticker}")
            return articles
        except Exception as e:
            logger.error(f"Google RSS also failed for {ticker}: {e}")
            return []

    def _fallback_sentiment(self, text: str) -> Dict[str, Any]:
        """Simple rule-based fallback when transformer dependencies are not yet initialized."""
        text_lower = text.lower()
        pos_words = ["surge", "jump", "growth", "profit", "bull", "gain", "high", "upgrade", "beat", "positive", "rise"]
        neg_words = ["drop", "fall", "decline", "loss", "bear", "plunge", "low", "downgrade", "miss", "negative", "crash", "risk"]

        pos_score = sum(1 for w in pos_words if w in text_lower)
        neg_score = sum(1 for w in neg_words if w in text_lower)

        if pos_score > neg_score:
            label = "positive"
            score = 0.75 + min(0.2, pos_score * 0.05)
        elif neg_score > pos_score:
            label = "negative"
            score = 0.75 + min(0.2, neg_score * 0.05)
        else:
            label = "neutral"
            score = 0.80

        return {"label": label, "score": score}

    def analyze_news(self, ticker: str, max_articles: int = MAX_NEWS_ARTICLES) -> Dict[str, Any]:
        """
        Fetches news articles for `ticker` and performs sentiment classification per headline,
        computing an aggregated sentiment polarity and confidence score.
        """
        articles = self.fetch_ticker_news(ticker, max_articles)
        if not articles:
            return {
                "ticker": ticker,
                "article_count": 0,
                "aggregate_score": 0.0,
                "sentiment_label": "NEUTRAL",
                "breakdown": {"positive": 0, "negative": 0, "neutral": 0},
                "articles": [],
            }

        pipe = self._get_pipeline()
        analyzed_articles = []
        pos_count = 0
        neg_count = 0
        neu_count = 0
        weighted_score_sum = 0.0

        for article in articles:
            title = article["title"]
            if pipe == "fallback" or pipe is None:
                res = self._fallback_sentiment(title)
            else:
                try:
                    res_raw = pipe(title[:512])[0]
                    res = {"label": res_raw["label"].lower(), "score": float(res_raw["score"])}
                except Exception:
                    res = self._fallback_sentiment(title)

            label = res["label"].lower()
            confidence = res["score"]

            if "pos" in label:
                pos_count += 1
                weighted_score_sum += (1.0 * confidence)
                classified_label = "positive"
            elif "neg" in label:
                neg_count += 1
                weighted_score_sum += (-1.0 * confidence)
                classified_label = "negative"
            else:
                neu_count += 1
                classified_label = "neutral"

            analyzed_articles.append({
                **article,
                "sentiment": classified_label,
                "confidence": round(confidence, 4),
            })

        total = len(analyzed_articles)
        normalized_score = weighted_score_sum / total if total > 0 else 0.0
        normalized_score = max(-1.0, min(1.0, normalized_score))

        if normalized_score > 0.15:
            overall_label = "BULLISH"
        elif normalized_score < -0.15:
            overall_label = "BEARISH"
        else:
            overall_label = "NEUTRAL"

        return {
            "ticker": ticker,
            "article_count": total,
            "aggregate_score": round(normalized_score, 3),  # Range -1.0 (Very Bearish) to +1.0 (Very Bullish)
            "sentiment_label": overall_label,
            "breakdown": {
                "positive": pos_count,
                "negative": neg_count,
                "neutral": neu_count,
            },
            "articles": analyzed_articles,
        }

    @staticmethod
    def calculate_hybrid_signal(forecast_data: Dict[str, Any], sentiment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combines technical forecasting directional signal with news sentiment NLP signal
        into a composite trading recommendation.
        """
        # Technical score normalized from -1.0 to 1.0 based on expected % change
        expected_pct = forecast_data.get("expected_change_percent", 0.0)
        # Cap technical score between -1.0 and 1.0 (where ±5% move = ±1.0)
        tech_score = max(-1.0, min(1.0, expected_pct / 5.0))

        # Sentiment score is already in range [-1.0, 1.0]
        sent_score = sentiment_data.get("aggregate_score", 0.0)

        # Composite score
        composite_score = (tech_score * TECHNICAL_WEIGHT) + (sent_score * SENTIMENT_WEIGHT)
        composite_score = round(max(-1.0, min(1.0, composite_score)), 3)

        # Signal categorization
        if composite_score >= 0.5:
            signal = "STRONG BUY"
            rationale = "Strong upward technical momentum backed by positive market news."
        elif composite_score >= 0.15:
            signal = "BUY"
            rationale = "Positive technical or sentiment alignment indicates upward bias."
        elif composite_score <= -0.5:
            signal = "STRONG SELL"
            rationale = "Downside technical trajectory reinforced by negative headline sentiment."
        elif composite_score <= -0.15:
            signal = "SELL"
            rationale = "Mild downward pressure observed in model forecasts or news indicators."
        else:
            signal = "HOLD / NEUTRAL"
            rationale = "Mixed or neutral signals between price trend forecasts and market sentiment."

        return {
            "composite_score": composite_score,
            "signal": signal,
            "rationale": rationale,
            "weights": {
                "technical_weight": TECHNICAL_WEIGHT,
                "sentiment_weight": SENTIMENT_WEIGHT,
            },
            "technical_component": {
                "expected_change_percent": expected_pct,
                "normalized_score": round(tech_score, 3),
            },
            "sentiment_component": {
                "aggregate_score": sent_score,
                "label": sentiment_data.get("sentiment_label"),
            },
        }
