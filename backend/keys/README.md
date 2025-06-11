# LLAVES

Las llaves nunca se guardan en el repositorio.
Para generar las llaves hay que usar los siguientes comandos:

> openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048

> openssl rsa -pubout -in private.key -out public.key
