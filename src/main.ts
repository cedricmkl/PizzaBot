import PizzaBot from "./bot/PizzaBot";

require("dotenv").config();

console.log("Loading Pizza Bot")
const pizzaBot = new PizzaBot();
pizzaBot.connect()