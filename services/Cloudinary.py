import cloudinary
import cloudinary.uploader
import cloudinary.api
import json

cloudinary.config(
  cloud_name    = "dqwxhaku0",
  api_key       = "256136413469276",
  api_secret    = "rOCXAVpd_xLFL3kOhQlA0QvjLgw"
)

def upload_image(path_or_base_64):
    try:
        response = cloudinary.uploader.upload(path_or_base_64)
        return response["secure_url"]

    except Exception as e:
        print e
        return False
