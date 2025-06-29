# audio-transcriber
Audio transcriber that accepts audio files, performs transcription, and saves results in the database

## Environment Set-Up
This application is containerised using Docker, requiring **Docker Desktop** to be installed **and running** in the system before running this application.

Please refer to **[Docker Installation Guide.md](./Docker%20Installation%20Guide.md)** for instructions to install Docker.

**This application has only been tested in Windows Operating System and asssumes the user is using Windows**

## Application Start-up
Once docker is running on your system, **click on [`start-app.bat`](./start-app.bat)** to start the Audio Transcriber web application. The batch script will open **http://localhost:3000/** in your default browser.

Windows Defender may raise an Unknown Publisher warning when running the various .bat scripts, simply click on **More Info** then **Run Anyway**.

### Ports
The application uses **port 5000 for backend** and **port 3000 for frontend**. Please ensure that the two ports are **not being used**. This can be verified by:

```cmd
netstat -ano | findstr :<PORT_NUMBER>
```
Where `<PORT_NUMBER>` would be **5000** and **3000**. There should not be anything returned. If there are processes that are currently using the ports, note down the **PID** of the process and run the following:

```cmd
taskkill /PID <PID> /F
```

For instance, if the PID is 1234, then run `taskkill /PID 1234 /F`

## Test Scripts
The test scripts for both frontend and backend have also been containerised and can be run by clicking on the **[`run-all-tests.bat`](./run-all-tests.bat)** script. 

If you would like to run the tests for backend and frontend separately, you can do so in the **root directory** (`/audio-transcriptions`) of the project by running the following commands:

- To run **backend tests**:

  ```cmd
  docker compose build backend-test

  docker compose run --rm backend-test
  ```

- To run **frontend tests**:

  ```cmd
  docker compose build frontend-test

  docker compose run --rm frontend-test
  ```

**Make sure you are in the same directory as the `docker-compose.yml` file when running these commands.**

### Stopping Docker services
You can stop the docker services by **clicking on [`stop-app.bat`](./stop-app.bat)** to stop and remove the docker containers