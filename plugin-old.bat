call node "info.js"
call npm run "build"
call npm run "plugin-zip"

rem NAZWA WTYCZKI
SET plugin=wafelmedia-deklaracja-dostepnosci

SET path=c:\wamp64\www\wafelmedia-plugins

rmdir "%path%\%plugin%" /s /q
mkdir "%path%\%plugin%"

@REM C:\Windows\System32\robocopy.exe "./languages" "%path%/%plugin%/languages/" *.* /s
@REM C:\Windows\System32\robocopy.exe "./include" "%path%/%plugin%/include/" *.* /s


"C:\Program Files\7-Zip\7z.exe" x %plugin%.zip -o%path%\%plugin%
"C:\Program Files\7-Zip\7z.exe" a %path%\%plugin%\%plugin%.zip %path%\%plugin%\ -sdel

copy "info.json" %path%\%plugin%\