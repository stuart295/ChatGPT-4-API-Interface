@echo off
echo Activating virtual environment...

REM Activate the virtual environment
call venv\Scripts\activate.bat

echo Starting Flask app...

REM Set the app file name
set FLASK_APP=app.py

REM Run the app
flask run

REM Deactivate the virtual environment
deactivate
