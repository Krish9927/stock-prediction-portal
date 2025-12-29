from rest_framework import serializers

class StockPredictionSerializer(serializers.Serializer):
    ticker=serializers.CharField(max_length=20)

class TopStockSerializer(serializers.Serializer):
    number = serializers.IntegerField(required=True)