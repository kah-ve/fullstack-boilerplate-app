# React + Flask + PostgreSQL in Docker Development Boilerplate

![My Image](https://github.com/kah-ve/react-flask-postgresql-in-docker-boilerplate/blob/master/app-preview.png)


This is boilerplate code and also a playground for a full stack app. I've hooked up code that communicates through react to flask and postgresql and back.

All you need to do to run this is fork then clone and build with

      docker-compose build
      
then run with
   
      docker-compose up

Then navigate on your browser to

      http://localhost:3000/

Here you will see a very basic react app that will be able to send some data as a request from react to flask and then from flask to the postgresql db. 

### PostgreSQL Commands

You can 

     docker exec -it [container id] bash 
 
to the postgres container (named postgres) and then run the command 
  
     psql -U postgres
  
This will open up a commandline within docker that looks like
  
     postgres=# ...
  
Here you can type commands such as \l to list databases, then \c to connect to a database, then \dt to list out the data tables within that database. Also you can execute normal SQL commands such as 
      
      "SELECT * FROM [table-name];" 
or 

      "CREATE TABLE IF NOT EXISTS [table-name] (name text, ......);"

### React (Client side)

For outputs from react, see the developer console, and the network tab to get an idea of what's going on.

The app currently is just for playing around with the communications between the different tiers. You can post and get which will communciate with flask, which will subsequently communicate with postgresql to then execute the respective commands.

### Flask (API side)

In the terminal that you ran

     docker-compose up
  
on, you can see the containers that are running and the outputs. I use this to see the outputs from a flask. 

Also

     docker exec -it [container id] bash

into the flask container (named api) and run the command

     tail -f apiLogs.log

This will give you a live output of the logs in a less cluttered fashion for the backend. 

--------------------------------------------------------
Below are notes from source repo that provided core boilerplate code for docker-compose.
[Link](https://github.com/shoyo/react-flask-docker-boilerplate)
--------------------------------------------------------

## Overview
Extremely lightweight development environment for a web application
running a [React](https://reactjs.org/) front-end and 
[Flask](http://flask.pocoo.org/) API back-end. The 
front-end connects to the back-end by making HTTP requests for
desired data. React and Flask are containerized and managed with 
[Docker Compose](https://docs.docker.com/compose/).

### Why Create React App?
[Create React App](https://facebook.github.io/create-react-app/) allows 
us to very easily *create a React app* with no build configuration. React is 
currently one of the most popular front-end Javascript libraries for 
building UIs.

### Why Flask?
Flask is a lightweight, highly-customizable micro-framework for Python. It let's
us build really simple web applications quickly ([the "hello world" app is literally 5 
lines of code](http://flask.pocoo.org/docs/1.0/quickstart/#a-minimal-application)).
Flask doesn't come built-in with much, and if you're looking to integrate a more 
robust back-end framework with React (say, Ruby on Rails), I'd recommend checking
out [this blog post](https://medium.com/superhighfives/a-top-shelf-web-stack-rails-5-api-activeadmin-create-react-app-de5481b7ec0b).

### Why Docker Compose?
[Docker](https://www.docker.com/) maintains software and all of its dependencies within a "container",
which can make collaborating and deploying simpler. [Docker Compose](https://docs.docker.com/compose/)
is a tool for easily managing applications running multiple Docker containers. 

## How to Use
Firstly, download [Docker desktop](https://www.docker.com/products/docker-desktop) and follow its
 instructions to install it. This allows us to start using Docker containers.
 
Create a local copy of this repository and run

    docker-compose build
    
This spins up Compose and builds a local development environment according to 
our specifications in [docker-compose.yml](docker-compose.yml). Keep in mind that 
this file contains settings for *development*, and not *production*.

After the containers have been built (this may take a few minutes), run

    docker-compose up
    
This one command boots up a local server for Flask (on port 5000)
and React (on port 3000). Head over to

    http://localhost:3000/ 
    
Finally, to gracefully stop running our local servers, you can run
 
    docker-compose down

in a separate terminal window or press __control + C__.


