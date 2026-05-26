@echo off
title Lanzador Proyecto Cobranza
start cmd /k "cd /d %~dp0backend && npm run dev"
start cmd /k "cd /d %~dp0frontend && npm start"

exit