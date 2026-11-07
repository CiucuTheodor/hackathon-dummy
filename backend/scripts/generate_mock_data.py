import os
import json
import random
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. PRODUCTS (~20 Products in Consumer Electronics)
PRODUCTS = [
    # Headphones
    {
        "id": "prod-head-01",
        "name": "AuraSound Studio Pro ANC",
        "category": "headphones",
        "brand": "AuraSound",
        "msrp": 349.99,
        "rating": 4.6,
        "review_count": 1840,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        "description": "Premium over-ear wireless headphones with adaptive hybrid active noise cancellation and 40mm beryllium drivers.",
        "features": ["Hybrid ANC 2.0", "45-hour battery", "Beryllium drivers", "Multipoint Bluetooth 5.4", "Memory foam earcups"]
    },
    {
        "id": "prod-head-02",
        "name": "PulseTech QuietFlow Buds",
        "category": "headphones",
        "brand": "PulseTech",
        "msrp": 179.99,
        "rating": 4.2,
        "review_count": 920,
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        "description": "Compact true-wireless earbuds engineered for active commuting with deep bass profile and IPX5 resistance.",
        "features": ["Spatial Audio 3D", "IPX5 water resistance", "Fast Qi wireless charging", "Transparency mode"]
    },
    {
        "id": "prod-head-03",
        "name": "EchoGear BassMax Wireless",
        "category": "headphones",
        "brand": "EchoGear",
        "msrp": 129.99,
        "rating": 3.9,
        "review_count": 640,
        "image_url": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
        "description": "Club-tuned on-ear wireless headphones with extreme sub-bass boost for electronic music enthusiasts.",
        "features": ["Sub-bass tactile vibration", "Foldable travel hinge", "30-hour playback", "Built-in mic"]
    },
    {
        "id": "prod-head-04",
        "name": "SoundVault Clarity Open-Ear",
        "category": "headphones",
        "brand": "SoundVault",
        "msrp": 159.99,
        "rating": 4.5,
        "review_count": 480,
        "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
        "description": "Air-conduction open-ear sport earphones designed for runners seeking situational awareness.",
        "features": ["Zero canal fatigue", "Directional sound beam", "Titanium memory frame", "SweatProof coating"]
    },
    {
        "id": "prod-head-05",
        "name": "Lumina Audio Elite Wireless",
        "category": "headphones",
        "brand": "Lumina",
        "msrp": 289.99,
        "rating": 4.4,
        "review_count": 710,
        "image_url": "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&auto=format&fit=crop&q=80",
        "description": "Audiophile-grade planar magnetic open-back wireless headphones with custom parametric EQ.",
        "features": ["Planar magnetic drivers", "Lossless LDAC codec", "Aircraft aluminum body", "Detachable boom mic"]
    },

    # Smartwatches
    {
        "id": "prod-watch-01",
        "name": "Horizon Chronos Apex",
        "category": "smartwatches",
        "brand": "Horizon",
        "msrp": 429.99,
        "rating": 4.7,
        "review_count": 2150,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        "description": "Titanium sapphire multisport GPS smartwatch with dual-band GNSS, offline topo maps, and ECG monitor.",
        "features": ["Dual-band GPS", "ECG & SpO2 sensor", "Sapphire glass", "Titanium casing", "14-day battery life"]
    },
    {
        "id": "prod-watch-02",
        "name": "PulseTech PulseBand Active",
        "category": "smartwatches",
        "brand": "PulseTech",
        "msrp": 99.99,
        "rating": 4.1,
        "review_count": 1330,
        "image_url": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
        "description": "Lightweight fitness tracker with curved AMOLED display, continuous heart-rate tracking, and sleep score.",
        "features": ["AMOLED 1.47-inch display", "5ATM waterproof", "Continuous stress tracking", "10-day battery"]
    },
    {
        "id": "prod-watch-03",
        "name": "Kinetix Ultra Voyager",
        "category": "smartwatches",
        "brand": "Kinetix",
        "msrp": 329.99,
        "rating": 4.3,
        "review_count": 870,
        "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
        "description": "Rugged outdoor adventure smartwatch with barometric altimeter, storm alerts, and solar charging ring.",
        "features": ["Solar-assisted charging", "Military standard MIL-STD-810H", "Compass & barometer", "Tactical flashlight"]
    },
    {
        "id": "prod-watch-04",
        "name": "Lumina Vibe Minimalist",
        "category": "smartwatches",
        "brand": "Lumina",
        "msrp": 199.99,
        "rating": 4.0,
        "review_count": 520,
        "image_url": "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&auto=format&fit=crop&q=80",
        "description": "Sleek circular smartwatch crafted with Italian vegan leather strap and minimalist ambient UI.",
        "features": ["Always-On OLED display", "NFC contactless pay", "Interchangeable 20mm bands", "Haptic assistant"]
    },
    {
        "id": "prod-watch-05",
        "name": "AuraSound Tempo Fitness Smart",
        "category": "smartwatches",
        "brand": "AuraSound",
        "msrp": 149.99,
        "rating": 3.8,
        "review_count": 410,
        "image_url": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80",
        "description": "Audio-centric workout companion that stores music offline and broadcasts audio training cues.",
        "features": ["Offline music storage 16GB", "Direct earbud pairing", "Running cadence sensor", "VO2 Max analysis"]
    },

    # Phones
    {
        "id": "prod-phone-01",
        "name": "Horizon Phantom X Pro",
        "category": "phones",
        "brand": "Horizon",
        "msrp": 999.99,
        "rating": 4.7,
        "review_count": 3400,
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        "description": "Flagship smartphone featuring 1-inch sensor camera system, 120Hz LTPO display, and ceramic rear shell.",
        "features": ["1-inch Sony sensor", "Snapdragon Elite Gen 3", "65W wireless charging", "IP68 water/dust proof"]
    },
    {
        "id": "prod-phone-02",
        "name": "Kinetix Neo 5G",
        "category": "phones",
        "brand": "Kinetix",
        "msrp": 499.99,
        "rating": 4.4,
        "review_count": 1820,
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
        "description": "Performance-tier midrange smartphone with 144Hz OLED, 5500mAh silicon-carbon battery, and clean OS.",
        "features": ["5500mAh battery", "144Hz AMOLED", "Clean bloat-free OS", "67W fast turbo charge"]
    },
    {
        "id": "prod-phone-03",
        "name": "Lumina Fold Duo",
        "category": "phones",
        "brand": "Lumina",
        "msrp": 1399.99,
        "rating": 4.1,
        "review_count": 690,
        "image_url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
        "description": "Zero-crease foldable smartphone offering seamless multitasking tablet mode and stylus input.",
        "features": ["Zero-gap teardrop hinge", "Stylus support", "Split-screen workspace", "Dual OLED panels"]
    },
    {
        "id": "prod-phone-04",
        "name": "PulseTech EcoPocket Core",
        "category": "phones",
        "brand": "PulseTech",
        "msrp": 299.99,
        "rating": 4.2,
        "review_count": 940,
        "image_url": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
        "description": "Eco-designed modular smartphone with 100% recycled casing and easily replaceable components.",
        "features": ["Modular screwdriver repair", "Recycled ocean plastics", "5 years software updates", "Dual SIM & microSD"]
    },
    {
        "id": "prod-phone-05",
        "name": "EchoGear Pocket Gaming 7",
        "category": "phones",
        "brand": "EchoGear",
        "msrp": 699.99,
        "rating": 4.3,
        "review_count": 1120,
        "image_url": "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=600&auto=format&fit=crop&q=80",
        "description": "Mobile gaming powerhouse with ultrasonic shoulder triggers, vapor chamber cooling, and RGB accents.",
        "features": ["Ultrasonic shoulder triggers", "Internal cooling fan", "165Hz refresh rate", "Bypass charging"]
    },

    # Accessories
    {
        "id": "prod-acc-01",
        "name": "EchoGear MagStand 3-in-1",
        "category": "accessories",
        "brand": "EchoGear",
        "msrp": 89.99,
        "rating": 4.5,
        "review_count": 1490,
        "image_url": "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80",
        "description": "Magnetic 15W fast wireless charging station for phone, smartwatch, and wireless earbuds simultaneously.",
        "features": ["15W Qi2 certified fast charge", "Weighted zinc alloy base", "Foldable travel design", "Ambient nightlight"]
    },
    {
        "id": "prod-acc-02",
        "name": "Kinetix PowerVault 200W",
        "category": "accessories",
        "brand": "Kinetix",
        "msrp": 119.99,
        "rating": 4.8,
        "review_count": 2300,
        "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
        "description": "25,000mAh airline-approved GaN power bank capable of charging laptops at 140W USB-C PD 3.1.",
        "features": ["140W Single Port PD 3.1", "Smart TFT color display", "Pass-through charging", "Multi-voltage protection"]
    },
    {
        "id": "prod-acc-03",
        "name": "PulseTech AirGrip Ergonomic Case",
        "category": "accessories",
        "brand": "PulseTech",
        "msrp": 34.99,
        "rating": 4.0,
        "review_count": 780,
        "image_url": "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80",
        "description": "Military-grade drop-tested phone case with integrated kickstand and tactile textured grip.",
        "features": ["12ft drop protection", "Built-in steel ring kickstand", "MagSafe compatible", "Anti-yellowing polymer"]
    },
    {
        "id": "prod-acc-04",
        "name": "AuraSound StreamMic Pro USB",
        "category": "accessories",
        "brand": "AuraSound",
        "msrp": 129.99,
        "rating": 4.6,
        "review_count": 1650,
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        "description": "Studio broadcast microphone with internal pop filter, gain dial, and selectable cardioid/stereo patterns.",
        "features": ["24-bit 96kHz recording", "Zero-latency monitor jack", "Custom shockmount included", "Touch mute button"]
    },
    {
        "id": "prod-acc-05",
        "name": "Horizon SmartGimbal Smooth 4",
        "category": "accessories",
        "brand": "Horizon",
        "msrp": 149.99,
        "rating": 4.3,
        "review_count": 890,
        "image_url": "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&auto=format&fit=crop&q=80",
        "description": "3-axis handheld smartphone stabilizer with AI object tracking sensor and magnetic phone clamp.",
        "features": ["AI vision tracking module", "3-axis motorized stability", "Extendable selfie rod", "10-hour battery life"]
    }
]

# 2. TRENDS (12 months = 52 weeks historical + 8 weeks forecast)
def generate_trends(products):
    trends = []
    base_date = datetime.now() - timedelta(weeks=52)
    
    # Assign specific trajectory behaviors
    behaviors = {
        "prod-head-01": ("Rising", 1.8, 45, 92),       # High interest surge (ANC headphones)
        "prod-head-04": ("Rising", 2.2, 25, 88),       # Open ear breakout trend ("Next Big Trend")
        "prod-watch-01": ("Rising", 1.4, 50, 84),      # Titanium adventure watch
        "prod-watch-02": ("Declining", -1.2, 75, 42),  # Basic fitness bands losing to smart rings
        "prod-phone-03": ("Rising", 1.5, 38, 78),      # Foldables momentum
        "prod-acc-02": ("Rising", 1.7, 40, 86),        # High-wattage GaN powerbanks
        "prod-head-03": ("Declining", -0.9, 68, 48),   # Heavy bass cans losing appeal
        "prod-phone-05": ("Stable", 0.1, 55, 57),      # Niche gaming phones
        "prod-acc-01": ("Stable", 0.2, 62, 65),        # 3-in-1 mag chargers
    }

    velocity_rank = 1
    for p in products:
        p_id = p["id"]
        status, growth_rate, start_val, end_val = behaviors.get(
            p_id,
            random.choice([
                ("Rising", 1.2, 35, 75),
                ("Stable", 0.05, 50, 53),
                ("Declining", -1.1, 70, 40)
            ])
        )

        # 52 weeks history
        history = []
        curr = start_val
        for w in range(52):
            w_date = (base_date + timedelta(weeks=w)).strftime("%Y-%m-%d")
            # add sinusoidal seasonal noise
            noise = random.randint(-4, 4)
            step = (end_val - start_val) / 52.0
            val = int(max(5, min(100, curr + (step * w) + noise)))
            history.append({"week_start": w_date, "score": val})

        current_score = history[-1]["score"]
        prev_score = history[-4]["score"]
        change_pct = round(((current_score - prev_score) / max(1, prev_score)) * 100.0, 1)

        # 8-week forecast (linear/moving average with expanding confidence bounds)
        forecast = []
        recent_trend = (current_score - history[-8]["score"]) / 8.0
        for fw in range(1, 9):
            fw_date = (datetime.now() + timedelta(weeks=fw)).strftime("%Y-%m-%d")
            pred = int(max(5, min(99, current_score + (recent_trend * fw))))
            confidence_spread = int(3 + fw * 1.8)
            forecast.append({
                "week_start": fw_date,
                "predicted_score": pred,
                "confidence_lower": max(0, pred - confidence_spread),
                "confidence_upper": min(100, pred + confidence_spread),
                "is_forecast": True
            })

        is_next_big = (p_id == "prod-head-04")

        trends.append({
            "id": f"trend-{p_id}",
            "product_id": p_id,
            "keyword": p["name"],
            "category": p["category"],
            "current_score": current_score,
            "previous_score": prev_score,
            "change_pct": change_pct,
            "status": status,
            "velocity_rank": velocity_rank,
            "is_next_big_trend": is_next_big,
            "history": history,
            "forecast": forecast
        })
        velocity_rank += 1

    trends.sort(key=lambda t: t["change_pct"], reverse=True)
    for idx, t in enumerate(trends):
        t["velocity_rank"] = idx + 1

    return trends

# 3. SOCIAL COMMENTS (~200 comments with clustered pain points & wishes)
def generate_comments(products):
    comments = []
    
    # Pre-defined pain point patterns with recurring complaints
    complaints = [
        ("battery", "negative", [
            "Battery dies after only 4 hours with ANC on. Totally unacceptable for a $350 pair of headphones.",
            "Loved the sound initially, but battery degraded from 2 days to barely 8 hours after 6 months of daily use.",
            "Can someone explain why the battery drains 20% overnight while sitting inside the case?!",
            "Battery indicator jumps wildly from 40% straight to 5% without warning.",
            "Disappointed with battery life on GPS workouts. Died at mile 18 of my marathon.",
            "Why doesn't this support faster charging? 2.5 hours to reach 100% in 2026 feels archaic.",
        ]),
        ("anc_pressure", "negative", [
            "The noise cancellation creates this terrible eardrum cabin pressure feeling. Gave me a headache in 20 mins.",
            "Heavy vacuum sensation whenever ANC switches into high mode. Wish there was a subtle low pressure setting.",
            "ANC produces a noticeable high-frequency hiss in quiet rooms. Really ruins audiobooks.",
            "Noise cancellation is strong for planes, but walking outdoors creates loud wind thumps against the microphones.",
        ]),
        ("comfort", "negative", [
            "Clamp force is way too tight! My glasses hurt against my temples after just 30 minutes.",
            "Ear pads get sweaty within minutes during summer. Silicone or breathable mesh options should be standard.",
            "The headband padding is paper thin. Feels like a hard plastic brick pressing on the top of my skull.",
            "Constantly slips off during bench press or sudden movements. Ear hooks are desperately needed.",
        ]),
        ("software", "negative", [
            "The companion app requires creating an account and location permissions just to change EQ? Ridiculous.",
            "Multipoint Bluetooth switching is completely broken between MacOS and Android. Keeps stuttering audio.",
            "Firmware update v2.1 completely nerfed the bass response. Please let us roll back to previous versions!",
            "Companion app crashes every time I try to save custom tap gesture mappings.",
        ]),
        ("price_value", "neutral", [
            "Great hardware overall, but charging $350 when rival brands include titanium parts for $220 is wild.",
            "Good product, but the replacement ear pads cost $60 alone! Huge markup for foam and faux leather.",
            "Wait for a Black Friday discount. It's solid at $199, but definitely overpriced at full MSRP.",
        ]),
        ("wishlist", "positive", [
            "If they made a version with breathable sports mesh pads and an interchangeable battery, it would be the holy grail.",
            "I wish someone would create an open-ear headphone with deep sub-bass and magnetic detachable charging pins.",
            "Please add an offline local voice assistant for timers and track skipping without pinging the cloud.",
            "All I want is a fitness smartwatch with wireless charging and a screen readable in direct glare sunlight.",
            "A MagSafe powerbank with a built-in kickstand and digital percentage OLED would replace every travel gadget I own."
        ]),
        ("praise", "positive", [
            "Soundstage on these is unbelievably wide. Can hear individual instruments in orchestral tracks.",
            "Fastest charging gadget I've ever owned. 10 minutes gave me enough juice for an entire transatlantic flight.",
            "The build quality is immaculate. Solid aluminum hinges that snap firmly without creaking.",
            "Microphone noise reduction completely filtered out screaming subway noise on my Zoom call today."
        ])
    ]

    sources = ["youtube", "reddit", "tiktok"]
    first_names = ["Alex", "Jordan", "Sam", "Chris", "Taylor", "Morgan", "Riley", "Casey", "Dakota", "Jamie", "Logan", "Avery"]
    handles = ["AudiophileTech", "GadgetReviwr", "NordicNomad", "SoundEngineerX", "DailyRunner99", "TechGuru_Real", "ApexListener"]

    c_id = 1
    # Generate balanced comments across products
    for p in products:
        # Generate 10-12 comments per product to reach ~220 total comments
        count = random.randint(10, 12)
        for _ in range(count):
            tag_choice, sent, templates = random.choice(complaints)
            text = random.choice(templates)
            
            # Contextualize text with product name occasionally
            if random.random() > 0.5:
                text = f"Regarding the {p['name']}: {text}"
            
            source = random.choice(sources)
            author = f"{random.choice(first_names)}_{random.choice(handles)}"
            likes = random.randint(3, 480) if sent != "negative" else random.randint(15, 920) # complaints get upvoted
            days_ago = random.randint(1, 90)
            date_str = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d %H:%M")

            comments.append({
                "id": f"comment-{c_id:04d}",
                "product_id": p["id"],
                "product_name": p["name"],
                "source": source,
                "author": author,
                "text": text,
                "sentiment": sent,
                "likes": likes,
                "created_at": date_str,
                "tags": [tag_choice, p["category"]]
            })
            c_id += 1

    return comments

# 4. PRICES & STORES (4-5 Fictional Stores, 30 days price history)
STORES = [
    {"id": "store-nova", "name": "NovaMart", "shipping": 0.0},
    {"id": "store-electro", "name": "ElectroNest", "shipping": 4.99},
    {"id": "store-apex", "name": "ApexDigital", "shipping": 0.0},
    {"id": "store-sound", "name": "SoundVault", "shipping": 7.50},
    {"id": "store-gadget", "name": "GadgetWave", "shipping": 3.99}
]

def generate_prices(products):
    price_comparisons = {}
    
    for p in products:
        p_id = p["id"]
        msrp = p["msrp"]

        # Store prices variance (-25% to +5% of MSRP)
        store_records = []
        lowest_p = 999999.0
        best_store = ""

        # Price history 30 days
        history_30d = []
        base_date = datetime.now() - timedelta(days=30)
        
        # Simulate slight daily price movements
        store_base_prices = {}
        for s in STORES:
            discount = random.uniform(0.78, 1.02)
            store_base_prices[s["name"]] = round(msrp * discount, 2)

        for d in range(30):
            day_str = (base_date + timedelta(days=d)).strftime("%Y-%m-%d")
            day_prices = {}
            for s in STORES:
                # 10% chance of promo dip on that day
                jitter = -random.uniform(5, 20) if random.random() < 0.12 else random.uniform(-2, 2)
                day_price = round(max(msrp * 0.65, store_base_prices[s["name"]] + jitter), 2)
                day_prices[s["name"]] = day_price
            
            day_min = min(day_prices.values())
            day_avg = round(sum(day_prices.values()) / len(day_prices), 2)
            history_30d.append({
                "date": day_str,
                "store_prices": day_prices,
                "lowest_price": day_min,
                "average_price": day_avg
            })

        latest_day = history_30d[-1]["store_prices"]

        for s in STORES:
            price = latest_day[s["name"]]
            disc_pct = round(((msrp - price) / msrp) * 100.0, 1)
            in_stock = random.random() > 0.1
            if price < lowest_p and in_stock:
                lowest_p = price
                best_store = s["name"]

            store_records.append({
                "store_id": s["id"],
                "store_name": s["name"],
                "price": price,
                "original_price": msrp,
                "discount_pct": disc_pct,
                "in_stock": in_stock,
                "shipping_cost": s["shipping"],
                "is_best_deal": False,
                "affiliate_url": f"https://{s['id']}.example.com/item/{p_id}?ref=marketpulse"
            })

        for s in store_records:
            if s["store_name"] == best_store:
                s["is_best_deal"] = True

        highest_p = max(s["price"] for s in store_records)
        average_p = round(sum(s["price"] for s in store_records) / len(store_records), 2)

        # Value for money algorithmic score (0-100)
        # Factor 1: Price discount vs MSRP (weight 40%)
        discount_factor = min(100, max(0, int(((msrp - lowest_p) / msrp) * 250)))
        # Factor 2: Rating (weight 35%)
        rating_factor = int((p["rating"] / 5.0) * 100)
        # Factor 3: Feature count (weight 25%)
        feature_factor = min(100, len(p["features"]) * 20)

        value_score = int((discount_factor * 0.4) + (rating_factor * 0.35) + (feature_factor * 0.25))
        
        if value_score >= 82:
            verdict = "Outstanding Value"
            rec = f"Strong buy recommendation at {best_store}. Price is {round(((msrp - lowest_p)/msrp)*100)}% below market MSRP with high customer satisfaction."
        elif value_score >= 65:
            verdict = "Fair Market Price"
            rec = f"Good baseline purchase. Consider waiting for promotional flash deals on NovaMart or ElectroNest."
        else:
            verdict = "Premium Overpriced"
            rec = f"Current markup is steep relative to competing models in {p['category']}. Look for refurbished alternatives."

        price_comparisons[p_id] = {
            "product_id": p_id,
            "product_name": p["name"],
            "msrp": msrp,
            "lowest_price": lowest_p,
            "highest_price": highest_p,
            "average_price": average_p,
            "best_store_name": best_store,
            "stores": store_records,
            "value_analysis": {
                "score": value_score,
                "price_competitiveness": discount_factor,
                "feature_density": feature_factor,
                "sentiment_bonus": rating_factor,
                "verdict": verdict,
                "recommendation": rec
            },
            "price_history_30d": history_30d
        }

    return price_comparisons

# 5. MARKETING CAMPAIGNS (5 Campaigns with timeline metrics & AI advice)
CAMPAIGNS = [
    {
        "id": "camp-01",
        "name": "Q4 Peak Audio Blitz - YouTube Creators",
        "platform": "YouTube Ads",
        "status": "Active",
        "product_focus": "AuraSound Studio Pro ANC",
        "spend": 14250.00,
        "revenue": 58400.00,
        "impressions": 840000,
        "clicks": 35280,
        "conversions": 167,
        "ctr": 4.2,
        "cpc": 0.40,
        "cpa": 85.33,
        "roi": 309.8,
        "roas": 4.1,
        "ai_suggestions": [
            "Video hook retention drops 24% at second 6; test a 3-second sound cancellation demonstration intro.",
            "Scale budget by 20% on tech enthusiast channel placements with CTR > 5.5%."
        ]
    },
    {
        "id": "camp-02",
        "name": "Ultra Endurance Watch Launch",
        "platform": "Google Ads",
        "status": "Active",
        "product_focus": "Horizon Chronos Apex",
        "spend": 9800.00,
        "revenue": 34300.00,
        "impressions": 420000,
        "clicks": 21840,
        "conversions": 80,
        "ctr": 5.2,
        "cpc": 0.45,
        "cpa": 122.50,
        "roi": 250.0,
        "roas": 3.5,
        "ai_suggestions": [
            "Exact-match keyword 'rugged titanium smartwatch' converts 3.2x higher than broad match.",
            "Add price extension featuring NovaMart current discount ($389) to increase click-to-cart rate."
        ]
    },
    {
        "id": "camp-03",
        "name": "TikTok Viral Open-Ear Soundwave",
        "platform": "TikTok Ads",
        "status": "Active",
        "product_focus": "SoundVault Clarity Open-Ear",
        "spend": 7400.00,
        "revenue": 28860.00,
        "impressions": 1450000,
        "clicks": 68150,
        "conversions": 180,
        "ctr": 4.7,
        "cpc": 0.11,
        "cpa": 41.11,
        "roi": 290.0,
        "roas": 3.9,
        "ai_suggestions": [
            "UGC style 'runner situational awareness' clip is driving 72% of conversions. Refresh creator roster to prevent creative fatigue.",
            "Audience segment 24-35 joggers shows highest purchase intent; exclude non-fitness interests."
        ]
    },
    {
        "id": "camp-04",
        "name": "Eco-Modular Smartphone Awareness",
        "platform": "Meta Ads",
        "status": "Optimizing",
        "product_focus": "PulseTech EcoPocket Core",
        "spend": 5600.00,
        "revenue": 9520.00,
        "impressions": 380000,
        "clicks": 8740,
        "conversions": 32,
        "ctr": 2.3,
        "cpc": 0.64,
        "cpa": 175.00,
        "roi": 70.0,
        "roas": 1.7,
        "ai_suggestions": [
            "Underperforming benchmark: CPA is $175 on a $299 device. Pause Carousel Ads #3 and #4.",
            "Refocus ad copy away from general ecology toward tangible cost savings: 'Replace only what breaks'."
        ]
    },
    {
        "id": "camp-05",
        "name": "GaN Power Station Fast Charging Promo",
        "platform": "Google Ads",
        "status": "Active",
        "product_focus": "Kinetix PowerVault 200W",
        "spend": 3900.00,
        "revenue": 14820.00,
        "impressions": 190000,
        "clicks": 9120,
        "conversions": 124,
        "ctr": 4.8,
        "cpc": 0.43,
        "cpa": 31.45,
        "roi": 280.0,
        "roas": 3.8,
        "ai_suggestions": [
            "Remarket to users who viewed high-end laptops; conversion rates spike 4.4x for multi-device travelers."
        ]
    }
]

def add_campaign_history(campaigns):
    base_date = datetime.now() - timedelta(days=14)
    for c in campaigns:
        daily = []
        daily_spend = c["spend"] / 14.0
        daily_rev = c["revenue"] / 14.0
        daily_clicks = int(c["clicks"] / 14.0)
        daily_conv = max(1, int(c["conversions"] / 14.0))

        for d in range(14):
            day_str = (base_date + timedelta(days=d)).strftime("%Y-%m-%d")
            jitter = random.uniform(0.85, 1.18)
            daily.append({
                "date": day_str,
                "spend": round(daily_spend * jitter, 2),
                "impressions": int((c["impressions"] / 14.0) * jitter),
                "clicks": int(daily_clicks * jitter),
                "conversions": int(daily_conv * jitter),
                "revenue": round(daily_rev * jitter, 2)
            })
        c["daily_history"] = daily
    return campaigns

def main():
    print(f"Generating mock data in: {DATA_DIR}")
    
    # Write products
    with open(os.path.join(DATA_DIR, "products.json"), "w", encoding="utf-8") as f:
        json.dump(PRODUCTS, f, indent=2)
    print(f"✓ Created products.json ({len(PRODUCTS)} products)")

    # Write trends
    trends = generate_trends(PRODUCTS)
    with open(os.path.join(DATA_DIR, "trends.json"), "w", encoding="utf-8") as f:
        json.dump(trends, f, indent=2)
    print(f"✓ Created trends.json ({len(trends)} trend series)")

    # Write comments
    comments = generate_comments(PRODUCTS)
    with open(os.path.join(DATA_DIR, "comments.json"), "w", encoding="utf-8") as f:
        json.dump(comments, f, indent=2)
    print(f"✓ Created comments.json ({len(comments)} social comments)")

    # Write prices
    prices = generate_prices(PRODUCTS)
    with open(os.path.join(DATA_DIR, "prices.json"), "w", encoding="utf-8") as f:
        json.dump(prices, f, indent=2)
    print(f"✓ Created prices.json ({len(prices)} price comparisons across 5 stores)")

    # Write campaigns
    campaigns = add_campaign_history(CAMPAIGNS)
    with open(os.path.join(DATA_DIR, "campaigns.json"), "w", encoding="utf-8") as f:
        json.dump(campaigns, f, indent=2)
    print(f"✓ Created campaigns.json ({len(campaigns)} marketing campaigns)")

    print("All mock datasets successfully generated!")

if __name__ == "__main__":
    main()
