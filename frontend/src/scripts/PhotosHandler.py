from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return 'No photo part in the request', 400

    file = request.files['photo']

    if file.filename == '':
        return 'No selected file', 400

    if file:
#         UPLOAD_FOLDER = 'public/' + request.form.get('userEmail')
        UPLOAD_FOLDER = '../../public/' + request.form.get('userEmail')
        app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

        # Ensure the upload folder exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Secure the filename to avoid unsafe characters or paths
        filename = secure_filename(file.filename)
        # Save the file to the uploads folder
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        print(filename)
        return 'Photo uploaded successfully', 200

@app.route('/delete-photo', methods=['DELETE'])
def delete_photo():
    # Extract userEmail and photoName from the request parameters
    user_email = request.form.get('userEmail')
    photo_name = request.form.get('photo')

    if not user_email or not photo_name:
        return 'Missing userEmail or photoName', 400

    # Define the directory path based on userEmail
    upload_folder = 'public/' + user_email

    # Secure the filename
    filename = secure_filename(photo_name)

    # Construct the full path to the photo
    photo_path = os.path.join(upload_folder, filename)

    # Check if the file exists and delete it
    if os.path.exists(photo_path):
        os.remove(photo_path)
        return 'Photo deleted successfully', 200
    else:
        return 'Photo not found', 404

if __name__ == '__main__':
    app.run(debug=True)
