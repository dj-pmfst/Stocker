FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile=false

COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

RUN cp -r src/generated dist/src/generated

FROM node:22-alpine AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma.config.ts ./prisma.config.ts
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]