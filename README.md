# audio-transcriber
Audio transciber that accepts audio files, performs transcription and saves result in database

## Environemt Set-Up
This application is containerised using Docker, requiring **Docker Desktop** to be installed in the system before running this application.

Please refer to **Docker Installation Guide.md** to install Docker.

## Application Start-up
Once docker is running on your system, **click on `start-app.bat`** to start the Audio Transcriber web application. The batch script will open **http://localhost:3000/** in your default browser.

### Ports
The application uses **port 5000 for backend** and **port 3000 for frontend**. Please ensure that the two ports are **not being used**. This can be verified by:
```
netstat -ano | findstr :<PortNumber>
```
Where `<PortNumber>` would be **5000** and **3000**. There should not be anything returned. If there are processes that are currently using the ports, note down the **PID** of the process and run the following:
```
taskkill /PID <PID> /F
```
So if the PID is 1234, then run `taskkill /PID 1234 /F`

## Test Scripts
The test scripts for both frontend and backend has also been containerised and can be run by clicking on **`run-all-tests.bat`** script. 

If you would like to run the tests for backend and frontend separately, you can do so in the **root directory** (*/audio-transcriptions) of the project by running the following commands:

- To run **backend tests**:
  ```sh
  docker compose build backend-test

  docker compose run --rm backend-test
  ```

- To run **frontend tests**:
  ```sh
  docker compose build frontend-test

  docker compose run --rm frontend-test
  ```

**Make sure you are in the same directory as the `docker-compose.yml` file when running these commands.**