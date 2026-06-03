FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY api/ ./api/
COPY bin/ ./bin/
COPY src/ ./src/
COPY .codex/ ./.codex/
COPY index.html generator.html forge.html skills.html office.html stitch_reference.html ./
COPY skills_data.json ./
COPY assets/ ./assets/

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
