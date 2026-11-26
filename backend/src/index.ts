import app from "./web/app";
import { ServerBootStrap as ServerBootstrap } from './bootsrap/server.bootstrap';
import { connectDB } from "./shared/config/data-base";

const serverBootstrap = new ServerBootstrap(app);
(async ()=>{
    try {
        await connectDB();
        await serverBootstrap.initialize();
    } catch (error) {
        console.error("Error al inicar la aplicación", error);
        process.exit(1);
    }
})();
