<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/afrmounir/online_shop">
    <!-- <img src="public/images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

  <h3 align="center">Online Shop</h3>

  <p align="center">
    Server-side rendered views online shop (including checkout, payments, uploading files, PDF invoices, e-mails).
    <br />
    <br />
    It's hosted on heroku and currently live at <a href="https://online-shop-node-express-mongo.herokuapp.com">online-shop-node-express-mongo.herokuapp.com.</a>
    It's free hosting so there is no file persistence. Also the server goes to sleep and redeploys on demand so the first load will be slow.
    <a href="https://github.com/afrmounir/online_shop"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## A propos du projet

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Development of an online shop from scratch.

Features:

- Rendering HTML Dynamically (on the Server)
- Using Express.js
- Using Node.js with NoSQL (MongoDB) and Mongoose
- File Up and Download
- Working with Files and generating PDFs on the Server (on-the-fly)
- Using the Model-View-Controller (MVC) Pattern
- Compression
- Working with Sessions & Cookies
- User Authentication and Authorization (include CSRF protection)
- Sending E-Mails (During registration and when resetting the password with a link containing a personalized token against fraud)
- Validating User Input (on the Server)
- Data Pagination (on the Server)
- Handling Payments

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Express
- Mongodb
- Mongoose
- Stripe
- PDFKit
- Bcryptjs
- Nodemailer
- EJS
- CSurf
- Express-session
- Express-validator
- Dotenv

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node 16.16.0
- A MongoDB database
- A Stripe API key
- A Mailtrap API key (if you want to use another service you have to modify the transport in the auth controller)

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:afrmounir/online_shop.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file at the root and set the followings environment variables:
   ```
   MONGODB_KEY=""
   STRIPE_KEY=""
   SENDGRID_API_KEY=""
   VERIFIED_SENDGRID_SENDER="your verified sender email"
   SESSION_SECRET=""
   ```
4. In 'views/shop/checkout.ejs' set your own public Stripe API Key
   ```
   const stripe = Stripe("STRIPE_PUBLIC_KEY_");
   ```
5. Run the project
   ```sh
   npm start
   ```
6. Open 'http://localhost:3000' in Chrome

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->

## Roadmap

- [x] Rendering HTML Dynamically (on the Server)
- [x] Working with MongoDb and Mongoose
- [x] Shop structure (navigation, adding, storing, editing and deleting products)
- [x] Sessions & Cookies
- [x] Sending E-mails
- [x] Improve authentication (CSRF protection & reset password token link)
- [x] Adding error Handling
- [x] Handling file upload and download
- [x] Adding Pagination
- [x] Adding Payments
- [ ] Tests
- [x] Deploying

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: public/images/capture.gif

