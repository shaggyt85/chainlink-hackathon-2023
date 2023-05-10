from flask import Flask
from os import getenv
from requests import get

from config import PRICE_FEEDS

app = Flask(__name__)


@app.route("/products/<id>")
def get_product_price(id: str):
    prices = []
    for feed in PRICE_FEEDS:
        request = get(f"{feed}/{id}")
        if request.status_code == 200:
            price = request.json()["price"]
            if price > 0:
                prices.append(price)
    if len(prices) == 0:
        return { "price": 0}
    return { "price": sum(prices)/len(prices)}


@app.route("/products")
def get_products():
    products = []
    request = get(f"{PRICE_FEEDS[0]}")
    if request.status_code == 200:
        product = request.json()
        products.append(product)
    return products