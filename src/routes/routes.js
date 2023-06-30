import {getProducts, createProduct, getProductById, updateProduct, deleteProduct} from "../controllers/productsController.js";
// import {getCategories, createCategory, getCategoryById, updateCategory, deleteCategory} from "../controllers/categoriesController.js";
import {getSuppliers, createSupplier, getSupplierById, updateSupplier, deleteSupplier} from "../controllers/suppliersController.js";
import {getOrders, createOrder, getOrderById, updateOrder, deleteOrder, graphing} from "../controllers/ordersController.js";
//import {getUsers, createUser, getUserById, updateUser, deleteUser, loginUser,} from "../controllers/usersController.js";
//import { loginRequired } from "../controllers/usersController.js";
import { login, register, loginRequired, getUsers } from '../controllers/usersController.js';

const routes = (app) => {
    //product routes
    app
        .route("/api/products")
        .get(getProducts)
        .post(createProduct);

    app
        .route("/api/products/:product_id")
        .get(getProductById)
        .put(updateProduct)
        .delete(deleteProduct);
    app
        .route("/api/suppliers")
        .get(getSuppliers)
        .post(loginRequired, createSupplier);

    app
        .route("/api/suppliers/:supplier_id")
        .get(getSupplierById)
        .put(loginRequired, updateSupplier)
        .delete(loginRequired, deleteSupplier);

    // Order routes
    app
        .route("/api/orders")
        .get(getOrders)
        .post(loginRequired, createOrder);
    app.route("/api/total")
        .get(graphing)
    // app.route("/api/sales/chart")
    //     .get(getSalesChartData)
    // app.route("/api/sales/overview")
    //     .get(getSalesOverview)    

    app
        .route("/api/orders/:id")
        .get(getOrderById)
        .put(loginRequired, updateOrder)
        .delete(loginRequired, deleteOrder);
    app.route('/auth/register')
        .post(register)
        .get(getUsers)
    app.route('/auth/login')
        .post(login);
    
};

export default routes;
