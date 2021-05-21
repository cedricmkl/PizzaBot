import PizzaBot from "./bot/PizzaBot";

require("dotenv").config();

const pizzaBot = new PizzaBot();
pizzaBot.connect()