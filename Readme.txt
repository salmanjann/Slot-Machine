INSTRUCTIONS FOR RUNNING AND TWEAKING THE SLOT MACHINE.

You are provided with a zip folder containing different sub folders and files including this file.

To run the slot machine, you just have to open the 'index.html' file in any browser.

The slot machine will run on mouse click if on PC, and on touch of screen in mobile devices.

You have to paste your win images for Games category in Games folder, and you've to rename them from 1-N (N being the number of pictures in the folder), pictures must be of '.png' type, otherwise no image will be dispalyed, same for price category and movies category, movies must be in '.mp4' format, otherwise movies won't play.

If you want a different timer, replace the 'timer' video in main folder with your own timer video and rename the video file to 'timer' (video must be in .mp4 format).

After all these settings now you've to tweak some variables in the 'script.js' file, if you have any code editor open the 'script.js' file in that code editor otherwise open the 'script.js' file in notepad.

Once you opened the 'script.js' file you'll see the heading of 'THINGS YOU WILL CONFIGURE', here you've to configure things according to your preference's.

'eventTimeInMins', this indicate the time in minutes of the event. This will be effective from when the program is opened in browser, once this time is finished, the slot machine will still work but there will be no wins. 

'nGameWins' this indicates the no of Game wins you want in the given time frame.

'nPriceWins' this indicates the no of Price wins you want in the given time frame.

'nMovieWins' this indicates the no of Movie wins you want in the given time frame.

'nGames' this indicates the no of pictures in the 'Games' folder, once the pictures in the 'Games' folder are finished, they'll start back from '1'.

'nPrices' this indicates the no of pictures in the 'Prices' folder, once the pictures in the 'Prices' folder are finished, they'll start back from '1'.

'nMovies' this indicates the no of pictures in the 'Movies' folder, once the pictures in the 'Movies' folder are finished, they'll start back from '1'.

'pauseTime' this indicates the time in seconds for which the slot machine will be paused before getting resetted (if there was not win on that run) or before the timer starts (if there was a win on that run).

'winProbability' (in percentage) this is the most important variable, this indicates the chance of getting a win on each spin, for example if the value for this is '10'(default), there will be 10% chance of getting a win on each spin, and if the value is '100', this will guarntee that every spin of slot machine results in a win.

'imageDisplayTime' (in minutes) this is the time for which the image(if there is a win) will be dispalyed before getting to the original slot machine.

'maxVideoTime' (in minutes) this indicates the time length of the longest movie in movies folder.

'IMPORTATN NOTE'

WHY I NEED LAST VARIABLES?
My logic of genearting exact number of wins is as follows.
let's say I've 3 wins remaining for game category, 2 wins remaining for price category and 1 win remaining for movie category. I'll calculate the time to execute all this wins and compare it to the time in remaining in the given time frame. If time remaining is less than total time to execute all wins, it will force the spin to be a win.

For the above scenario, let's assume a imageDisplayTime of 1 minute, and maxVideoTime of 2 minutes. For a single win in Game category I'll require '15s' for the slot machine animation plus the 'pauseTime' plus the 'timer'(time in seconds when timer runs) and 'imageDisplayTime' to execute a single win. Assuming pauseTime of 5s and timer time to be 15s and imageDisplayTime of 1min, we'll need 15+5+15+60 = 95s to execute a single win of this category, and 3*95 = 285s to execute all wins of this category and same for price category(Assuming 2 wins remaining, it'll take 190s to execute all wins), for the movie category it'll use 'maxVideoTime' instead of 'imageDisplayTime'(Assuming 1 win remaining for this category it'll take 35+120 = 155s to execute the win). So the minimum time for the event('eventTimeInMins') must be greater than or equal to 285s+190s+155s = 630s, that is 10.5 minutes to execute all the wins.


---------- I HOPE THIS DOCUMENT HELPS IN UNDERSTANDING AND TWEAKING EVERYTHING, AND IF STILL YOU NEED ANY HELP, JUST DROP A MESSAGE AND I'LL HELP YOU OUT ----------------