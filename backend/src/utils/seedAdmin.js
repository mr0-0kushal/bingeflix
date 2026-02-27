const adminExists = await User.findOne({ role: "admin" });

if (!adminExists) {
    await User.create({
        fullname: "Admin",
        username: "admin",
        email: "admin@bingeflix.com",
        password: "StrongPassword123",
        phone: "9999999999",
        role: "admin"
    });
}