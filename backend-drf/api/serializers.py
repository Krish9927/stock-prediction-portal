from rest_framework import serializers

class StockPredictionSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)

class FuturePredictionSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)
    days_ahead = serializers.IntegerField(default=15, min_value=1, max_value=60, required=False)

class TopStockSerializer(serializers.Serializer):
    number = serializers.IntegerField(required=True)