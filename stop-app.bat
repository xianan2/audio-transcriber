@echo off
REM Stop and remove frontend and backend containers by name

docker stop audio-transcriber-frontend
docker rm audio-transcriber-frontend

docker stop audio-transcriber-backend
docker rm audio-transcriber-backend

echo Containers stopped and removed.
pause