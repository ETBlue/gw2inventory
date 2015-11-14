git checkout gh-pages
git merge master
git add .
git commit -m 'deploy'
git pull
git push
git checkout master
