import os
from django.conf import settings
import matplotlib.pyplot as plt

CURRENCY_SYMBOLS = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'CA$',
    'AUD': 'A$',
    'HKD': 'HK$',
    'CNY': '¥',
    'SGD': 'S$',
    'CHF': 'CHF',
}

def save_plot(plot_img_path):
    image_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)
    plt.savefig(image_path)
    plt.close()
    image_url = settings.MEDIA_URL + plot_img_path
    return image_url

def get_currency_meta(ticker: str, info: dict = None) -> dict:
    """
    Determines the currency code, currency symbol, and country of origin
    based on yfinance ticker metadata or exchange suffix.
    """
    info = info or {}
    currency = info.get("currency")
    ticker_upper = ticker.upper().strip()

    if not currency or currency == 'None':
        if ticker_upper.endswith('.NS') or ticker_upper.endswith('.BO'):
            currency = 'INR'
        elif ticker_upper.endswith('.L'):
            currency = 'GBP'
        elif ticker_upper.endswith('.DE') or ticker_upper.endswith('.PA') or ticker_upper.endswith('.AS'):
            currency = 'EUR'
        elif ticker_upper.endswith('.TO') or ticker_upper.endswith('.V'):
            currency = 'CAD'
        elif ticker_upper.endswith('.T') or ticker_upper.endswith('.TYO'):
            currency = 'JPY'
        else:
            currency = 'USD'

    currency_code = currency.upper()
    currency_symbol = CURRENCY_SYMBOLS.get(currency_code, '$')
    country = info.get("country")

    if not country:
        if currency_code == 'INR':
            country = 'India'
        elif currency_code == 'USD':
            country = 'United States'
        elif currency_code == 'GBP':
            country = 'United Kingdom'
        elif currency_code == 'EUR':
            country = 'European Union'
        elif currency_code == 'CAD':
            country = 'Canada'
        elif currency_code == 'JPY':
            country = 'Japan'
        else:
            country = 'Global'

    return {
        "currency_code": currency_code,
        "currency_symbol": currency_symbol,
        "country": country,
        "exchange": info.get("exchange", "Unknown"),
    }