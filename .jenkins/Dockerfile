FROM jenkins/jenkins:lts
USER root

ARG DOCKER_GID

RUN groupadd -g ${DOCKER_GID} docker && \
    usermod -aG docker jenkins

USER jenkins
