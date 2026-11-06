
#!/bin/bash

BRANCH="update-$(date +%Y%m%d-%H%M%S)"

git checkout --orphan "$BRANCH"

git add -A
git commit -m "Deployment $BRANCH"

git push -u origin "$BRANCH"

echo "Published 🚀"
