#!/bin/bash
pwd=`pwd`

cd "${BASH_SOURCE%/*}" || exit

node ./generate-data.js

cd ..
echo "Trying to start node."
# expect the server js file to be in the parent directory of this script
# run the serverr
PORT=1234 node ./server.js &
NODE_PID=$!

echo "Waiting on node to start up..."
# give node some time to start up
sleep 1
printf '.'
sleep 1
printf '.'
sleep 1
printf '.'
echo



echo "Trying to save screenshot."
# the phantomjs script should be in the same directory as this bash script
cd "${BASH_SOURCE%/*}"
phantomjs ./generate-screenshot.js && cd .. && echo "Saved screenshot to $(pwd)/screenshot.png"

kill $!
