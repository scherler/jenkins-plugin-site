# ln -s `pwd`/pre-push.sh .git/hooks/pre-push
npm run integrity
RESULT=$?
[ $RESULT -ne 0 ] && exit 1
exit 0
