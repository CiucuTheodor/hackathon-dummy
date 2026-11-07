import asyncio
import random
from typing import List, Optional, Dict, Any
from .llm_base import BaseLLMService

class MockLLM(BaseLLMService):
    """
    Mock LLM implementation simulating high-reasoning models (Claude 3.5 Sonnet / Llama 3.3 70B).
    Introduces an artificial delay (400-800ms) to simulate realistic network inference.
    """

    async def generate_insights(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        # Artificial latency for realistic LLM feel
        await asyncio.sleep(0.5)

        return [
            {
                "id": "rec-01",
                "title": "Capitalize on Open-Ear Audio Surge with Titanium Earhooks",
                "category": "trend",
                "impact": "High",
                "effort": "Medium",
                "summary": "Search velocity for 'Clarity Open-Ear' has spiked +22% over 4 weeks, driven by outdoor runners dissatisfied with in-ear occlusion and ear fatigue.",
                "action_steps": [
                    "Prioritize supplier tooling for lightweight titanium memory wire earhooks.",
                    "Position marketing messaging around 'zero eardrum fatigue & traffic awareness'.",
                    "A/B test launch price point at $139-$159 to undercut legacy brand premiums."
                ],
                "supporting_metric": "+22% 4-week trend velocity, 88 projected peak score"
            },
            {
                "id": "rec-02",
                "title": "Address ANC Cabin Pressure Complaints in Firmware Update v2.2",
                "category": "product",
                "impact": "Critical",
                "effort": "Low",
                "summary": "Social listening reveals 34% of negative comments on Studio Pro ANC cite 'eardrum vacuum feeling' and headache after 20 minutes.",
                "action_steps": [
                    "Push a quick firmware patch exposing a 3-tier ANC intensity slider in companion app.",
                    "Calibrate low-frequency pressure equalization valve through automated EQ tuning.",
                    "Release video walkthrough highlighting how to activate the subtle commute profile."
                ],
                "supporting_metric": "34% of negative sentiment clusters on flagship audio"
            },
            {
                "id": "rec-03",
                "title": "Counter NovaMart Aggressive 18% Price Undercut on Flagships",
                "category": "pricing",
                "impact": "High",
                "effort": "Low",
                "summary": "NovaMart has lowered Studio Pro ANC to $286.99 (vs $349.99 MSRP), capturing 42% of cross-store referral click volume.",
                "action_steps": [
                    "Implement a Minimum Advertised Price (MAP) enforcement notice for Q4 partner contracts.",
                    "Offer direct-to-consumer bundles (free magnetic stand or 2nd pair of cooling pads) to match perceived value without eroding margins."
                ],
                "supporting_metric": "$63 price spread between NovaMart and ElectroNest"
            },
            {
                "id": "rec-04",
                "title": "Reallocate Budget from Meta Carousel to High-ROAS TikTok UGC",
                "category": "marketing",
                "impact": "Medium",
                "effort": "Low",
                "summary": "The 'Eco-Modular Smartphone' Meta campaign is yielding only 1.7x ROAS ($175 CPA), while TikTok Runner UGC yields 3.9x ROAS ($41 CPA).",
                "action_steps": [
                    "Shift $2,500 monthly ad spend from stagnant Meta broad carousel to creator-led TikTok demo clips.",
                    "Iterate Meta ad copy to emphasize repair cost savings rather than abstract sustainability."
                ],
                "supporting_metric": "3.9x ROAS vs 1.7x ROAS across channels"
            }
        ]

    async def extract_product_ideas(
        self,
        comments: Optional[List[str]] = None,
        product_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.7)

        # If user supplied custom comments via the live analyzer, dynamically generate ideas tailored to their text!
        if comments and len(comments) > 0:
            full_text = " ".join(comments).lower()
            custom_ideas = []

            if any(k in full_text for k in ["battery", "drain", "charge", "dying", "power"]):
                custom_ideas.append({
                    "id": "idea-custom-bat",
                    "name": "MagFlow Hot-Swap Battery Audio Module",
                    "problem_solved": "Eliminates downtime and battery anxiety caused by internal lithium battery degradation.",
                    "target_audience": "Long-distance travelers, marathoners, and remote workers on continuous 8-hour Zoom marathons.",
                    "supporting_comment_count": len(comments),
                    "key_features": [
                        "Dual snap-on magnetic battery pucks (15 hours each)",
                        "Hot-swappable uninterrupted audio switching",
                        "USB-C fast pocket charger case"
                    ],
                    "demand_level": "High",
                    "feasibility_score": 92
                })

            if any(k in full_text for k in ["comfort", "clamp", "glasses", "headache", "tight", "sweat"]):
                custom_ideas.append({
                    "id": "idea-custom-comf",
                    "name": "FlexAir Ergonomic Glasses-Relief Headset",
                    "problem_solved": "Solves painful temple clamping and sweat buildup during extended wear for eyeglass wearers.",
                    "target_audience": "Software engineers, gamers, and glasses/sunglasses wearers.",
                    "supporting_comment_count": len(comments),
                    "key_features": [
                        "Contoured temple-channel memory foam cushions",
                        "Thermo-regulating honeycomb mesh fabric",
                        "Adjustable caliper headband with tension calibration scale"
                    ],
                    "demand_level": "High",
                    "feasibility_score": 88
                })

            if any(k in full_text for k in ["mic", "voice", "call", "zoom", "wind", "muffled"]):
                custom_ideas.append({
                    "id": "idea-custom-mic",
                    "name": "ClearBeam AI Studio Wireless Mic Attachment",
                    "problem_solved": "Fixes muffled, hollow voice pickups in windy or crowded café environments.",
                    "target_audience": "Digital nomads, podcast hosts, and hybrid corporate professionals.",
                    "supporting_comment_count": len(comments),
                    "key_features": [
                        "Dual MEMS beamforming array with on-device DSP noise filter",
                        "Ultra-light magnetic boom clip attachment",
                        "Physical tactile mute toggle with LED status"
                    ],
                    "demand_level": "Medium",
                    "feasibility_score": 85
                })

            # If no specific keyword matched or as fallback, provide a contextual synthesized idea
            if not custom_ideas:
                first_snippet = comments[0][:60] + "..." if len(comments[0]) > 60 else comments[0]
                custom_ideas.append({
                    "id": "idea-custom-general",
                    "name": "Adaptive Modular Core Edition",
                    "problem_solved": f"Directly targets user friction highlighted in feedback: '{first_snippet}'",
                    "target_audience": "Discerning electronics enthusiasts seeking durability and modular customization.",
                    "supporting_comment_count": len(comments),
                    "key_features": [
                        "User-serviceable modular component design",
                        "Companion app with community-shared performance profiles",
                        "Extended 3-year warranty with zero-cost part replacements"
                    ],
                    "demand_level": "High",
                    "feasibility_score": 84
                })

            return custom_ideas

        # Default pre-computed ideas derived from the 200+ mock social comments
        return [
            {
                "id": "idea-01",
                "name": "AuraSound AeroComfort Dual-Zone ANC",
                "problem_solved": "Completely relieves eardrum cabin pressure and glasses temple pinching while maintaining 42dB noise cancellation.",
                "target_audience": "Commuters, frequent flyers, and remote workers wearing spectacles.",
                "supporting_comment_count": 73,
                "key_features": [
                    "Active micro-pneumatic pressure vent valve",
                    "Eyeglass relief temple grooves in dual-layer gel cushions",
                    "Granular 10-step vacuum sensitivity slider in iOS/Android app"
                ],
                "demand_level": "High",
                "feasibility_score": 91
            },
            {
                "id": "idea-02",
                "name": "SoundVault Marathon Open-Ear Pro",
                "problem_solved": "Provides directional situational audio for outdoor runners without losing punchy sub-bass or falling off during sprints.",
                "target_audience": "Urban runners, cyclists, and fitness enthusiasts prioritizing safety.",
                "supporting_comment_count": 52,
                "key_features": [
                    "Bone-conduction + air-conduction hybrid driver architecture",
                    "Flexible aerospace titanium wraparound headband",
                    "IP68 complete sweat and rain submersion rating",
                    "Emergency rear LED safety strobe light"
                ],
                "demand_level": "High",
                "feasibility_score": 86
            },
            {
                "id": "idea-03",
                "name": "Horizon SolarApex Dual-Screen Expedition Watch",
                "problem_solved": "Overcomes GPS battery drainage on multi-day ultramarathons and bright daylight screen washouts.",
                "target_audience": "Ultramarathoners, mountaineers, and backcountry hikers.",
                "supporting_comment_count": 38,
                "key_features": [
                    "Stacked display: Ultra-vibrant AMOLED + transreflective low-power memory LCD",
                    "Perimeter high-efficiency monocrystalline solar charging ring (adds 4 days)",
                    "Satellite SOS beacon integration"
                ],
                "demand_level": "Medium",
                "feasibility_score": 79
            },
            {
                "id": "idea-04",
                "name": "Kinetix Modular Click-Repair PowerVault",
                "problem_solved": "Solves frustration over non-recyclable power banks with sealed dead cells and damaged USB-C ports.",
                "target_audience": "Tech enthusiasts, sustainability advocates, and IT pros.",
                "supporting_comment_count": 31,
                "key_features": [
                    "Tool-less push-latch user-swappable 21700 lithium battery cells",
                    "Modular swappable USB-C port daughterboard",
                    "Real-time battery cycle health & thermals OLED display"
                ],
                "demand_level": "Niche",
                "feasibility_score": 88
            }
        ]

    async def summarize_comments(self, comments: List[str]) -> Dict[str, Any]:
        await asyncio.sleep(0.4)
        return {
            "summary": f"Analyzed {len(comments)} customer comments. Primary friction centers on battery longevity and physical clamping comfort, with high consumer enthusiasm for modularity and open-ear designs.",
            "top_positive_topics": ["Audio fidelity and broad soundstage", "Rapid fast-charging capabilities", "Solid metal build aesthetics"],
            "top_negative_topics": ["ANC pressure headaches", "Degraded battery endurance after 6 months", "App connectivity hiccups"],
            "sentiment_score": 68
        }
