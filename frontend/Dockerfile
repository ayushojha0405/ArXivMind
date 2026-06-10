FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose Vite default port
EXPOSE 5173

# Run Vite development server
CMD ["npm", "run", "dev", "--", "--host"]
