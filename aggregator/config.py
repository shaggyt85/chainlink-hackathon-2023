from os import getenv

PRICE_FEEDS = getenv("PRICE_FEEDS"," http://localhost:3000/products").split(",")