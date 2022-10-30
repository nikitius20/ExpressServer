# ExpressServer
Test Case for Simga internship

#### Task 1.
Create a script that will embed into the site and receiving statistics about ad slots on the page

Full script, called `script.js` you can find in public folder.

Use the script you need to use [Requestly.io](app.requestly.io)
- Install [Requestly Chrome Extension](https://chrome.google.com/webstore/detail/redirect-url-modify-heade/mdnleldcmiljblolnjhpnblkcekpdkpa) 
-  Go to app.requestly.io, or open en extension 
- Click on 'New Rule' button and choose 'Insert Scripts'  
- Copy code from `script.js` file to code field and add a name to this rule
 - Or  you can choose 'Code Source>URL' and place a link to your script file, this will be possible after 2 Task
- Click on 'Create Rule' button

After this, a **Show Stats** will apear on websites. After clicking on this button window with statistics will apper on top of the site. To hide this window click on the same button again.  
Sometimes There is no GPT or Prebid.js libraries on the site. The script will show the information he can find.

#### Task 2.
Intercept the URL of all requests that were made via `fetch()` method and send them to the server

The idea of this task was to monkey patch the fetch method, and make that every time fetch happens, the info about request url will send to server and show on console.

Almost every website is not allowing this behavior due to violation of  the document's Content Security Policy. And its considered hacking. But some websites will allow this.

To start server you need to 
- `git clone` this repository on your PC
- Open terminal and write `npm install` 
- To run server on localhost use `npm run dev` command
- Or deploy this server to heroku 
 - `heroku login`
 - `heroku create` Visit app url it gives you & use commands from heroku 
 - `heroku git:remote -a {Here will be your custom link} `...
After your app is deployed use `heroku open` to open your app in browser
Or `heroku logs --tail` to see console of your deployed app

####And the last, the **MOST IMPORTANT STEP**
You have to change `const apiURL` in your first script in requestly. You can find in in 'useMonkeyPatching' function, line 250

After this, You can reload some pages, and see in console 
`Intercepted url - {url}`

From my experience in works in Gmail



### Developer thoughts

Working with prebid.js is very strange. Almost every website I tested has unique version of prebid.js. A couple of pbjs methods are not working. 
On one site i even saw pbjs object was called owpbjs. 
Also from +- 10 website i tested, the the bids was in 2 of them, and not always.. And 
usually it was only one bidder.


Also there is googletag. The documentation is not allways correct and working. For example i spend A LOT of time to figure out how to get ad slots from googletag object. 
And only by manual testing i find out that i have to use `.getSlots()` from `pubads()` method like this `googletag.pubads().getSlots()`
The googletag and pbjs usually have different amount of slots. And how to connect units from  pbjs and slots from googletag is not written anywhere.

8/10 for new interesting information
3/10 for development experience 
