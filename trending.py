#!/usr/bin/env python3
"""
Script to update trending.json with the latest trending search terms.

This script uses the pytrends library (Google Trends API wrapper) to
fetch the current trending search terms for the United States and writes
them to the trending.json file in the same directory. The resulting
file is a JSON list of dictionaries with `topic`, `description` and
`link` keys. Descriptions and links can be enriched manually or by
other scripts.

Requirements:
  pip install pytrends

This script should be run periodically via GitHub Actions to keep
trending.json up to date.
"""

import json
from datetime import date

try:
    from pytrends.request import TrendReq
except ImportError:
    raise SystemExit("pytrends is required. Install with `pip install pytrends`.\n")


def fetch_trending_searches(region: str = 'united_states', limit: int = 10):
    """Fetches a list of trending search terms for the given region."""
    pytrends = TrendReq(hl='en-US', tz=360)
    try:
        trending = pytrends.trending_searches(pn=region)
    except Exception as exc:
        raise RuntimeError(f"Failed to fetch trending searches: {exc}")
    # Return the top `limit` searches
    return trending.head(limit).tolist()


def main():
    region = 'united_states'
    limit = 10
    keywords = fetch_trending_searches(region=region, limit=limit)
    # Build list of topic dictionaries
    topics = []
    for kw in keywords:
        topics.append({
            "topic": kw,
            "description": "",
            "link": ""
        })
    # Write to trending.json
    with open('trending.json', 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2, ensure_ascii=False)
    print(f"Updated trending.json with {len(topics)} topics on {date.today()}")


if __name__ == '__main__':
    main()
