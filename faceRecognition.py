import random
import vonage
import cv2
import os
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb+srv://Bharath_Narayanan:bharath22@cluster0.16bef1g.mongodb.net/voting_system'
mongo = PyMongo(app)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


recognizer = cv2.face.LBPHFaceRecognizer_create()


dataset_dir = 'face_dataset'
if not os.path.exists(dataset_dir):
    os.makedirs(dataset_dir)


otp_storage = {}

def generate_otp(length=6):
    """Generate a random OTP of specified length."""
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

def send_otp(mobile_number, otp):
    """Send OTP to a mobile number using Nexmo (Vonage API)."""
    client = vonage.Client(key="e1b9f4de", secret="UPGbSk8CLnssResQ")
    sms = vonage.Sms(client)
    
    responseData = sms.send_message({
        "from": "Vonage APIs",
        "to": mobile_number,
        'text': f'Your OTP is {otp}',
    })

    if responseData["messages"][0]["status"] == "0":
        print(f"Message sent successfully to {mobile_number}.")
    else:
        print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

def verify_otp(mobile_number, entered_otp):
    """Verify the OTP entered by the user."""
    if mobile_number in otp_storage and otp_storage[mobile_number] == entered_otp:
        print("OTP verification successful!")
        del otp_storage[mobile_number]
        return True
    else:
        print("OTP verification failed!")
        return False
    
from bson import ObjectId

@app.route('/capture', methods=['POST'])
def capture_face():
    data = request.get_json()
    name = data['name']
    image_data_list = data['image']
    mobile_number = data['mobile_number']
    region_id_str = data['regionId']
    gender = data.get('gender')
    marital_status = data.get('maritalStatus')
    dateOfBirth = data.get('dateOfBirth')
    print(marital_status)
    print(gender)

    # Handle spouse name or parents' names based on marital status
    if marital_status == "married":
        spouse_name = data.get('spouseName')
        if gender == "male" and not spouse_name:
            return jsonify({"error": "Wife's name is required for married males"}), 400
        if gender == "female" and not spouse_name:
            return jsonify({"error": "Husband's name is required for married females"}), 400
    elif marital_status == "unmarried":
        father_name = data.get('fatherName')
        print(father_name)
        mother_name = data.get('motherName')
        print(mother_name)
        if not father_name or not mother_name:
            return jsonify({"error": "Both father's and mother's names are required if unmarried"}), 400

    try:
        regionId = ObjectId(region_id_str)
    except Exception as e:
        return jsonify({"error": "Invalid regionId format"}), 400

    label_dir = os.path.join(dataset_dir, name)
    if not os.path.exists(label_dir):
        os.makedirs(label_dir)

    count = len(os.listdir(label_dir))
    image_paths = []
    upserted_id_set = False  

    for image_data in image_data_list:
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        for (x, y, w, h) in faces:
            face = gray[y:y+h, x:x+w]
            resized_face = cv2.resize(face, (100, 100))
            file_name_path = os.path.join(label_dir, f'{count}.jpg')
            cv2.imwrite(file_name_path, resized_face)
            image_paths.append(file_name_path)

            result = mongo.db.faces.update_one(
                {'label': name},
                {
                    '$setOnInsert': {
                        'hasVoted': False,
                        'mobile_number': mobile_number,
                        'regionId': regionId,
                        'gender': gender,
                        'maritalStatus': marital_status,
                        'spouseName': spouse_name if marital_status == "married" else None,
                        'fatherName': father_name if marital_status == "unmarried" else None,
                        'motherName': mother_name if marital_status == "unmarried" else None,
                        'dateOfBirth':dateOfBirth
                    },
                    '$push': {'imagePaths': file_name_path}
                },
                upsert=True
            )

            if result.upserted_id is not None:
                print(f"New voter inserted: {result.upserted_id}")
                id = result.upserted_id
                print(id)
                upserted_id_set = True
            count += 1

    if upserted_id_set:
        mongo.db.regions.update_one(
            {'_id': regionId},
            {'$push': {'voters': id}},
            upsert=True
        )

    return jsonify({"message": "Images captured and stored successfully"}), 200

@app.route('/send-otp', methods=['POST'])
def send_otp_route():
    data = request.get_json()
    mobile_number = data.get('mobile')
    
    if mobile_number:
        otp = generate_otp()
        otp_storage[mobile_number] = otp
        send_otp(mobile_number, otp)
        return jsonify({"success": True, "message": "OTP sent successfully"}), 200
    return jsonify({"success": False, "message": "Failed to send OTP"}), 400

@app.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.get_json()
    mobile_number = data.get('mobile')
    entered_otp = data.get('otp')
    
    if verify_otp(mobile_number, entered_otp):
        return jsonify({"success": True, "message": "OTP verification successful"}), 200
    return jsonify({"success": False, "message": "OTP verification failed"}), 400

@app.route('/recognize', methods=['POST'])
def recognize_face():
    data = request.get_json()
    
    image_data = data.get('image', '')
    region_id_str = data.get('regionId', '')
    # mobile_number = data.get('mobile_number')
    # print(mobile_number)

    try:
        regionId = ObjectId(region_id_str)
    except Exception as e:
        return jsonify({"error": "Invalid regionId format"}), 400
    
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Image decoding failed"}), 400

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        return jsonify({"error": "No face detected"}), 400

    face_data = []
    labels = []
    names = []

    users = mongo.db.faces.find()
    for user in users:
        for image_path in user['imagePaths']:
            image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if image is not None:
                face_data.append(image)
                labels.append(len(names))
                names.append(user['label'])

    if len(face_data) == 0:
        return jsonify({"error": "No training data available"}), 400

    recognizer.train(face_data, np.array(labels))

    recognized_name = None
    confidence = None

    for (x, y, w, h) in faces:
        face = gray[y:y+h, x:x+w]
        resized_face = cv2.resize(face, (100, 100))
        label, confidence = recognizer.predict(resized_face)
        recognized_name = names[label]
        break

    if recognized_name:
        user = mongo.db.faces.find_one({"label": recognized_name})
        if user:
            if user.get('hasVoted', False):
                return jsonify({"name": recognized_name, "message": "Already voted", "confidence": confidence}), 200
            elif user.get('regionId') != regionId:
                return jsonify({"name": recognized_name, "message": "Region mismatch", "confidence": confidence}), 200
            else:
                mobile_number = user.get('mobile_number')
                otp = generate_otp()
                otp_storage[mobile_number] = otp
                send_otp(mobile_number, otp)

                mongo.db.faces.update_one(
                    {"label": recognized_name},
                    {"$set": {"hasVoted": True}}
                )


                return jsonify({
                    "name": recognized_name,
                    "id": user.get('id'),
                    "message": "Verification successful. OTP sent.",
                    "confidence": confidence,
                    "mobileNumber": mobile_number
                }), 200

    return jsonify({"error": "Face not recognized"}), 400

if __name__ == "__main__":
    app.run(debug=True)