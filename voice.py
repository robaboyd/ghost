# -*- coding: utf-8 -*-
from threading import Thread
from datetime import date
from fuzzywuzzy import process
from getFace import classify_face
import speech_recognition as sr
import sys
import os
import time
import cv2
import numpy as np
from PIL import Image
import pickle
import pyttsx3
import sched
import requests
import random
import json
import threading
import re

listening = False
hueOfLight = 41770
# face rec stuff
face_cascade = cv2.CascadeClassifier(
    'cascades/data/haarcascade_frontalface_alt2.xml')
glasses_cascade = cv2.CascadeClassifier(
    'cascades/data/haarcascade_eye_tree_eyeglasses.xml')
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("./recognizers/face-trainner.yml")
labels = {}
with open("pickles/face-labels.pickle", 'rb') as f:
    labels = pickle.load(f)
    labels = {v: k for k, v in labels.items()}

val = 1

s = sched.scheduler(time.time, time.sleep)

resp = requests.get('https://discovery.meethue.com/')

for ip in resp.json():
    ipAddress = ip['internalipaddress']

lightsAll = requests.get(
    'http://%s/api/pf3enyrZJz4uvwgYf90t9E2FzLM4tW2GeGSnO-ut/lights' % ipAddress)


def omegaSpeak(text):
    """Text to Speech ie. Omegas Voice"""
    print('🤖 %s' % text)
    omega.say(text)
    omega.runAndWait()


def omegaTaskCompleted(user):
    """Random response for when a task is completed"""
    # possible responses
    val = ''
    # priant 1 random number in the range of 1 and 2
    for x in range(1):
        val = random.randint(1, 2)
    if val == 1:
        omegaSpeak('ok, done')
    if val == 2:
        omegaSpeak('That has finished %s' % user)


def omegaCommands(command):
    """Send a command to Omega"""
    names = readNamesFromFile()
    print('🐺 %s' % command)
    # All of the commands
    if command == 'omega':
        # If the trigger word is said
        omegaSpeak('Yes %s' % names)
    if 'shutdown' in command or 'shut down' in command:
        omegaSpeak("ok, closing")
        lights('tv lightstrip', 'done listening', '', '')
        close()
    if 'what is the date' in command:
        omegaSpeak('One second %s ' % names)
        today = str(date.today())
        lights('tv lightstrip', 'done listening', '', '')
        omegaSpeak(today)
    if 'new user' in command:
        if os.path.exists('newUser.mp3'):
            playsound('newUser.mp3')
            takePic()
        else:
            takePic()
    if 'hello' in command:
        omegaSpeak('Hello %s' % names)
        lights('tv lightstrip', 'done listening', '', '')
    if 'what is my name' in command:
        if names == '':
            omegaSpeak('I cannot see you')
            lights('tv lightstrip', 'done listening', '', '')
        elif names == 'no user':
            omegaSpeak('I cannot see you')
            lights('tv lightstrip', 'done listening', '', '')
        else:
            omegaSpeak('You are %s' % names)
            lights('tv lightstrip', 'done listening', '', '')
    if 'turn off' in command:
        omegaSpeak('One second %s ' % names)
        lights(command, 'off', names, False)
        lights('tv lightstrip', 'done listening', '', '')
    if 'turn on' in command:
        omegaSpeak('One second %s ' % names)
        lights(command, 'on', names, False)
        lights('tv lightstrip', 'done listening', '', '')
    if 'set the' in command:
        omegaSpeak('One second %s ' % names)
        getInt = re.findall(r'\d+', command)
        percentage = (int(getInt[0]) / 100)
        percentageConverted = (254 * percentage)
        lights(command, 'bri', names, int(percentageConverted))
        lights('tv lightstrip', 'done listening', '', '')
    # make the listening var global
    global listening
    # make the listening var global
    listening = False

# command is the command given
# state is off or on
# user is omega tries to get the user that it sees


def lights(command, state, user, num):
    '''
    Hue lights control, sends requests to the Hue api
        command = the command that was givenf
        state = on or off
        user is the user that Omega sees
        num is for brightness
    '''
    hueLights = []
    global hueOfLight
    global resp
    global ipAddress
    global lightsAll
    print('💡')
    for i in lightsAll.json():
        hueLights.append(
            {'index': i, 'name': '{}' .format(lightsAll.json()[i]['name'])})
    # fuzzy search for best matching light name
    finalLight = process.extractOne(command, hueLights)
    #hueOfLight = finalLight[0]['hue']
    # print(hueOfLight)
    # set state of light
    if state == 'on':
        payload = " {\"on\":true}"
    elif state == 'off':
        payload = " {\"on\":false}"
    elif state == 'bri':
        payload = "{\"bri\":" + str(num) + "} "
    elif state == 'listening':
        payload = " {\"hue\":0}"
    elif state == 'done listening':
        payload = "{\"hue\":" + str(hueOfLight)+"} "
    # turn the lights on and of
    requests.put(
        'http://%s/api/pf3enyrZJz4uvwgYf90t9E2FzLM4tW2GeGSnO-ut/lights/%s/state' % (ipAddress, finalLight[0]['index']), data=payload)
    print('💡 done')


def listenForKeyword(recognizer, audio):
    """Listen for the users speech and listen for the trigger word"""
    global listening
    try:
        keyword = r.recognize_google(audio)

        if keyword.lower() == 'omega':
            # If the user just said the trigger word, set listening to true
            print(' 🤖 Listening...')
            listening = True
            # send lights to flash when listening
            lights("tv lightstrip", "listening", "", "")
        if 'omega' in keyword.lower() and len(keyword) > 5:
            # if omega is included in the sentence
            # ie. "Omega turn off the light"
            omegaCommands(keyword.lower())

        elif listening == True:
            omegaCommands(keyword.lower())

    except SystemExit:
        sys.exit()
    except Exception as e:
        print(' 💩 %s' % e)


omega = pyttsx3.init()
r = sr.Recognizer()
with sr.Microphone() as source:
    r.adjust_for_ambient_noise(source)
    r.dynamic_energy_threshold = False
audio = r.listen_in_background(source, listenForKeyword)
print(' 🤖 Running... ')
lights('tv lightstrip', 'on', '', '')


def takePic():
    """Take a picture if Omega sees a face"""
    return
    # camera = cv2.VideoCapture(0)
    # while True:

    #     return_value, frame = camera.read()
    #     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    #     faces = face_cascade.detectMultiScale(
    #         gray, scaleFactor=2.0, minNeighbors=2)

    #     for(x, y, w, h) in faces:
    #         roi_gray = gray[y:y+h, x:x+w]

    #         roi_color = frame[y:y+h, x:x+w]

    #         id_, conf = recognizer.predict(roi_gray)

    #         # if x > 0:  # if there is a face in the camera
    #         #     cv2.imwrite('user.jpg', frame)  # write and image

    #     # cv2.imshow('image', frame)  # this shows the vid camera
    #     if cv2.waitKey(1) & 0xFF == ord('q'):
    #         cv2.destroyAllWindows()
    #         break
    # camera.release()
    # cv2.destroyAllWindows()


def recognizeUser():
    '''
    This function sees if there are any users in the user.jpg image and
    writes the names to person.txt
    '''
    if os.path.exists("user.jpg"):
        names = classify_face("user.jpg")
        s = ' and '
        s = s.join(names)

        # write names to file
        data = {}
        data['people'] = s
        with open('person.txt', 'w') as outfile:
            json.dump(data, outfile)
    else:
        return


def readNamesFromFile():
    '''
    Gets the users names from person.txt
    '''
    with open('person.txt') as json_file:
        data = json.load(json_file)
        return data["people"]


def close():
    os._exit(0)


while True:
    takePic()


# user recognition process

# takePic() runs everytime a face is recognized > every 15 seconds recognizeUser() this writes the names to person.txt > everytime a command is called readNamesFromFile() which gets the name from the file
