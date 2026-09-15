import re
from typing import Dict, Any

def extract_fields(lines: list[str]) -> Dict[str, Any]:
    # Extremely basic heuristic extractor for the sake of the demo.
    # In a real scenario, this would use robust NLP or specialized regex patterns.
    
    extracted = {
        "product_name": None,
        "manufacturing_date": None,
        "expiry_date": None,
        "batch_number": None,
        "warnings": []
    }
    
    # 1. Product Name: Assume it's one of the first few lines and not a date/batch
    for line in lines[:3]:
        # skip if it looks like a date or batch
        if "mfg" in line.lower() or "exp" in line.lower() or "batch" in line.lower() or "lot" in line.lower():
            continue
        # Just grab the first non-meta line as product name
        if not extracted["product_name"] and len(line) > 2:
            extracted["product_name"] = line.strip()
            break
            
    # 2. Dates
    date_pattern = r'(\d{2,4}[-/.]\d{2}[-/.]\d{2,4})'
    for line in lines:
        lower_line = line.lower()
        match = re.search(date_pattern, line)
        if match:
            date_str = match.group(1).replace('.', '-').replace('/', '-')
            if "mfg" in lower_line or "mfd" in lower_line or "manufactur" in lower_line:
                if not extracted["manufacturing_date"]:
                    extracted["manufacturing_date"] = date_str
            elif "exp" in lower_line or "best" in lower_line or "use by" in lower_line:
                if not extracted["expiry_date"]:
                    extracted["expiry_date"] = date_str
            else:
                # Guess based on if we already have one
                if not extracted["expiry_date"]:
                    extracted["expiry_date"] = date_str
                    
    # 3. Batch
    for line in lines:
        lower_line = line.lower()
        if "batch" in lower_line or "lot" in lower_line or "bn" in lower_line.split():
            parts = line.split()
            for i, p in enumerate(parts):
                if p.lower() in ['batch', 'lot', 'bn', 'no', 'number', ':']:
                    continue
                extracted["batch_number"] = p
                break
            if not extracted["batch_number"]:
                # Just take the whole line minus the keyword
                extracted["batch_number"] = re.sub(r'(?i)(batch|lot|bn|no|number|:|-)', '', line).strip()
            if extracted["batch_number"]:
                break
                
    # Formatting fixes
    if extracted["manufacturing_date"]:
        # Naive formatting to YYYY-MM-DD
        d = extracted["manufacturing_date"]
        if len(d.split('-')[0]) == 2: # DD-MM-YYYY
            parts = d.split('-')
            extracted["manufacturing_date"] = f"{parts[2]}-{parts[1]}-{parts[0]}"
    if extracted["expiry_date"]:
        d = extracted["expiry_date"]
        if len(d.split('-')[0]) == 2: # DD-MM-YYYY
            parts = d.split('-')
            extracted["expiry_date"] = f"{parts[2]}-{parts[1]}-{parts[0]}"
            
    if not extracted["expiry_date"]:
        extracted["warnings"].append("expiry_date_not_found")
        
    return extracted
