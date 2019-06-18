TopTalentsOnline is a community web application where you can find IT professionals and contact them. They can see the listing of IT experts categorized by their main skills and subskills.

A visitor can search through the websites and browse developers by categories (e.g. web developer, data developer, mobile developer) and subcategories (React, Angular, Python, Rails, Node.js, Go; Oracle, SQL Server, ETL, Data, Machine Learning; iOS, Android, ...)

A public part accessible by a visitor should contain
* a search screen with profiles listed and category filter
* a profile screen for each developer
* contact screen where a user can send his information to reach out the developer and the message should be sent to this developer by email

Developers must be able to create an account and log in. 
When logged in, a user can see, edit and delete their profile information.

Implement two roles with different permission levels: 
* a regular user that can sign in an be able to manage his profile
* an admin that can manage all user profiles and information

A profile contains the following information 
* first name, last name, country, city
* specialisation (web development, data engineer, mobile developer, ...) and sub specialisations 
* All received enquiries by visitors
REST API. 
* Make it possible to perform all user actions via the API, including authentication 

In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.

If it's a web application, it must be a single-page application. All actions need to be done client side using AJAX, refreshing the page is not acceptable.

Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.

Bonus: unit and e2e tests.