FROM denoland/deno:1.14.2
WORKDIR /app
COPY . .
RUN deno cache --no-check=remote bot.ts   
CMD ["run", "-A", "--no-check", "bot.ts"]