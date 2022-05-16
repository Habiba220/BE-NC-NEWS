# Northcoders News API

## Cloning Repository

Ensure that you have cloned down the repo first.

You can create your own public repo so that you can share this project later on by doing the following:

Create a new **public GitHub repository**. Do not initialise the project with a readme, .gitignore or license.
From your cloned local version of this project you'll want to push your code to your new repository using the following commands:

```
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```


## Installing Dependencies

Run the following command in your terminal to install all dependencies included in the package.json file: 

```
npm install
```


## Instructions for setting up project 

Creating the environment variables for anyone who wishes to clone the project and run it locally

We'll have two databases in this project. One for real looking dev data and another for simpler test data.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.