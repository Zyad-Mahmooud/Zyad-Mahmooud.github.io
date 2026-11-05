#!/bin/bash

git add .

git checkout --orphan fresh-main

git add -A
git commit -m "Initial deployment"

git branch -D main
git branch -m main

git push origin main --force

echo "Published 🚀"