import * as restify from "restify";
import { RequestHandler, Server } from "restify";
import { HttpServer } from "./httpServer";
import { CONTROLLERS } from "../controllers";

export class ApiServer implements HttpServer {
  private restify: Server;

  public get(url: string, requestHandler: RequestHandler): any {
    this.addRoute("get", url, requestHandler);
  }
  public post(url: string, requestHandler: RequestHandler): any {
    this.addRoute("post", url, requestHandler);
  }
  public put(url: string, requestHandler: RequestHandler): any {
    this.addRoute("put", url, requestHandler);
  }
  public del(url: string, requestHandler: RequestHandler): any {
    this.addRoute("del", url, requestHandler);
  }

  private addRoute(
    method: "get" | "post" | "put" | "del",
    url: string,
    requestHandler: RequestHandler
  ) {
    this.restify[method](url, async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      } catch (e) {
        console.error(e);
        res.send(500, e);
      }
    });

    console.log(`Aded route ${method.toUpperCase()}: ${url}`);
  }

  public start(port: number): any {
    this.restify = restify.createServer();
    this.restify.use(restify.plugins.bodyParser());
    this.restify.use(restify.plugins.queryParser());

    CONTROLLERS.forEach(controller => controller.initialize(this));

    this.restify.listen(port, () =>
      console.log(`Server is up and running on port ${port}`)
    );
  }
}
