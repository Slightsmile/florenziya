Build a modern, responsive e-commerce website for a Bangladesh-based sunglasses brand called **Florenziya**.

The website should be built using **React** with a clean, maintainable component structure. Focus on a premium fashion and lifestyle appearance that works especially well on mobile devices, since most customers will likely visit from Facebook and Instagram.

## Brand & Social Links

Use the following social media links in the website footer and social media sections:

- Facebook: https://www.facebook.com/florenziya.official
- Instagram: https://www.instagram.com/shop.florenziya

The brand logo and all product photos are already available inside the project's **public folder**. Use these existing assets instead of external placeholder images.

---

# Website Requirements

## 1. Landing Page

Create a visually attractive landing page with the following sections:

### Header / Navigation
- Display the Florenziya logo from the public folder.
- Navigation links such as Home and Products.
- Shopping cart icon with the current number of items in the cart.
- Make the header responsive for mobile and desktop.

### Hero Section
Create a stylish fashion-focused hero section introducing the sunglasses collection.

Include:
- A strong headline related to sunglasses and fashion.
- A short description.
- A "Shop Now" button that scrolls to the product section.

Use product imagery from the public folder where appropriate.

### Products Section
The main landing page should display all available sunglasses as product cards.

Each product card should include:
- Product image
- Product name
- Product price
- Optional short description
- Quantity selector or quantity controls
- **Add to Cart** button

Products should be managed from a simple JavaScript/JSON data structure so that new products can easily be added later.

Example product structure:

```js
{
  id: 1,
  name: "Classic Black Sunglasses",
  price: 1200,
  image: "/products/product-1.jpg"
}
```

Do not hardcode product cards individually. Use a reusable ProductCard component and map through the product data.

---

# 2. Shopping Cart

Implement a fully functional shopping cart.

The customer should be able to:

- Add products to the cart.
- Increase or decrease product quantities.
- Remove products from the cart.
- View the subtotal.
- See the total number of items in the cart.

The cart should persist while the customer navigates around the website. Use React state management such as Context API or another simple, appropriate solution.

Make the cart easy to use on mobile devices. A cart drawer, modal, or dedicated cart page can be used.

---

# 3. Checkout and Order Form

When the customer proceeds to checkout, display a clear order summary and a customer information form.

The checkout form must collect:

- Customer Name
- Phone Number
- Full Address
- Delivery Location

For delivery location, provide two options:

1. **Inside Dhaka — ৳70 delivery charge**
2. **Outside Dhaka — ৳130 delivery charge**

The delivery charge should automatically update based on the customer's selected location.

The order summary should clearly show:

- Selected products
- Quantity of each product
- Product subtotal
- Delivery charge
- Grand total

Example:

```text
Product Subtotal: ৳2,400
Delivery Charge: ৳70
----------------------
Total: ৳2,470
```

Validate all required fields before allowing the customer to place the order.

For the phone number, include basic Bangladesh phone number validation.

---

# 4. Order Storage in Excel

When a customer successfully places an order, save the order information to an **Excel sheet**.

The Excel sheet should contain the following information:

- Order ID
- Date and time
- Product Name
- Product Quantity
- Customer Name
- Customer Address
- Customer Phone Number
- Delivery Location (Inside Dhaka / Outside Dhaka)
- Delivery Charge
- Order Total

If an order contains multiple products, store the product names and quantities clearly, either as separate rows or in a structured format.

## Important Implementation Requirement

Since a React frontend alone should not directly write to an Excel file on the server, implement a suitable backend/API solution.

Recommended approach:

- React frontend for the website.
- A lightweight backend API using Node.js/Express or serverless functions.
- When an order is placed, send the order data to the backend.
- The backend should append the order to an Excel `.xlsx` file using a suitable library such as `xlsx` or `exceljs`.

Alternatively, Google Sheets API can be used as the order database if it provides a more reliable production solution, while still allowing the business owner to manage orders in a spreadsheet.

The system should be designed so that customer orders are not lost when multiple customers place orders.

---

# 5. Order Confirmation

After a successful order:

- Show a clear success message.
- Display the order ID.
- Thank the customer for their order.
- Clear the shopping cart.

Example message:

**"Thank you for your order! We have received your order successfully and will contact you soon to confirm it."**

---

# 6. Footer

Create a professional footer containing:

- Florenziya logo
- Short brand description
- Facebook link: https://www.facebook.com/florenziya.official
- Instagram link: https://www.instagram.com/shop.florenziya
- Copyright information

Use recognizable social media icons.

---

# Design Requirements

The website should have a premium, elegant fashion-store appearance.

Focus on:

- Clean and modern layout
- High-quality presentation of product images
- Large, attractive product photography
- Good typography
- Plenty of spacing
- Smooth hover effects and subtle animations
- Fully responsive design
- Mobile-first approach

The design should feel appropriate for a fashionable sunglasses brand rather than a generic e-commerce template.

Use a consistent color palette that complements the provided Florenziya logo and product images.

---

# Technical Requirements

Use:

- React
- Modern JavaScript or TypeScript
- Reusable components
- Responsive CSS (Tailwind CSS is recommended, but another clean styling solution is acceptable)
- React state management for the shopping cart
- Backend API for order submission
- Excel integration for order storage

Suggested component structure:

```text
src/
├── components/
│   ├── Header
│   ├── Hero
│   ├── ProductCard
│   ├── ProductGrid
│   ├── Cart
│   ├── CheckoutForm
│   └── Footer
├── context/
│   └── CartContext
├── data/
│   └── products
├── pages/
│   └── Home
└── App
```

Make the code clean, production-ready, and easy to maintain.

Before finishing, ensure that:

- All images and the logo are loaded correctly from the public folder.
- Add to Cart functionality works correctly.
- Cart quantities update correctly.
- Delivery charges are calculated correctly.
- The order total is accurate.
- Required customer information is validated.
- Orders are successfully saved to the spreadsheet.
- The website works properly on both mobile and desktop.
- Facebook and Instagram links open the correct official Florenziya pages.