# CookIt

![CookIt GIF](.image/Cookit.gif)

## Project Documentation

**CookIt** is a web application that helps users keep track of their recipes, ingredients inventory, and grocery lists, all in one place. It allows users to search for recipes, save them to their recipe book, and customize them to their tastes. Additionally, users can manage their own recipes, add/edit/delete ingredients to their inventory, and create/delete items from their grocery list.

## Design

- [API Design](/apis.md)
- Data Model
- GHI
- Integrations

## Intended Market

Our target market is people who enjoy cooking, both creating their own recipes and trying out recipes found online. CookIt is especially useful for busy individuals who frequently go grocery shopping and need to keep track of what ingredients they already have and what they need for their recipes.

## Functionality

- **Account Creation**: Visitors to the site will be prompted to create an account as much of the app's features are personalized and require user authentication.
- **Recipe Search**: Once logged in, users can search for recipes in a 3rd party API database, filtered by ingredients or dietary preferences (e.g., gluten-free or dairy-free). Users can save recipes to their own recipe book for further customization.
- **Manage Personal Recipes**: Users can add their own recipes, which are displayed in cards with an image, title, and description.
- **Ingredients Inventory**: Users can add, edit, and delete ingredients to/from their inventory, along with additional notes (e.g., expiration date or if it needs thawing).
- **Grocery List**: Users can add and delete items from their grocery list, along with notes (e.g., aisle, brand preference, or variety choice).

## Getting Started

To run the CookIt project locally, follow the steps below:

1. Clone the repository
2. Install Docker on your machine if you haven't already
3. Create the Docker volume "cookit" and "pg-admin"
4. Build the Docker image "docker-compose build", "docker-compose up"
5. Run the Docker containers

Access the application at http://localhost:3000 (for the React frontend) and the respective microservice endpoints


**Team**
- Danielle Aharonov
- Caeden Lathem
- Nolan Michtavy
- Wilkin Ruiz

**Acknowledgments**

We'd like to express our gratitude to all the developers and contributors whose libraries and tools made this project possible.
