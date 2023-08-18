# EasyTrip
Service Design and Engineering project - A RESTful service that can help you plan a trip

## Features
* OAuth2 authentication: you can register and log-in withyour Google account
* PointSearch: you can search for weather, POI andbike sharing info in a certain place
* PathSearch: you can search for the information above but along a chosen path to go from city A to city B


## Server
### Dependecies intallation
```
npm install
```
### Server start
```
npm start
```

## Docker execution
Move the `docker-compose.yml` file out of the `EasyTrip` folder
Create the following structure:
 - `docker-compose.yml`
 - `EasyTrip` (the folder containing the code of the server)
 - `EasyTripGUI` (the folder containing the code relative to the angular project)

Execute the command:
```
docker-compose up --build
```
