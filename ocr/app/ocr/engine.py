import os
import numpy as np
import logging
import random

logger = logging.getLogger(__name__)

class OcrEngine:
    def __init__(self):
        self.lang = os.getenv("OCR_LANG", "en")
        self._is_ready = False

    def initialize(self):
        self._is_ready = True
        logger.info("Mock OCR engine ready.")

    def is_ready(self):
        return self._is_ready

    def extract_text(self, image):
        if not self._is_ready:
            raise Exception("OCR Engine not initialized")

        # Dynamic mock text extraction for sample label images
        r = random.randint(1000, 9999)
        mfg_date = f"2026-09-{random.randint(10, 28)}"
        exp_date = f"2026-10-{random.randint(10, 28)}"
        
        products = ["Organic Milk", "Whole Wheat Bread", "Free Range Eggs", "Almond Butter", "Greek Yogurt"]
        p = random.choice(products)

        return [
            {"text": f"Product Name: {p}", "confidence": 0.98, "bbox": []},
            {"text": f"Manufacturing Date: {mfg_date}", "confidence": 0.96, "bbox": []},
            {"text": f"Expiry Date: {exp_date}", "confidence": 0.97, "bbox": []},
            {"text": f"Batch No: BATCH-{r}", "confidence": 0.95, "bbox": []}
        ]

ocr_engine = OcrEngine()

