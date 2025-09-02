git add .
git commit -m 'tproxy'
git push

git tag
git tag v1.0
git push origin v1.0
git tag -d v1.0
git push origin :refs/tags/v1.0