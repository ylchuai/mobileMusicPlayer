@echo off
for /f "delims=" %%i in ('dir /s/b/a *.jpg *.gif *.bmp ') do (
attrib -h -r -s "%%~i"
)
exit