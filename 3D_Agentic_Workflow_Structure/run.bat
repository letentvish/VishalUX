@echo off
cd /d "%~dp0futuristic-3d-representation-d"
echo Starting 3D Web Element Generator...
start http://localhost:5173
npm run dev
