FROM jenkins/jenkins:lts
USER root

RUN curl -fsSL https://get.docker.com | sh

ARG DOCKER_GID

RUN groupmod -g ${DOCKER_GID} docker && \
    usermod -aG docker jenkins

USER jenkins
