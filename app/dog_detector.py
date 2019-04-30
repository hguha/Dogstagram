from keras.applications.mobilenet import MobileNet
from keras.preprocessing import image
from keras.applications.mobilenet import preprocess_input, decode_predictions
import numpy as np
from keras import backend as K

def is_dog(img_path):
	K.clear_session()
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    model = MobileNet(weights='imagenet')

    preds = model.predict(x)
    preds = decode_predictions(preds, top=1)[0][0]
    print(preds)
    label = int(preds[0][2:])

    return 2085620 <= label and label <= 2113978


