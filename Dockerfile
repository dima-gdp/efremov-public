ARG CI
FROM $CI
ENV HOST 0

COPY src/public/ /app/

WORKDIR /app/

RUN npm set registry "https://npm.s256.dev" && \
    npm set //npm.s256.dev/:_authToken="/mQbVPu2/NRv5AF5GdUR4RD87gkH2PTgjZABLVo6LgE="

CMD npm run start
