FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack install

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3005

CMD ["pnpm", "start:prod"]