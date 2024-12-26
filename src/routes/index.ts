import { Router } from "express";

import { couponsRoutes } from "./coupons-route";
import { marketsRoutes } from "./markets-route";
import { categoriesRoutes } from "./categories-route";
import { usersRoutes } from "./users-route";
import { profileRoutes } from "./profile-route";

const routes = Router();

routes.use("/categories", categoriesRoutes);
routes.use("/markets", marketsRoutes);
routes.use("/coupons", couponsRoutes);
routes.use("/users", usersRoutes);
routes.use("/profile", profileRoutes);

export { routes };
