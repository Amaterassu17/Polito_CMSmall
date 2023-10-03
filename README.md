[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s310082 GENNUSO ANGELO 

# Server side

## API Server

- POST `/api/example`
  - request parameters and request body content
  - response body content
  - "DESCRIPTION"
  - protected by authentication? YES/NO

### Authentication API

- POST `/api/sessions`
  - req.body : username, password (in our case email and password)
  - res: logged user info (id, email, username, role)
  - "LOGIN. You input your email and password and you get back your current user info"
  - protected by authentication? **NO** (it's the login route)

- DELETE `/api/sessions/current`
  - no request parameters or body content
  - no response body content
  - "LOGOUT - Deletes current session from server. If no error is returned, the user is logged out."
  - protected by authentication? **YES** (You can't logout if you are not logged in)


- GET `/api/sessions/current`
  - no request parameters or body content
  - res:  logged user info (id, email, username, role)
  - "GET CURRENT USER LOGGED IN"
  - protected by authentication? **NO** (it could either return no info if no user is logged in or the info of the user logged in)


### Titles API

- GET `/api/title`
  - no request parameters or body
  - res:  title (string) 
  - "GET THE CURRENT TITLE"
  - protected by authentication? **NO** (it's the title route. Everyone can see the title)

- PUT `/api/title`
  - no request parameters
  - res:  {title: newTitle}
  - "UPDATE TITLE - provide the new title in the body and the db will be updated"
  - protected by authentication? **YES** (only the admin can change the title, protected client and server side)


### Pages API

- GET `/api/pages`
  - no request parameters
  - res:  
    - pages:
      - [{id, title, author, creationDate, publishDate}, ...] 
  - "GET ALL PAGES - you get all the pages in the db, published or not. Mind that blocks are not included, as for this call is used just for the display of the pages in the backoffice."
  - protected by authentication? **YES** (only logged in users can see the pages in the backoffice)

- GET `/api/publishedPages`
  - no request parameters
  - res:  
    - pages:
      - [{id, title, author, creationDate, publishDate}, ...]
  - "GET ALL PUBLISHED PAGES - you get all the published pages in the db. Mind that blocks are not included, as for this call is used just for the display of the pages in the frontoffice."
  - protected by authentication? **NO** (everyone can see the published pages)

- GET `/api/pages/:id`
  - req.params: id
  - res:  page: 
    - {id, title, author, creationDate, publishDate, blocks: 
      - [{(id, type, content, relativePos)}, ...]}
  - "GET PAGE BY ID - you get the page with the specified id. Mind that blocks are included, as for this call is used to display the page in the page view."
  - protected by authentication? **GENERALLY NO** (Everyone can see published pages' details, but only logged in users can see the unpublished ones' )

- POST `/api/pages`
  - req.body: 
    - {page: title, author, publishDate, blocks : 
      - [{type, content, relativePos}, ...]}
  - res:  addedPage: {id, title, author, creationDate, publishDate, 
    - blocks : 
      - [{id, type, content, relativePos}, ...]}
  - "ADD PAGE - you add a new page to the db. Mind that the creationDate is automatically set to the current date by the server."
  - protected by authentication? **YES** (only logged in users can add pages)

- PUT `/api/pages/:id`
  - req.params: id
  - req.body: page: 
    - {title, author, publishDate, blocks : 
      - [{type, content, relativePos}, ... ]}
  - res:  updatedPage: 
    - {id, title, author, creationDate, publishDate, blocks : 
      - [{id, type, content, relativePos}, ...]}
  - "UPDATE PAGE - you update the page with the specified id. Mind that the creationDate is automatically set to the current date by the server."
  - protected by authentication? **YES**

- DELETE `/api/pages/:id`
  - req.params: id
  - res:  "Page Deleted"
  - "DELETE PAGE - you delete the page with the specified id."
  - protected by authentication? **YES** (only logged in users can delete pages, and furthermore only the author of the page can delete it. Only the admin can delete all pages)


### Users API

- GET `/api/users`
  - no request parameters
  - res: users: {id, email, username, role}
  - "GET ALL USERS - you get all the users in the db."
  - protected by authentication? **YES** (only logged in users can see the users and it is needed in a specific context where only admin user can see the users)

  


  
## Database Tables

- Table `users` - contains id, email, role, hashedPassword, salt, username
  - It is used to store the users' info: the password is Hashed and Salted
- Table `title` - contains Title
    - It is used to store the title of the website: it can be either fetched or updated
- Table `pages` - contains id, title, author, creationDate, publishDate
  - It is used to store the pages' info: the creationDate is automatically set to the current date by the server, while the publishDate is set by the user. The publishDate could also be null. In the db, it is represented by an "Invalid Date" string
- Table `blocks` - contains id, Type, Content, relativePos, PageId
  - It is used to store the blocks' info: the single blocks can be either a header, a paragraph or an image. The values cannot be NULL. The relativePos is used to order the blocks in the page view. The PageId is used to link the blocks to the page they belong to. The blocks are ordered by relativePos in the page view. If it is an image, the content is the url of the image. If it is a header or a paragraph, the content is the text of the header or the paragraph

# Client side


## React Client Application Routes

- Route `/`: Home Layout: it contains the Navbar, the Title and the various buttons
- Route `/`: Front Office: it contains all the cards used to represent the published pages
- Route `/login`: Login Layout: it contains the Login Form
- Route `/page/:id`: Page View: it contains the page content ordered as desidered
- Route `/backoffice` : Back Office : it contains all the cards used to represents all the pages (editable or not depending on user role and username)
- Route `/backoffice/changeTitle`: Change Title: it contains the form used to change the title
- Route `/backoffice/add`: Add Page: it contains the form used to add a new page
- Route `/backoffice/edit/:id`: Edit Page: it contains the form used to edit a page
- Route `/error`: Error Page: it contains the error message
- Route `*`: Not Found Page: it contains the not found message 


## Main React Components

- `App.jsx`: it contains the routes
  + Contains the logic to retrieve the title from the server
  + Contains the logic to retrieve the current active session from the server, and if existent its related user
  + Contains the logic to use all the Routes with react-router-dom


- `API.jsx`: it contains the logic to make the requests to the server
  + Contains the logic to make the requests to the server, with a set of dedicated API calls to the endpoints


- `HomeLayout.jsx`: it contains the logic to render the Home Layout 
  + Contains the logic to render the NavBar and the Outlet of the react-router-dom
  + There is a single Outlet on which I display all the possible routes


- `FrontOffice.jsx`: it contains the logic to render the published pages
  + Contains the useEffect used to call the API to retrieve the published pages
  + Contains the logic to render the published pages
  + The published pages are rendered as cards
  + Each card contains the title, the author and the publish date
  + You can go to Login Page from here
  + You can go to Back Office from here
  + You can go to the Page View from here, to see the pages' details


- `LoginLayout.jsx`: it contains the logic to login
  + Contains the logic to login
  + Contains the logic to render the login form
  + The login form contains the email and the password
  + Error messages are displayed if the email or the password are not valid
  + You can go back from here


- `PageView.jsx`: it contains the React component used to render the selected page
  + Contains the logic to retrieve the page from the server (useEffect)
  + Contains the logic to render the page header
  + The page is rendered as a list of blocks in the content part
  + Each block contains the content (based on the type paragraph, header or image)
  + You can go back from here


- `BackOffice.jsx`: it contains the logic to render the back office with all the created pages
  + Contains the logic to retrieve all the pages from the server
  + Contains the logic to render the pages
  + The pages are rendered as cards
  + Each card contains the title, the author and the publish date
  + You need to be logged in as admin to see the edit and delete buttons or be the author of that pager if User
  + You need to be logged in if you want to get to this page
  + You can go to Front Office from here
  + You can go to Add Page from here
  + You can go to Change Title from here
  + You can go to Edit Page from here
  + You can delete a page from here


- `ChangeTitle.jsx`: it contains the logic to change the title (it's a form)
  + Contains the logic to change the title (and the API call related)
  + Contains the logic to render the change title form
  + You need to be logged in as admin to see this page
  + You can go back from here


- `AddPageAndEdit.jsx`: it contains the logic to add a new page and also edit one (it's a form)
  + Contains the logic to add a new page (and the API call related)
  + Contains the logic to render the add page form
  + Contains the logic to edit a selected page (from the Back Office)
  + Contains the logic to render the edit page form
  + You need to be logged in to see this page
  + You can add a page title, page author, page publish date and blocks
  + The blocks can be added with the related button
  + The blocks can be swapped places with other blocks with the related buttons
  + The blocks can be deleted at any given time
  + If coming from edit, the page title, page author, page publish date and blocks are already filled. You can edit them
  + If the user is an admin, he can also change the author of the page
  + You can go back from here


- `ErrorPage.jsx`: it contains the logic to render the error page
  + Contains the logic to render the error page
  + Shows a message of the returned error
  + You can go back from here

  
- `NavBar.jsx` : it contains the logic to render a fully functional navigation bar.
  + It is displayed everywhere in the app 
  + Contains the buttons to Login, Switch to the other office, change the title and logout if already logged In
  + Contains the title. If clicked, it redirects to the Front Office

  

# Usage info

## Example Screenshot

[//]: # (This is the front office, where you can see all the published pages)

[//]: # (You can go to page view or to login page from here)

[//]: # ()
[//]: # (![Screenshot1.png]&#40;img%2FScreenshot1.png&#41;)

[//]: # ()
[//]: # (This is the page view, where you can see the selected page with all the titles, authors, publish dates and contents)

[//]: # ()
[//]: # (You can go back from here)

[//]: # ()
[//]: # (As you can see, it can contain header, paragraph and images)

[//]: # ()
[//]: # (![Screenshot2.png]&#40;img%2FScreenshot2.png&#41;)

[//]: # ()
[//]: # (You can login from this page)

[//]: # ()
[//]: # (![Screenshot3.png]&#40;img%2FScreenshot3.png&#41;)

[//]: # ()
[//]: # (You have a fully functional navigation bar with a login button, a switch button, a change title &#40;if admin&#41; button and a logout button)

[//]: # ()
[//]: # (![Screenshot4.png]&#40;img%2FScreenshot4.png&#41;)

[//]: # ()
[//]: # (You can change the title from here)

[//]: # ()
[//]: # (![Screenshot5.png]&#40;img%2FScreenshot5.png&#41;)

[//]: # ()
[//]: # (You are in the back office here. If admin you can do all the things)

[//]: # ()
[//]: # (![Screenshot6.png]&#40;img%2FScreenshot6.png&#41;)

[//]: # ()
[//]: # (You can add a page from here)

[//]: # ()
[//]: # (![Screenshot7.png]&#40;img%2FScreenshot7.png&#41;)

[//]: # ()
[//]: # (After adding some blocks, you can insert content in them. You can also delete or reorder them)

[//]: # ()
[//]: # (![Screenshot8.png]&#40;img%2FScreenshot8.png&#41;)

[//]: # ()
[//]: # (As you can see, we just added a new page)

[//]: # ()
[//]: # (![Screenshot9.png]&#40;img%2FScreenshot9.png&#41;)

[//]: # ()
[//]: # (As you can see, the page is filled up with content)

[//]: # ()
[//]: # (![Screenshot10.png]&#40;img%2FScreenshot10.png&#41;)

[//]: # ()
[//]: # (Now we are trying to edit the latter page)

[//]: # ()
[//]: # (![Screenshot11.png]&#40;img%2FScreenshot11.png&#41;)

[//]: # ()
[//]: # (As you can see, the page is filled up with edited content)

[//]: # ()
[//]: # (![Screenshot12.png]&#40;img%2FScreenshot12.png&#41;)

[//]: # ()
[//]: # (![Screenshot13.png]&#40;img%2FScreenshot13.png&#41;)

[//]: # ()
[//]: # (As you can see now, i just deleted the latter page)

[//]: # ()
[//]: # (![Screenshot14.png]&#40;img%2FScreenshot14.png&#41;)

[//]: # ()
[//]: # (This a screenshot of the date form in the add page form. We will be adding a new page with a publish date in the past)

[//]: # ()
[//]: # (![Screenshot15.png]&#40;img%2FScreenshot15.png&#41;)

[//]: # ()
[//]: # (Here you can see that a wrong format is not accepted &#40;at least 1 header and other type of blocks&#41;)

[//]: # ()
[//]: # (![Screenshot16.png]&#40;img%2FScreenshot16.png&#41;)

[//]: # ()
[//]: # (As you can see now, we can order the blocks in different order after pressing a button)

[//]: # ()
[//]: # (![Screenshot17.png]&#40;img%2FScreenshot17.png&#41;)

[//]: # ()
[//]: # (![Screenshot18.png]&#40;img%2FScreenshot18.png&#41;)

[//]: # ()
[//]: # (As you can see, the page is now published on the front office)

[//]: # ()
[//]: # (![Screenshot19.png]&#40;img%2FScreenshot19.png&#41;)

[//]: # ()
[//]: # (Now we are logged in as a normal user. We will try to create a new page as him. As you can see, he can't change the author)

[//]: # ()
[//]: # (![Screenshot21.png]&#40;img%2FScreenshot21.png&#41;)

[//]: # ()
[//]: # (As you can see, the page is now present. But you can also see that you can't edit other people's pages)

[//]: # ()
[//]: # (![Screenshot22.png]&#40;img%2FScreenshot22.png&#41;)

[//]: # ()
[//]: # (Finally, an example of the error page)

[//]: # ()
[//]: # (![Screenshot23.png]&#40;img%2FScreenshot23.png&#41;)

### AddPage (Non user)

![AddPage.PNG](img%2FAddPage.PNG)


### ListPages (Non user)

![ListPages.PNG](img%2FListPages.PNG)


## Users Credentials

  - userAdmin = angelo.gennuso@hknpolito.org, password = Zucchina
  - userUser1 = marco.rogo@hknpolito.org, password = Melanzana
  - userUser2 = vasco.rossi@studenti.polito.it, password = Sally
  - userUser3 = pazzomaniaco99@tiscali.it, password = DajeRomaDaje
