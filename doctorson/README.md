# DoctorsOn — VS Code setup

## Requirements
- Python 3.10 or newer
- VS Code with the Python extension

## Run on Windows
1. Extract this ZIP.
2. Open the `doctorson` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

5. Open http://127.0.0.1:5000 in your browser.

If PowerShell blocks activation, use Command Prompt and run:
```bat
.venv\Scripts\activate.bat
```

Or simply double-click `run.bat` (it creates the virtual environment and installs Flask
the first time, then starts the app).

## Admin
- Open http://127.0.0.1:5000/admin/login
- Default password: `admin123`
- Change it before using this app with real users. In PowerShell, set it for the
  current terminal before starting:

```powershell
$env:DOCTORSON_ADMIN_PASSWORD="your-strong-password"
python app.py
```

## Data
The app creates `doctorson.db` in this folder on first run. Keep this file to
preserve your hospitals, doctors, schedules, medicines, and orders.

## Notes
- Keep the terminal running while you use the local app. Closing the terminal
  stops the server. For background/always-on hosting, deploy it to a server or
  configure a Windows service; this ZIP is for running locally in VS Code.
- The included sample records are fictional.
