import "reflect-metadata";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { connect, set } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT } from "@config";
import { dbConnection } from "@database";
import { Routes } from "@interfaces/routes.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
 import { readFileSync } from 'fs';
import * as path from 'path';
import { createServer } from "https";
export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: any;
  public io: any;
  public http: any;
  public httpServer : any;
  
  
  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 5000;
    this.app.set('port', this.port);
   
    this.httpServer = createServer({
        key: readFileSync(path.join(__dirname, "ssl/privkey.pem")),
        cert: readFileSync(path.join(__dirname, "ssl/cert.pem")),
        ca: readFileSync(path.join(__dirname, "ssl/chain.pem"))
    }, this.app );

    this.http = require('http').Server(this.app);

    this.connectToDatabase();
    this.initializeSwagger();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.app.use(helmet());
  }
 
  public async listen() {
    const server = this.http.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    })
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    if (this.env !== "production") set("debug", true);
    await connect(dbConnection.url);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: "*", credentials: false }));
    this.app.use(hpp());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.disable('x-powered-by');
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/api/v1", route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description: "Example docs",
        },
      },
      apis: ["swagger.yaml"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    this.app.get("/ping", (req, res) => {
      return res.status(200).send('pong');
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}

// const io = require('socket.io')(this.http,{
    //   cors: { origin: '*' }
    // });

  //   io.on('connect', (socket) => {
  //     socketController(socket)
  //     this.app.set('socketio', socket);
  // })