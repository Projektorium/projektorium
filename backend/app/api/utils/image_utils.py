import os
from uuid import uuid4
from PIL import Image, UnidentifiedImageError
from app.core.config import ProfileImageSettings as IMG_SETTINGS
from fastapi import HTTPException, UploadFile


async def save_image(file: UploadFile) -> str:
    """
    Returns the generated filename of the image.
    """
    # Validate content-type
    if file.content_type not in IMG_SETTINGS.ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG and JPG are allowed.")

    data = await file.read()
    if len(data) > IMG_SETTINGS.MAX_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {IMG_SETTINGS.MAX_SIZE // (1024*1024)} MB.")

    # Validate file extension
    filename = file.filename or ""
    ext = os.path.splitext(filename)[-1].lower()
    if ext not in IMG_SETTINGS.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file extension. Only .png and .jpg are allowed.")

    # Generate unique filename
    unique_name = f"{uuid4().hex}{ext}"
    save_path = IMG_SETTINGS.UPLOAD_DIR / unique_name

    # Save to disk
    with open(save_path, "wb") as out_file:
        out_file.write(data)

    # Verify image integrity
    try:
        img = Image.open(save_path)
        img.verify()
    except UnidentifiedImageError:
        os.remove(save_path)
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

    return unique_name