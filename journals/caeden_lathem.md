May 15th- Nolan driving. Add SQL database, created table for user and recipes.

May 16th- Nolan driving. FastAPI integration for recipes, ingredients, measurements linked to users. I updtaed the docker-compose.yaml to change baseUrl for authentification. Merged with Nolan for user table data. (Nolan had merged with Wilken for his updated data)

May 17th- Me driving. Worked on login/logout function with auth. Merged with Nolan for other table data.

May18th-26th- Was having trouble getting a token back for login/register. We were using email to log in/register when the library we were using expected 'username'. In addition, we were struggling to get baseUrl to pass in like it was supposed to. Took several days to work through this one. Merged into auth branch as we each worked on and drove on different days.

May 30th- With auth working, I added a logout button to the nav bar.

May 31st- Wilkin driving. Added CRUD funtions for measurements, grocery list, recipes ingredients, and my ingredients. I did some code organization, made logout showing on navbar conditional to being logged in. Merged with Nolan to get flowbite-tailwind installation and Wilkin to get CRUD functions we worked on.

Jun 1st- Added full nav bar with userDetail data being pulled from the token.

Jun 2nd- Merged with main to get changes others had made and pushed (Danielle's recipe form and app styling) and other smaller updated.

Jun 5th- Merged with main to get new components, MyIndgredients, MyRecipes, GroceryList, updated my recipes tables. Updated navigation so when token not found it takes you to the signup page, added login link to sign up card for those who already have an account, added redirect to signup upon logging out, added redirect to recipe search upon logging in.

Jun 6th- I added a profile detail page and started on a edit page for the profile details. Nolan and I worked on resolving the issue where when the page loaded, it was loading null or undefined when pulling user information first.

Jun 7th- Continued work on the edit profile page and spent most of the afternoon resolving merge conflicts. Some pushes to main weren't taking or weren't pulling properly, leaving out junks of code. Once that was resolved, I finished refactoring the pages I didn't have to load it's own currentUser data.
