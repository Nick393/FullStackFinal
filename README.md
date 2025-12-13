For my final project, I chose to build a message board application.  This app allows users to create accounts, and then post messages to the message board.  Users can delete messages they post.  


This project uses a MERN Stack.  It is hosted across three different cloud backed platforms.  The frontend is on Netlify, the backend on Render, and the database is on MongoDB cloud.  

The project features the ability for users to make posts to a messageboard.  The idea is that an organization would host an instance of the messageboard for their members or community.  
The setup process is relatively simple.  Each section can be loaded into a cloud backed provider or run on a local server.  Once this is done, change the API URL to be that of where the backend is hosted.  You may also have to adjust the CORS settings to make allow communication between the frontend and backend.  

My advanced feature is the authentication.  

Screenshots:
~/"message board.png"
~/sign-in.png

The environment variables used are: the MongoDB URI, and the JWT_SECRET.  

I used GitHub Copilot Agent to debug the authentication portions as I wrote them.  I also used it to debug the issues that came up upon moving the app from the local machine to the cloud.  

Frontend:netlify
backend:Render
Video Link: https://drive.google.com/file/d/1lI84M1DliQ_XHyGKnkc9mY-4g4pY_8hk/view?usp=sharing

Reflection:
1. The hardest parts of the project were setting up the authentication, the delete, and update systems.  These required extensive debugging to get them to work.  
2. I am most proud of the authentication system.  I am passionate about cybersecurity, so I wanted to do the authentication feature.  
3.  I would start earlier, rather than cramming at the end, as that would make debugging less stressful (especially in regards to getting the app to work on the hosting providers).
4. It was suggested to allow users to edit messages at the check-in gallery.  I was only at the check in gallery for part of it unfortunately due to having an exam immediately prior.  

AI: 
I used Claude Code and Github Copilot Agent to debug code.  I used Copilot to debug the authentication system as I was building it and used Claude code to debug the edit function. 
I used the copilot autcomplete functionality throughout the process.  