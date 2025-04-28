# Project P

## Overview

*Project P* is an interactive platform where your main goal is to **accumulate as much money as possible** using all available features.

Built as a **web application** fully containerized with *Docker*, it leverages *React* along with popular libraries such as *React Cookie*, *React Three*, *React Tanstack Query*, and *React Router Dom*. It also integrates *Webpack*, *Framer Motion*, *Nginx*, *Symfony*, *Mercure*, *Redis*, and *PostgreSQL*.

With *Project P*, you can **create an account**, **add friends**, **chat** with them, **transfer money** (virtual currency), and **purchase items** from the shop to **customize** your avatar — a cube!

## Getting Started

This project exclusively uses *Docker* to run.

Since it is not deployed yet, please follow these steps to run the platform locally:

1. Install [*Docker*](https://www.docker.com/products/docker-desktop/) and ensure it is running.

2. Open a terminal and clone the repository:
   ```bash
   git clone https://github.com/AdlarX9/project-p.git
   ```

3. Navigate to the project directory:
   ```bash
   cd project-p
   ```

4. Copy the sample environment file and create a new `.env` file:
   ```bash
   cp .env.sample .env
   ```

5. Start the application with Docker:
   ```bash
   docker compose up
   ```

6. Once everything is up and running, open your browser and navigate to `https://localhost` (or the address specified in your `.env` file) to start using the application.

> ⚠️ **Note:** The application will automatically generate several files necessary for its operation. Please do not modify or delete them.

## Screenshots

> ![Main Page](examples/main.png)  
> *Main dashboard*

> ![Login](examples/login.png)  
> *Login form*

> ![Friends](examples/friends.png)  
> *Friends management interface*

> ![Chat](examples/chat.png)  
> *Chat interface*

> ![Locker](examples/locker.png)  
> *Personal locker*

> ![Shop](examples/shop.png)  
> *Online shop*

> ![Item Preview](examples/view_item.png)  
> *Item preview in the shop*

> ![Settings](examples/settings.png)  
> *Settings page*

> ![Bank Transfer](examples/transfer.png)  
> *Bank transfer page*
