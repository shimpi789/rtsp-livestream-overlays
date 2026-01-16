from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)


app.config["MONGO_URI"] = (
    "mongodb+srv://overlayUser2:shimpi123@cluster0.i1pw39x.mongodb.net/"
    "overlay_db?retryWrites=true&w=majority"
)

mongo = PyMongo(app)


#  Lazy getter to avoid Flask debug reload issues
def get_overlays_collection():
    return mongo.db.overlays


@app.route("/")
def health():
    return "Backend is running"



# -------------------------
# CREATE overlay
# -------------------------
@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    data = request.json

    overlay = {
        "type": data.get("type"),        # text / image
        "content": data.get("content"),  # string or image URL
        "x": data.get("x"),
        "y": data.get("y"),
        "width": data.get("width"),
        "height": data.get("height"),
    }

    result = get_overlays_collection().insert_one(overlay)
    overlay["_id"] = str(result.inserted_id)

    return jsonify(overlay), 201


# -------------------------
# READ all overlays
# -------------------------
@app.route("/api/overlays", methods=["GET"])
def get_overlays():
    overlays = []

    for overlay in get_overlays_collection().find():
        overlay["_id"] = str(overlay["_id"])
        overlays.append(overlay)

    return jsonify(overlays), 200


# -------------------------
# UPDATE overlay
# -------------------------
@app.route("/api/overlays/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.json

    get_overlays_collection().update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "x": data.get("x"),
            "y": data.get("y"),
            "width": data.get("width"),
            "height": data.get("height"),
            "content": data.get("content"),
        }}
    )

    return jsonify({"message": "Overlay updated"}), 200


# -------------------------
# DELETE overlay
# -------------------------
@app.route("/api/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    get_overlays_collection().delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Overlay deleted"}), 200


# -------------------------
# APP ENTRY POINT
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)
