# run_once.py — project root mein banao aur ek baar run karo
from transformers import AutoTokenizer, AutoModelForSequenceClassification

save_path = "./backend-drf/ai_engine/finbert_model"
model_name = "ProsusAI/finbert"

print("Downloading FinBERT...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

tokenizer.save_pretrained(save_path)
model.save_pretrained(save_path)
print("Done! Saved to", save_path)
