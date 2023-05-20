# set base image (host OS)
FROM --platform=linux/amd64 python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update
RUN apt-get install -y curl nano wget nginx git

# Install MongoDB
RUN curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.4.6.tgz
RUN tar -zxvf mongodb-linux-x86_64-debian10-4.4.6.tgz
RUN mv mongodb-linux-x86_64-debian10-4.4.6/ /usr/local/mongodb
RUN ln -s /usr/local/mongodb/bin/mongod /usr/bin/mongod
RUN ln -s /usr/local/mongodb/bin/mongo /usr/bin/mongo

# Install Yarn
RUN apt-get install -y gnupg2
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get -y update
RUN apt-get install -y yarn

# Install pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python get-pip.py
RUN rm get-pip.py

ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017
ENV PYTHONPATH=$PYTHONPATH:/src/

# copy the dependencies file to the working directory
COPY src/requirements.txt .

# install dependencies
RUN pip install -r requirements.txt
