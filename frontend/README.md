For my final project, I chose to build a message board application.  This app allows users to create accounts, and then post messages to the message board.  Users can delete messages they post.  

This project uses a MERN Stack.  It is hosted across three different cloud backed platforms.  The frontend is on Netlify, the backend on Render, and the database is on MongoDB cloud.  

The project features the ability for users to make posts to a messageboard.  The idea is that an organization would host an instance of the messageboard for their members or community.  
The setup process is relatively simple.  Each section can be loaded into a cloud backed provider or run on a local server.  Once this is done, change the API URL to be that of where the backend is hosted.  You may also have to adjust the CORS settings to make allow communication between the frontend and backend.  

The environment variables used are: the MongoDB URI, and the JWT_SECRET.  

I used GitHub Copilot Agent to debug the authentication portions as I wrote them.  I also used it to debug the issues that came up upon moving the app from the local machine to the cloud.  
