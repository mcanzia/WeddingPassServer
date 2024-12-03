<template>
    <div class="flex items-center justify-center w-full h-screen">
        <div class="loader-image">
            <!-- <div id="heart"></div> -->
            <img src="/images/color-logo.svg" alt="Loader Image" />
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loader-image {
    position: relative;
    width: 80vw;
    height: 80vw;
    max-width: 150px;
    max-height: 150px;
}

/* .loader-image img {
    display: block;
    object-fit: cover;
} */

/* #heart {
    position: relative;
    width: 100px;
    height: 90px;
    animation: heartbeat 2s infinite;
    margin: 0 auto
}

#heart:before,
#heart:after {
    position: absolute;
    content: "";
    left: 50px;
    top: 0;
    width: 50px;
    height: 80px;
    background: #fff;
    -moz-border-radius: 50px 50px 0 0;
    border-radius: 50px 50px 0 0;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 0 100%;
    -moz-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    -o-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

#heart:after {
    left: 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform-origin: 100% 100%;
    -moz-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    -o-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
}



@keyframes heartbeat {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1);
    }

    100% {
        transform: scale(0);
    }
} */

.loader-image img {
  display: block;
  object-fit: cover;
  animation: diagonal-wipe 5s infinite ease-in-out;
}

@keyframes diagonal-wipe {
  0% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
  50% {
    clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%);
  }
  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
</style>
