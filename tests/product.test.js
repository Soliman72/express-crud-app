const app = require("../app");
const request = require("supertest");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");
let token;

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URL || "mongodb://localhost:27017/express-crud-app"
  );
  // register and login user to get a token
  const userData = {
    name: "Soliman",
    email: "solo2@solo.so",
    password: "123123123",
  };

  await request(app).post("/auth/register").send(userData);
  const res = await request(app)
    .post("/auth/login")
    .send({ email: userData.email, password: userData.password });
  token = res.body.data.token;
  console.log("Tooookkkkken ", token);
});

const productData = {
  name: "Test Product",
  price: 100,
  description: "A sample test product",
};

describe("Product API", () => {
  it("should allow authenticated users to create a product", async () => {
    const res = await request(app)
      .post("/products/create")
      .set("Authorization", `Bearer ${token}`) // Use the token for authentication
      .send(productData);

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toHaveProperty("_id");
    expect(res.body.product.name).toBe(productData.name);
  });

  it("should prevent unauthenticated users from creating a product", async () => {
    const res = await request(app).post("/products/create").send(productData);

    expect(res.statusCode).toBe(401); // Expect unauthorized status
    expect(res.body.message).toBe("No token, authorization denied");
  });

  it("should get all products for authenticated users", async () => {
    const res = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("number of products");
  });

  it("should prevent the user doesn't have permition (un Admin) to delete product", async () => {
    const createRes = await request(app)
      .post("/products/create")
      .set("Authorization", `Bearer ${token}`) // Use the token for authentication
      .send(productData);

    const productId = createRes.body.product._id;

    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access denied. Admins only.");
  });
});
// disconnect MongoDB
afterAll(async () => {
  await Product.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
});
