flowchart TD
    Start[Start] --> Home[Landing Page]
    Home --> Browse[Browse Products]
    Home --> AuthCheck{User Signed In}
    AuthCheck -->|Yes| Dashboard[Customer Dashboard]
    AuthCheck -->|No| SignIn[Sign In Page]
    Home --> SignUp[Sign Up Page]
    SignIn --> AuthProcess[Validate Credentials]
    SignUp --> AuthProcess
    AuthProcess -->|Success| Dashboard
    AuthProcess -->|Failure| SignIn
    Browse --> ProductDetail[Product Detail Page]
    ProductDetail --> AddCart[Add Item to Cart]
    AddCart --> Cart[View Cart]
    Cart --> Checkout[Checkout Page]
    Checkout --> Shipping[Enter Shipping Info]
    Shipping --> Payment[Enter Payment Info]
    Payment --> OrderReview[Review Order]
    OrderReview --> PlaceOrder[Place Order]
    PlaceOrder --> Confirmation[Order Confirmation]
    Dashboard --> OrderHistory[View Order History]
    Dashboard --> AccountSettings[Manage Account]